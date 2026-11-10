import { createServer } from 'node:http'
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, extname, join, resolve, sep } from 'node:path'
import { defaultContent, validateContent } from './content.js'

const storePath = join(process.env.DATA_DIR || join(resolve('.'), 'server', 'data'), 'records.json')
const staticDirectory = resolve('dist')
let runtimeEnv = process.env
const cookieName = 'mfi_admin_session'
const sessionTtlSeconds = 8 * 60 * 60
const registrationCities = new Set(['Chennai', 'Coimbatore', 'Madurai', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Dubai', 'Other'])
const registrationProfessions = new Set(['Student', 'Business owner', 'Salaried professional', 'Finance professional', 'Homemaker', 'Educator', 'Other'])
const requestCounts = new Map()
let writeQueue = Promise.resolve()

const emptyStore = () => ({ settings: { telegramUrl: '', whatsappUrl: '' }, webinars: [], spotlights: [], registrations: [], bookings: [] })

function send(response, status, body, extraHeaders = {}) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders })
  response.end(JSON.stringify(body))
}

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

async function serveFrontend(request, response, pathname) {
  let requestedPath
  try { requestedPath = decodeURIComponent(pathname) } catch { requestedPath = '/' }
  const candidate = resolve(staticDirectory, `.${requestedPath}`)
  const safePath = candidate === staticDirectory || candidate.startsWith(`${staticDirectory}${sep}`)
  let filePath = safePath ? candidate : resolve(staticDirectory, 'index.html')
  let body
  try {
    body = await readFile(filePath)
  } catch {
    if (extname(requestedPath)) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' })
      response.end('Not found.')
      return
    }
    filePath = resolve(staticDirectory, 'index.html')
    try { body = await readFile(filePath) } catch {
      response.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' })
      response.end('The frontend build is not available.')
      return
    }
  }
  const extension = extname(filePath).toLowerCase()
  const cacheControl = filePath.includes(`${sep}assets${sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache'
  response.writeHead(200, { 'Content-Type': contentTypes[extension] || 'application/octet-stream', 'Cache-Control': cacheControl })
  response.end(request.method === 'HEAD' ? undefined : body)
}

async function readStore() {
  if (runtimeEnv.DB) {
    const [settings, ...collections] = await Promise.all([
      runtimeEnv.DB.prepare('SELECT data FROM app_settings WHERE id = 1').first(),
      ...['webinars', 'spotlights', 'registrations', 'bookings'].map((table) => runtimeEnv.DB.prepare(`SELECT data FROM ${table}`).all()),
    ])
    return {
      ...emptyStore(),
      settings: settings ? JSON.parse(settings.data) : emptyStore().settings,
      ...Object.fromEntries(['webinars', 'spotlights', 'registrations', 'bookings'].map((key, index) => [key, (collections[index].results || []).map((row) => JSON.parse(row.data))])),
    }
  }
  try {
    return { ...emptyStore(), ...JSON.parse(await readFile(storePath, 'utf8')) }
  } catch (error) {
    if (error.code === 'ENOENT') return emptyStore()
    throw error
  }
}

async function updateStore(update) {
  writeQueue = writeQueue.catch(() => {}).then(async () => {
    if (runtimeEnv.DB) {
      const before = await readStore()
      const store = structuredClone(before)
      const result = await update(store)
      const statements = []
      if (JSON.stringify(before.settings) !== JSON.stringify(store.settings)) {
        statements.push(runtimeEnv.DB.prepare('INSERT INTO app_settings (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data').bind(JSON.stringify(store.settings)))
      }
      for (const table of ['webinars', 'spotlights', 'registrations', 'bookings']) {
        const previous = new Map((before[table] || []).map((item) => [item.id, item]))
        const current = new Map((store[table] || []).map((item) => [item.id, item]))
        for (const [id, item] of current) {
          if (JSON.stringify(previous.get(id)) !== JSON.stringify(item)) {
            statements.push(runtimeEnv.DB.prepare(`INSERT INTO ${table} (id, data) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data`).bind(id, JSON.stringify(item)))
          }
        }
        for (const id of previous.keys()) {
          if (!current.has(id)) statements.push(runtimeEnv.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id))
        }
      }
      if (statements.length) await runtimeEnv.DB.batch(statements)
      return result
    }
    const store = await readStore()
    const result = await update(store)
    await mkdir(dirname(storePath), { recursive: true })
    const temporaryPath = `${storePath}.${randomUUID()}.tmp`
    await writeFile(temporaryPath, JSON.stringify(store, null, 2), 'utf8')
    await rename(temporaryPath, storePath)
    return result
  })
  return writeQueue
}

const normalise = (value, max = 500) => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : ''
const emailIsValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const isFutureDate = (value) => Number.isFinite(Date.parse(value)) && Date.parse(value) > Date.now()
const isTimeZone = (value) => {
  try { new Intl.DateTimeFormat('en-US', { timeZone: value }).format(); return true }
  catch { return false }
}

function validHttpsUrl(value, allowedHosts = []) {
  try {
    const url = new URL(value)
    const hostname = url.hostname.toLowerCase()
    const zoomHost = hostname === 'zoom.us' || hostname.endsWith('.zoom.us') || hostname === 'zoom.com' || hostname.endsWith('.zoom.com')
    return url.protocol === 'https:' && !url.username && !url.password && (!allowedHosts.length || allowedHosts.includes(hostname) || (allowedHosts.includes('*.zoom.us') && zoomHost))
  } catch {
    return false
  }
}

async function readJson(request) {
  let body = ''
  for await (const chunk of request) {
    body += chunk
    if (body.length > 100_000) throw new Error('Request body is too large.')
  }
  try {
    return JSON.parse(body || '{}')
  } catch {
    throw new Error('Request body must be valid JSON.')
  }
}

function rateLimited(request, limit, keySuffix = '') {
  const key = `${request.socket.remoteAddress || 'unknown'}:${keySuffix}`
  const now = Date.now()
  const record = requestCounts.get(key) || { started: now, count: 0 }
  if (now - record.started > 15 * 60 * 1000) {
    requestCounts.set(key, { started: now, count: 1 })
    return false
  }
  record.count += 1
  requestCounts.set(key, record)
  return record.count > limit
}

function sign(value) {
  return createHmac('sha256', runtimeEnv.ADMIN_SESSION_SECRET || '').update(value).digest('base64url')
}

function makeSession() {
  const expires = Math.floor(Date.now() / 1000) + sessionTtlSeconds
  const payload = Buffer.from(JSON.stringify({ exp: expires, nonce: randomUUID() })).toString('base64url')
  return `${payload}.${sign(payload)}`
}

function hasAdminSession(request) {
  const token = (request.headers.cookie || '').split(';').map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1)
  if (!token || !runtimeEnv.ADMIN_SESSION_SECRET) return false
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false
  const expected = Buffer.from(sign(payload))
  const received = Buffer.from(signature)
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return false
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')).exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

function adminCookie(value, maxAge = sessionTtlSeconds) {
  const secure = runtimeEnv.NODE_ENV === 'production' ? '; Secure' : ''
  return `${cookieName}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`
}

function requireAdmin(request, response) {
  if (hasAdminSession(request)) return true
  send(response, 401, { message: 'Please sign in to manage webinars.' })
  return false
}

async function zoomRequest(path, options = {}) {
  const { ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET } = runtimeEnv
  if (!ZOOM_ACCOUNT_ID || !ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET) {
    const error = new Error('Zoom is not configured. Add the Zoom Server-to-Server OAuth credentials to the backend environment.')
    error.status = 503
    throw error
  }
  const credentials = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')
  const tokenResponse = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(ZOOM_ACCOUNT_ID)}`, {
    method: 'POST',
    headers: { Authorization: `Basic ${credentials}` },
  })
  if (!tokenResponse.ok) throw new Error('Zoom authentication failed. Check the Server-to-Server OAuth app credentials and scopes.')
  const { access_token: accessToken } = await tokenResponse.json()
  const response = await fetch(`https://api.zoom.us/v2${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', ...options.headers },
  })
  if (!response.ok) throw new Error('Zoom could not complete the meeting request. Check account permissions, meeting fields, and rate limits.')
  return response.status === 204 ? null : response.json()
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
}

async function sendEmail(registration, webinar) {
  const { RESEND_API_KEY, MAIL_FROM } = runtimeEnv
  if (!RESEND_API_KEY || !MAIL_FROM) return 'not_configured'
  const title = escapeHtml(webinar.title)
  const date = escapeHtml(new Date(webinar.startsAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short', timeZone: webinar.timeZone || 'Asia/Kolkata' }))
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: [registration.email],
      subject: `Your webinar details: ${webinar.title}`,
      html: `<p>Hello ${escapeHtml(registration.name)},</p><p>Your registration is confirmed for <strong>${title}</strong> on ${date}.</p><p><a href="${escapeHtml(webinar.joinUrl)}">Join the webinar on Zoom</a></p><p>We will send a reminder before the session.</p>`,
    }),
  })
  if (!response.ok) {
    console.error('Resend notification failed:', response.status)
    return 'failed'
  }
  return 'accepted'
}

async function sendWhatsApp(registration, webinar) {
  const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_TEMPLATE_NAME, WHATSAPP_TEMPLATE_LANGUAGE_CODE, WHATSAPP_GRAPH_API_VERSION } = runtimeEnv
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_TEMPLATE_NAME || !WHATSAPP_GRAPH_API_VERSION) return 'not_configured'
  const to = registration.phone.replace(/\D/g, '')
  const date = new Date(webinar.startsAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: webinar.timeZone || 'Asia/Kolkata' })
  const response = await fetch(`https://graph.facebook.com/${WHATSAPP_GRAPH_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'template',
      template: {
        name: WHATSAPP_TEMPLATE_NAME,
        language: { code: WHATSAPP_TEMPLATE_LANGUAGE_CODE || 'en' },
        components: [{ type: 'body', parameters: [
          { type: 'text', text: registration.name },
          { type: 'text', text: webinar.title },
          { type: 'text', text: date },
          { type: 'text', text: webinar.joinUrl },
        ] }],
      },
    }),
  })
  if (!response.ok) {
    console.error('WhatsApp template delivery failed:', response.status)
    return 'failed'
  }
  return 'accepted'
}

function publicWebinar(webinar) {
  if (!webinar) return null
  const { id, title, description, startsAt, durationMinutes, timeZone, speaker, joinUrl, registrationUrl, ctaLabel } = webinar
  return { id, title, description, startsAt, durationMinutes, timeZone, speaker, joinUrl, registrationUrl, ctaLabel }
}

export function createApiServer() {
  return createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    const origin = request.headers.origin || ''
    const allowedOrigin = runtimeEnv.CORS_ORIGIN || 'http://localhost:5173'
    response.writeHead(origin === allowedOrigin ? 204 : 403, {
      ...(origin === allowedOrigin ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Credentials': 'true', 'Vary': 'Origin' } : {}),
    })
    response.end()
    return
  }

  const url = new URL(request.url, `http://${request.headers.host}`)
  const method = request.method
  try {
    if (method === 'GET' && url.pathname === '/api/health') {
      send(response, 200, { ok: true, service: 'mubsa-webinar-api' })
      return
    }

    if (method === 'GET' && url.pathname === '/api/site-content') {
      const store = await readStore()
      const webinars = store.webinars.filter((item) => item.status === 'published' && Date.parse(item.startsAt) > Date.now()).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt))
      const spotlights = (store.spotlights || []).filter((item) => item.status === 'published' && (!item.expiresAt || Date.parse(item.expiresAt) > Date.now()))
      const content = { ...defaultContent, ...store.settings.content }
      const evergreenSlides = content.courses.map(course => ({ id: `course-${course.slug}`, type:'promotion', label:'COURSE SPOTLIGHT', title:course.name, description:course.description, ctaLabel:'Explore course', href:`/courses/${course.slug}` }))
      const slides = [
        ...webinars.map((item) => ({ id: item.id, type: 'session', label: 'UPCOMING LIVE SESSION', title: item.title, description: item.description, startsAt: item.startsAt, timeZone: item.timeZone, speaker: item.speaker, durationMinutes: item.durationMinutes, joinUrl: item.joinUrl, registrationUrl: item.registrationUrl || '', ctaLabel: item.ctaLabel || content.registrationLabel, href: '' })),
        ...spotlights.map(({ id, type, title, description, ctaLabel, href }) => ({ id, type, label: type === 'collaboration' ? 'COLLABORATION' : 'FEATURED ANNOUNCEMENT', title, description, ctaLabel, href })),
        ...evergreenSlides,
      ].slice(0, 8)
      const webinar = webinars[0] || null
      send(response, 200, { webinar: publicWebinar(webinar), slides, telegramUrl: store.settings.telegramUrl, whatsappUrl: store.settings.whatsappUrl, content, webinars: webinars.map(publicWebinar) })
      return
    }

    if (method === 'POST' && url.pathname === '/api/webinar-registrations') {
      if (rateLimited(request, 12, 'webinar-registration')) {
        send(response, 429, { message: 'Too many registration requests. Please try again later.' })
        return
      }
      const payload = await readJson(request)
      const registration = {
        id: randomUUID(),
        reference: `MFI-W-${new Date().getFullYear()}-${randomUUID().slice(0, 6).toUpperCase()}`,
        webinarId: normalise(payload.webinarId, 100),
        name: normalise(payload.name, 120),
        email: normalise(payload.email, 254).toLowerCase(),
        phone: normalise(payload.phone, 30),
        city: normalise(payload.city, 100),
        profession: normalise(payload.profession, 100),
        consent: payload.consent === true,
        createdAt: new Date().toISOString(),
      }
      const errors = {}
      if (registration.name.length < 2) errors.name = 'Enter your full name.'
      if (!emailIsValid(registration.email)) errors.email = 'Enter a valid email address.'
      if (registration.phone.replace(/\D/g, '').length < 10) errors.phone = 'Enter a valid mobile or WhatsApp number with country code.'
      if (!registrationCities.has(registration.city)) errors.city = 'Choose a city from the list.'
      if (!registrationProfessions.has(registration.profession)) errors.profession = 'Choose a profession from the list.'
      if (!registration.consent) errors.consent = 'Consent is required to send webinar details.'
      const store = await readStore()
      const webinar = store.webinars.find((item) => item.id === registration.webinarId && item.status === 'published' && Date.parse(item.startsAt) > Date.now())
      if (!webinar) errors.webinarId = 'There is no upcoming webinar available for registration.'
      if (Object.keys(errors).length) {
        send(response, 422, { message: 'Please correct the highlighted information.', errors })
        return
      }
      registration.delivery = { email: 'pending', whatsapp: 'pending' }
      await updateStore((current) => { current.registrations.unshift(registration) })
      const [email, whatsapp] = await Promise.all([
        sendEmail(registration, webinar).catch((error) => { console.error('Email provider request failed:', error.message); return 'failed' }),
        sendWhatsApp(registration, webinar).catch((error) => { console.error('WhatsApp provider request failed:', error.message); return 'failed' }),
      ])
      await updateStore((current) => {
        const saved = current.registrations.find((item) => item.id === registration.id)
        if (saved) saved.delivery = { email, whatsapp }
      })
      send(response, 201, {
        reference: registration.reference,
        delivery: { email, whatsapp },
        message: email === 'accepted' && whatsapp === 'accepted'
          ? 'You are registered. Webinar details have been accepted by the email and WhatsApp providers.'
          : 'Your registration is saved. Please keep your reference and contact the team if you need joining details.',
      })
      return
    }

    if (method === 'POST' && url.pathname === '/api/booking-requests') {
      if (rateLimited(request, 12, 'booking')) {
        send(response, 429, { message: 'Too many requests. Please try again later.' })
        return
      }
      const payload = await readJson(request)
      const booking = {
        id: randomUUID(),
        reference: `MFI-${new Date().getFullYear()}-${randomUUID().slice(0, 6).toUpperCase()}`,
        fullName: normalise(payload.fullName, 120),
        email: normalise(payload.email, 254).toLowerCase(),
        phone: normalise(payload.phone, 30),
        city: normalise(payload.city, 100),
        course: normalise(payload.course, 100),
        preferredDate: normalise(payload.preferredDate, 30),
        preferredTime: normalise(payload.preferredTime, 30),
        message: normalise(payload.message, 2000),
        consent: payload.consent === true,
        status: 'requested',
        createdAt: new Date().toISOString(),
      }
      const errors = {}
      if (booking.fullName.length < 2) errors.fullName = 'Enter your full name.'
      if (!emailIsValid(booking.email)) errors.email = 'Enter a valid email address.'
      if (booking.phone.replace(/\D/g, '').length < 7) errors.phone = 'Enter a valid phone number.'
      const bookingStore = await readStore()
      if (!(bookingStore.settings.content?.courses || defaultContent.courses).some(course => course.name === booking.course)) errors.course = 'Choose one of the available courses.'
      if (!booking.consent) errors.consent = 'Consent is required before submitting a request.'
      if (Object.keys(errors).length) {
        send(response, 422, { message: 'Please correct the highlighted information.', errors })
        return
      }
      await updateStore((store) => { store.bookings.unshift(booking) })
      send(response, 201, { reference: booking.reference, message: 'Your request has been received. Mubsa Fin Institute will contact you using the details provided.' })
      return
    }

    if (method === 'POST' && url.pathname === '/api/admin/login') {
      if (rateLimited(request, 8, 'admin-login')) {
        send(response, 429, { message: 'Too many sign-in attempts. Please wait and try again.' })
        return
      }
      if (!runtimeEnv.ADMIN_EMAIL || !runtimeEnv.ADMIN_PASSWORD || !runtimeEnv.ADMIN_SESSION_SECRET) {
        send(response, 503, { message: 'Admin sign-in is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET on the API server.' })
        return
      }
      const { email, password } = await readJson(request)
      if (normalise(email, 254).toLowerCase() !== runtimeEnv.ADMIN_EMAIL.toLowerCase() || password !== runtimeEnv.ADMIN_PASSWORD) {
        send(response, 401, { message: 'Email or password is incorrect.' })
        return
      }
      send(response, 200, { authenticated: true }, { 'Set-Cookie': adminCookie(makeSession()) })
      return
    }

    if (method === 'GET' && url.pathname === '/api/admin/session') {
      send(response, hasAdminSession(request) ? 200 : 401, { authenticated: hasAdminSession(request) })
      return
    }

    if (method === 'POST' && url.pathname === '/api/admin/logout') {
      send(response, 200, { authenticated: false }, { 'Set-Cookie': adminCookie('', 0) })
      return
    }

    if (url.pathname.startsWith('/api/admin/')) {
      if (!requireAdmin(request, response)) return
      if (method === 'GET' && url.pathname === '/api/admin/content') {
        const store = await readStore()
        send(response, 200, { ...defaultContent, ...store.settings.content })
        return
      }
      if (method === 'PUT' && url.pathname === '/api/admin/content') {
        let content
        try { const previous = await readStore(); content = validateContent({ ...defaultContent, ...previous.settings.content, ...await readJson(request) }) }
        catch (error) { send(response, 422, { message: error.message }); return }
        await updateStore((store) => { store.settings.content = content })
        send(response, 200, content)
        return
      }
      if (method === 'PATCH' && /^\/api\/admin\/bookings\/[\w-]+$/.test(url.pathname)) {
        const { status } = await readJson(request)
        if (!['requested', 'contacted', 'closed'].includes(status)) { send(response, 422, { message: 'Choose a valid enquiry status.' }); return }
        const saved = await updateStore((store) => {
          const booking = store.bookings.find((item) => item.id === url.pathname.split('/').at(-1))
          if (booking) booking.status = status
          return booking
        })
        send(response, saved ? 200 : 404, saved || { message: 'Enquiry not found.' })
        return
      }
      if (method === 'GET' && url.pathname === '/api/admin/dashboard') {
        const store = await readStore()
        send(response, 200, { settings: store.settings, webinars: store.webinars, spotlights: store.spotlights || [], registrations: store.registrations, bookings: store.bookings })
        return
      }
      if (method === 'POST' && url.pathname === '/api/admin/spotlights') {
        const payload = await readJson(request)
        const item = {
          id: randomUUID(),
          type: payload.type === 'collaboration' ? 'collaboration' : 'promotion',
          title: normalise(payload.title, 140),
          description: normalise(payload.description, 500),
          ctaLabel: normalise(payload.ctaLabel, 48),
          href: normalise(payload.href, 500),
          expiresAt: normalise(payload.expiresAt, 60),
          status: payload.status === 'draft' ? 'draft' : 'published',
          createdAt: new Date().toISOString(),
        }
        const hrefIsValid = !item.href || item.href.startsWith('/') && !item.href.startsWith('//') || validHttpsUrl(item.href)
        if (item.title.length < 3 || item.description.length < 10 || !hrefIsValid || (item.expiresAt && Number.isNaN(Date.parse(item.expiresAt)))) {
          send(response, 422, { message: 'Enter a title, a clear description, a valid internal or HTTPS link, and a valid optional end date.' })
          return
        }
        await updateStore((store) => { store.spotlights ||= []; store.spotlights.unshift(item) })
        send(response, 201, { item })
        return
      }
      if (method === 'PATCH' && /^\/api\/admin\/spotlights\/[\w-]+$/.test(url.pathname)) {
        const id = url.pathname.split('/').at(-1)
        const payload = await readJson(request)
        const result = await updateStore((store) => {
          store.spotlights ||= []
          const item = store.spotlights.find((entry) => entry.id === id)
          if (!item) return null
          const updated = {
            ...item,
            type: payload.type === 'collaboration' ? 'collaboration' : 'promotion',
            title: normalise(payload.title, 140),
            description: normalise(payload.description, 500),
            ctaLabel: normalise(payload.ctaLabel, 48),
            href: normalise(payload.href, 500),
            expiresAt: normalise(payload.expiresAt, 60),
            status: payload.status === 'draft' ? 'draft' : 'published',
          }
          const hrefIsValid = !updated.href || updated.href.startsWith('/') && !updated.href.startsWith('//') || validHttpsUrl(updated.href)
          if (updated.title.length < 3 || updated.description.length < 10 || !hrefIsValid || (updated.expiresAt && Number.isNaN(Date.parse(updated.expiresAt)))) return { error: true }
          Object.assign(item, updated)
          return { item }
        })
        if (!result) { send(response, 404, { message: 'Announcement not found.' }); return }
        if (result.error) { send(response, 422, { message: 'Check the title, description, link, and optional end date.' }); return }
        send(response, 200, result)
        return
      }
      if (method === 'DELETE' && /^\/api\/admin\/spotlights\/[\w-]+$/.test(url.pathname)) {
        const id = url.pathname.split('/').at(-1)
        const deleted = await updateStore((store) => { store.spotlights ||= []; const index = store.spotlights.findIndex((item) => item.id === id); if (index < 0) return false; store.spotlights.splice(index, 1); return true })
        if (!deleted) { send(response, 404, { message: 'Announcement not found.' }); return }
        send(response, 200, { deleted: true })
        return
      }
      if (method === 'PATCH' && url.pathname === '/api/admin/settings') {
        const payload = await readJson(request)
        const telegramUrl = normalise(payload.telegramUrl, 500)
        const whatsappUrl = normalise(payload.whatsappUrl, 500)
        if (telegramUrl && !validHttpsUrl(telegramUrl, ['t.me', 'www.t.me', 'telegram.me', 'www.telegram.me'])) {
          send(response, 422, { message: 'Enter a valid HTTPS Telegram channel link.' })
          return
        }
        if (whatsappUrl && !validHttpsUrl(whatsappUrl, ['wa.me', 'www.wa.me', 'api.whatsapp.com', 'chat.whatsapp.com'])) {
          send(response, 422, { message: 'Enter a valid HTTPS WhatsApp link.' })
          return
        }
        await updateStore((store) => { store.settings = { ...store.settings, telegramUrl, whatsappUrl } })
        send(response, 200, { settings: { telegramUrl, whatsappUrl } })
        return
      }
      if (method === 'POST' && url.pathname === '/api/admin/webinars') {
        const payload = await readJson(request)
        const webinar = {
          id: randomUUID(),
          title: normalise(payload.title, 180),
          description: normalise(payload.description, 2000),
          startsAt: normalise(payload.startsAt, 60),
          timeZone: normalise(payload.timeZone, 80) || 'Asia/Kolkata',
          durationMinutes: Number(payload.durationMinutes || 60),
          speaker: normalise(payload.speaker, 120),
          status: payload.status === 'draft' ? 'draft' : 'published',
          zoomMeetingId: '',
          joinUrl: normalise(payload.joinUrl, 500),
          registrationUrl: normalise(payload.registrationUrl, 500),
          ctaLabel: normalise(payload.ctaLabel, 60),
          createdAt: new Date().toISOString(),
        }
        const errors = {}
        if (webinar.title.length < 3) errors.title = 'Enter a webinar title.'
        if (!isFutureDate(webinar.startsAt)) errors.startsAt = 'Choose a date and time in the future.'
        if (!isTimeZone(webinar.timeZone)) errors.timeZone = 'Choose a valid time zone.'
        if (!Number.isInteger(webinar.durationMinutes) || webinar.durationMinutes < 15 || webinar.durationMinutes > 1440) errors.durationMinutes = 'Duration must be between 15 minutes and 24 hours.'
        if (webinar.joinUrl && !validHttpsUrl(webinar.joinUrl, ['*.zoom.us'])) errors.joinUrl = 'Use a valid HTTPS Zoom meeting URL or create one with Zoom.'
        if (webinar.registrationUrl && !validHttpsUrl(webinar.registrationUrl)) errors.registrationUrl = 'Enter a valid HTTPS registration link.'
        if (Object.keys(errors).length) {
          send(response, 422, { message: 'Please correct the webinar details.', errors })
          return
        }
        if (!webinar.joinUrl && payload.createZoom === true) {
          try {
            const created = await zoomRequest('/users/me/meetings', {
              method: 'POST',
              body: JSON.stringify({
                topic: webinar.title,
                type: 2,
                start_time: new Date(webinar.startsAt).toISOString(),
                duration: webinar.durationMinutes,
                timezone: webinar.timeZone,
                agenda: webinar.description,
                settings: { join_before_host: false, waiting_room: true },
              }),
            })
            webinar.zoomMeetingId = String(created.id)
            webinar.joinUrl = created.join_url
          } catch (error) {
            send(response, error.status || 502, { message: error.message })
            return
          }
        }
        await updateStore((store) => { store.webinars.unshift(webinar) })
        send(response, 201, { webinar }, { 'Location': `/api/admin/webinars/${webinar.id}` })
        return
      }
      if (method === 'PATCH' && /^\/api\/admin\/webinars\/[\w-]+$/.test(url.pathname)) {
        const id = url.pathname.split('/').at(-1)
        const payload = await readJson(request)
        const found = await updateStore(async (store) => {
          const webinar = store.webinars.find((item) => item.id === id)
          if (!webinar) return null
          const title = normalise(payload.title, 180)
          const startsAt = normalise(payload.startsAt, 60)
          const description = normalise(payload.description, 2000)
          const durationMinutes = Number(payload.durationMinutes || webinar.durationMinutes)
          const timeZone = normalise(payload.timeZone, 80) || webinar.timeZone
          const status = payload.status === 'draft' ? 'draft' : 'published'
          const registrationUrl = normalise(payload.registrationUrl ?? webinar.registrationUrl, 500)
          const ctaLabel = normalise(payload.ctaLabel ?? webinar.ctaLabel, 60)
          const joinUrl = normalise(payload.joinUrl ?? webinar.joinUrl, 500)
          if (registrationUrl && !validHttpsUrl(registrationUrl)) return { error: 'Enter a valid HTTPS registration link.' }
          if (joinUrl && !validHttpsUrl(joinUrl, ['*.zoom.us'])) return { error: 'Enter a valid HTTPS Zoom link.' }
          const changedZoomFields = title !== webinar.title || startsAt !== webinar.startsAt || description !== webinar.description || durationMinutes !== webinar.durationMinutes || timeZone !== webinar.timeZone
          if (title.length < 3 || !isFutureDate(startsAt) || !isTimeZone(timeZone) || !Number.isInteger(durationMinutes) || durationMinutes < 15 || durationMinutes > 1440) return { error: 'Check the title, valid time zone, future date, and 15–1440 minute duration.' }
          if (webinar.zoomMeetingId && changedZoomFields) {
            try {
              await zoomRequest(`/meetings/${encodeURIComponent(webinar.zoomMeetingId)}`, {
                method: 'PATCH',
                body: JSON.stringify({ topic: title, start_time: new Date(startsAt).toISOString(), duration: durationMinutes, timezone: timeZone, agenda: description }),
              })
            } catch (error) {
              return { error: error.message, status: error.status || 502 }
            }
          }
          Object.assign(webinar, { title, description, startsAt, durationMinutes, timeZone, speaker: normalise(payload.speaker, 120), status, joinUrl, registrationUrl, ctaLabel })
          return { webinar }
        })
        if (!found) {
          send(response, 404, { message: 'Webinar not found.' })
          return
        }
        if (found.error) {
          send(response, found.status || 422, { message: found.error })
          return
        }
        send(response, 200, { webinar: found.webinar })
        return
      }
      if (method === 'DELETE' && /^\/api\/admin\/webinars\/[\w-]+$/.test(url.pathname)) {
        const id = url.pathname.split('/').at(-1)
        const found = await updateStore((store) => {
          const index = store.webinars.findIndex((item) => item.id === id)
          if (index === -1) return false
          store.webinars.splice(index, 1)
          return true
        })
        if (!found) {
          send(response, 404, { message: 'Webinar not found.' })
          return
        }
        send(response, 200, { deleted: true })
        return
      }
    }

    if ((method === 'GET' || method === 'HEAD') && !url.pathname.startsWith('/api/')) {
      await serveFrontend(request, response, url.pathname)
      return
    }
    send(response, 404, { message: 'Route not found.' })
  } catch (error) {
    console.error('API request failed:', error.message)
    const invalidBody = error.message === 'Request body is too large.' || error.message === 'Request body must be valid JSON.'
    send(response, invalidBody ? 400 : 500, { message: invalidBody ? error.message : 'Unable to process this request. Please try again.' })
  }
  })
}

export function setRuntimeEnv(env) {
  runtimeEnv = env
}
