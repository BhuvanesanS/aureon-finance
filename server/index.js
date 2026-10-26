import { createServer } from 'node:http'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const port = Number(process.env.PORT || 8787)
const adminToken = process.env.ADMIN_API_TOKEN
const directory = dirname(fileURLToPath(import.meta.url))
const storePath = join(directory, 'data', 'records.json')
const courses = new Set(['Basic Course', 'Intermediate Course', 'Advanced Course'])
const requestCounts = new Map()

function send(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  response.end(JSON.stringify(body))
}

async function readStore() {
  try {
    return JSON.parse(await readFile(storePath, 'utf8'))
  } catch (error) {
    if (error.code === 'ENOENT') return { bookings: [] }
    throw error
  }
}

async function writeStore(store) {
  await mkdir(dirname(storePath), { recursive: true })
  const temporaryPath = `${storePath}.${randomUUID()}.tmp`
  await writeFile(temporaryPath, JSON.stringify(store, null, 2), 'utf8')
  await rename(temporaryPath, storePath)
}

function normalise(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''
}

function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
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

function isRateLimited(request) {
  const key = request.socket.remoteAddress || 'unknown'
  const now = Date.now()
  const record = requestCounts.get(key) || { started: now, count: 0 }
  if (now - record.started > 15 * 60 * 1000) {
    requestCounts.set(key, { started: now, count: 1 })
    return false
  }
  record.count += 1
  requestCounts.set(key, record)
  return record.count > 12
}

function bookingFrom(payload) {
  const booking = {
    fullName: normalise(payload.fullName),
    email: normalise(payload.email).toLowerCase(),
    phone: normalise(payload.phone),
    city: normalise(payload.city),
    course: normalise(payload.course),
    preferredDate: normalise(payload.preferredDate),
    preferredTime: normalise(payload.preferredTime),
    message: normalise(payload.message),
    consent: payload.consent === true,
  }
  const errors = {}
  if (booking.fullName.length < 2) errors.fullName = 'Enter your full name.'
  if (!emailIsValid(booking.email)) errors.email = 'Enter a valid email address.'
  if (booking.phone.length < 7) errors.phone = 'Enter a valid phone number.'
  if (!courses.has(booking.course)) errors.course = 'Choose one of the available courses.'
  if (!booking.consent) errors.consent = 'Consent is required before submitting a request.'
  return { booking, errors }
}

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, { 'Access-Control-Allow-Origin': 'http://localhost:5174', 'Access-Control-Allow-Methods': 'GET,POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,X-Admin-Token' })
    response.end()
    return
  }

  const url = new URL(request.url, `http://${request.headers.host}`)
  try {
    if (request.method === 'GET' && url.pathname === '/api/health') {
      send(response, 200, { ok: true })
      return
    }

    if (request.method === 'POST' && url.pathname === '/api/booking-requests') {
      if (isRateLimited(request)) {
        send(response, 429, { message: 'Too many requests. Please try again later.' })
        return
      }
      const { booking, errors } = bookingFrom(await readJson(request))
      if (Object.keys(errors).length) {
        send(response, 422, { message: 'Please correct the highlighted information.', errors })
        return
      }
      const store = await readStore()
      const record = {
        id: randomUUID(),
        reference: `MFI-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        status: 'requested',
        createdAt: new Date().toISOString(),
        ...booking,
      }
      store.bookings.unshift(record)
      await writeStore(store)
      send(response, 201, { reference: record.reference, message: 'Your request has been received. Mubsa Fin Institute will contact you using the details provided.' })
      return
    }

    if (request.method === 'GET' && url.pathname === '/api/bookings') {
      if (!adminToken || request.headers['x-admin-token'] !== adminToken) {
        send(response, 401, { message: 'Unauthorised.' })
        return
      }
      const store = await readStore()
      send(response, 200, { bookings: store.bookings })
      return
    }

    send(response, 404, { message: 'Route not found.' })
  } catch (error) {
    console.error(error)
    send(response, 500, { message: 'Unable to process this request. Please try again later.' })
  }
})

server.listen(port, () => {
  console.log(`Mubsa booking API listening on http://localhost:${port}`)
})
