import { useEffect, useMemo, useState } from 'react'
import './admin.css'

const pageTimestamp = Date.now()
const emptyWebinar = () => ({ title: '', description: '', startsAt: '', durationMinutes: 60, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata', speaker: 'Instructor name', status: 'published', joinUrl: '' })
const formatDate = (value, zone = 'Asia/Kolkata') => new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: zone })
const toLocalDateTimeInput = (value) => { const date = new Date(value); return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16) }

async function api(path, options = {}) {
  const response = await fetch(path, { credentials: 'same-origin', ...options, headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers } })
  const payload = response.status === 204 ? {} : await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || `Request failed (${response.status}).`)
  return payload
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [data, setData] = useState({ settings: { telegramUrl: '', whatsappUrl: '' }, webinars: [], spotlights: [], registrations: [], bookings: [] })
  const [tab, setTab] = useState('Overview')
  const [webinar, setWebinar] = useState(emptyWebinar)
  const [editingId, setEditingId] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState({ type: '', text: '' })

  const upcoming = useMemo(() => data.webinars.filter((item) => Date.parse(item.startsAt) > pageTimestamp).length, [data.webinars])
  const loadDashboard = async () => {
    const result = await api('/api/admin/dashboard')
    setData(result)
    setAuthenticated(true)
  }

  useEffect(() => {
    api('/api/admin/dashboard').then((result) => { setData(result); setAuthenticated(true) }).catch(() => setAuthenticated(false)).finally(() => setChecking(false))
  }, [])

  const login = async (event) => {
    event.preventDefault()
    setBusy(true); setNotice({ type: '', text: '' })
    try {
      await api('/api/admin/login', { method: 'POST', body: JSON.stringify(credentials) })
      setCredentials({ email: '', password: '' })
      await loadDashboard()
      setNotice({ type: 'success', text: 'Signed in securely. Admin session will expire after 8 hours.' })
    } catch (error) { setNotice({ type: 'error', text: error.message }) }
    finally { setBusy(false) }
  }

  const logout = async () => {
    try { await api('/api/admin/logout', { method: 'POST' }) } finally { setAuthenticated(false); setData({ settings: { telegramUrl: '', whatsappUrl: '' }, webinars: [], spotlights: [], registrations: [], bookings: [] }) }
  }

  const saveWebinar = async (event) => {
    event.preventDefault()
    setBusy(true); setNotice({ type: '', text: '' })
    const payload = { ...webinar, startsAt: new Date(webinar.startsAt).toISOString() }
    try {
      const result = await api(editingId ? `/api/admin/webinars/${editingId}` : '/api/admin/webinars', { method: editingId ? 'PATCH' : 'POST', body: JSON.stringify(payload) })
      setWebinar(emptyWebinar()); setEditingId(''); await loadDashboard()
      setNotice({ type: 'success', text: editingId ? 'Webinar updated.' : `Webinar saved. ${result.webinar.zoomMeetingId ? 'Zoom meeting created and link saved.' : 'Meeting link saved.'}` })
    } catch (error) { setNotice({ type: 'error', text: error.message }) }
    finally { setBusy(false) }
  }

  const editWebinar = (item) => {
    setEditingId(item.id)
    setWebinar({ title: item.title, description: item.description, startsAt: toLocalDateTimeInput(item.startsAt), durationMinutes: item.durationMinutes, timeZone: item.timeZone, speaker: item.speaker || '', status: item.status, joinUrl: item.joinUrl || '' })
    setTab('Webinars')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const removeWebinar = async (item) => {
    if (!window.confirm(`Delete “${item.title}” from the site? This does not delete the Zoom meeting.`)) return
    try { await api(`/api/admin/webinars/${item.id}`, { method: 'DELETE' }); await loadDashboard(); setNotice({ type: 'success', text: 'Webinar removed from the site.' }) }
    catch (error) { setNotice({ type: 'error', text: error.message }) }
  }

  const saveSettings = async (event) => {
    event.preventDefault(); setBusy(true); setNotice({ type: '', text: '' })
    try { const result = await api('/api/admin/settings', { method: 'PATCH', body: JSON.stringify(data.settings) }); setData((current) => ({ ...current, settings: result.settings })); setNotice({ type: 'success', text: 'Telegram and WhatsApp links updated on the public site.' }) }
    catch (error) { setNotice({ type: 'error', text: error.message }) }
    finally { setBusy(false) }
  }

  if (checking) return <main className="admin-shell"><div className="admin-loading">Loading secure workspace…</div></main>

  if (!authenticated) return <main className="admin-shell admin-login-shell"><a className="admin-brand" href="/">MUBSA FIN <span>INSTITUTE</span></a><section className="admin-login-card"><p className="eyebrow">PRIVATE ADMIN SPACE</p><h1>Welcome <em>back.</em></h1><p className="admin-muted">Sign in to publish webinar details, update public links, and review registrations.</p><form onSubmit={login}><label>Admin email<input type="email" autoComplete="username" required value={credentials.email} onChange={(event) => setCredentials({ ...credentials, email: event.target.value })} /></label><label>Password<input type="password" autoComplete="current-password" required value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} /></label><button className="admin-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>{notice.text && <p className={`admin-notice ${notice.type}`} role="status">{notice.text}</p>}</form><a className="back-site" href="/">← Back to website</a></section></main>

  return <main className="admin-shell"><header className="admin-topbar"><a className="admin-brand" href="/">MUBSA FIN <span>INSTITUTE</span></a><div><span className="admin-session-state"><i /> Secure session</span><button className="admin-logout" onClick={logout}>Sign out</button></div></header><div className="admin-content"><section className="admin-heading"><div><p className="eyebrow">WEBINAR & COMMUNITY MANAGEMENT</p><h1>Admin <em>workspace.</em></h1><p className="admin-muted">Manage the upcoming public webinar and the people who register.</p></div><a className="admin-view-site" href="/" target="_blank" rel="noreferrer">View public site ↗</a></section>
    {notice.text && <p className={`admin-notice ${notice.type}`} role="status">{notice.text}</p>}
    <nav className="admin-tabs" aria-label="Admin sections">{['Overview', 'Webinars', 'Spotlights', 'Registrations', 'Settings'].map((label) => <button key={label} className={tab === label ? 'active' : ''} onClick={() => setTab(label)}>{label}{label === 'Registrations' && <b>{data.registrations.length}</b>}</button>)}</nav>

    {tab === 'Overview' && <section className="admin-overview"><div className="admin-metrics"><article><span>Upcoming webinars</span><strong>{upcoming}</strong><small>Published and scheduled</small></article><article><span>All registrations</span><strong>{data.registrations.length}</strong><small>Webinar sign-ups</small></article><article><span>Course enquiries</span><strong>{data.bookings.length}</strong><small>General booking requests</small></article></div><div className="admin-panel"><div className="admin-panel-head"><div><p className="eyebrow">PUBLIC EVENT</p><h2>Next webinar</h2></div><button className="admin-secondary" onClick={() => { setWebinar(emptyWebinar()); setEditingId(''); setTab('Webinars') }}>Create webinar</button></div>{data.webinars.find((item) => item.status === 'published' && Date.parse(item.startsAt) > pageTimestamp) ? <WebinarSummary webinar={data.webinars.find((item) => item.status === 'published' && Date.parse(item.startsAt) > pageTimestamp)} onEdit={editWebinar} /> : <div className="admin-empty"><strong>No upcoming webinar yet</strong><span>Create a webinar to publish it in the top announcement and registration popup.</span></div>}</div></section>}

    {tab === 'Webinars' && <section className="admin-webinar-layout"><form className="admin-panel admin-form" onSubmit={saveWebinar}><div className="admin-panel-head"><div><p className="eyebrow">{editingId ? 'EDIT EVENT' : 'NEW EVENT'}</p><h2>{editingId ? 'Update webinar' : 'Create webinar'}</h2></div></div><label>Webinar topic<input required minLength="3" maxLength="180" value={webinar.title} onChange={(event) => setWebinar({ ...webinar, title: event.target.value })} placeholder="e.g. Understanding market cycles" /></label><label>Short description<textarea maxLength="2000" rows="3" value={webinar.description} onChange={(event) => setWebinar({ ...webinar, description: event.target.value })} placeholder="What will attendees learn?" /></label><div className="admin-form-grid"><label>Date and time<input required type="datetime-local" value={webinar.startsAt} onChange={(event) => setWebinar({ ...webinar, startsAt: event.target.value })} /><small>Shown in your browser time zone: {webinar.timeZone}</small></label><label>Duration<select value={webinar.durationMinutes} onChange={(event) => setWebinar({ ...webinar, durationMinutes: Number(event.target.value) })}><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option><option value="90">90 minutes</option><option value="120">120 minutes</option></select></label><label>Instructor<input value={webinar.speaker} onChange={(event) => setWebinar({ ...webinar, speaker: event.target.value })} placeholder="Instructor name" /></label><label>Publication<select value={webinar.status} onChange={(event) => setWebinar({ ...webinar, status: event.target.value })}><option value="published">Publish on website</option><option value="draft">Keep as draft</option></select></label></div><details className="manual-zoom"><summary>Use an existing Zoom link instead</summary><label>Zoom join URL (optional)<input type="url" value={webinar.joinUrl} onChange={(event) => setWebinar({ ...webinar, joinUrl: event.target.value })} placeholder="https://zoom.us/j/..." /></label><small>Leave blank to create a Zoom meeting using the configured server credentials.</small></details><div className="admin-form-actions"><button className="admin-primary" disabled={busy}>{busy ? 'Saving…' : editingId ? 'Save changes' : 'Create webinar and Zoom link'}</button>{editingId && <button className="admin-secondary" type="button" onClick={() => { setWebinar(emptyWebinar()); setEditingId('') }}>Cancel</button>}</div><p className="admin-help">To create Zoom links, the API server must have Zoom Server-to-Server OAuth credentials with meeting write permission.</p></form><section className="admin-panel"><div className="admin-panel-head"><div><p className="eyebrow">SCHEDULE</p><h2>All webinars</h2></div><span className="admin-count">{data.webinars.length}</span></div><div className="admin-webinar-list">{data.webinars.length ? data.webinars.map((item) => <WebinarSummary key={item.id} webinar={item} onEdit={editWebinar} onDelete={removeWebinar} />) : <div className="admin-empty"><strong>Your first event starts here</strong><span>Set a topic and time, then publish a new Zoom session.</span></div>}</div></section></section>}

    {tab === 'Spotlights' && <SpotlightManager items={data.spotlights || []} refresh={loadDashboard} setNotice={setNotice} />}

    {tab === 'Registrations' && <section className="admin-panel"><div className="admin-panel-head"><div><p className="eyebrow">WEBINAR AUDIENCE</p><h2>Registrations</h2></div><button className="admin-secondary" onClick={loadDashboard}>Refresh list</button></div>{data.registrations.length ? <div className="admin-table-wrap"><table><thead><tr><th>Name</th><th>Contact</th><th>City & profession</th><th>Webinar</th><th>Messages</th><th>Registered</th></tr></thead><tbody>{data.registrations.map((item) => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{item.email}<br />{item.phone}</td><td>{item.city}<br /><span>{item.profession}</span></td><td>{data.webinars.find((event) => event.id === item.webinarId)?.title || 'Archived webinar'}</td><td><span className={`delivery-status ${item.delivery?.email || 'pending'}`}>Email: {item.delivery?.email || 'pending'}</span><br /><span className={`delivery-status ${item.delivery?.whatsapp || 'pending'}`}>WhatsApp: {item.delivery?.whatsapp || 'pending'}</span></td><td>{formatDate(item.createdAt)}</td></tr>)}</tbody></table></div> : <div className="admin-empty"><strong>No registrations yet</strong><span>Public webinar sign-ups will appear here.</span></div>}</section>}

    {tab === 'Settings' && <section className="admin-settings-grid"><form className="admin-panel admin-form" onSubmit={saveSettings}><div className="admin-panel-head"><div><p className="eyebrow">PUBLIC LINKS</p><h2>Community settings</h2></div></div><p className="admin-muted">These links appear in the top announcement, public popup, and website contact areas.</p><label>Free Telegram channel<input type="url" value={data.settings.telegramUrl} onChange={(event) => setData({ ...data, settings: { ...data.settings, telegramUrl: event.target.value } })} placeholder="https://t.me/yourchannel" /></label><label>WhatsApp contact link<input type="url" value={data.settings.whatsappUrl} onChange={(event) => setData({ ...data, settings: { ...data.settings, whatsappUrl: event.target.value } })} placeholder="https://wa.me/91..." /></label><button className="admin-primary" disabled={busy}>{busy ? 'Saving…' : 'Save public links'}</button></form><aside className="admin-panel setup-note"><p className="eyebrow">INTEGRATION CHECKLIST</p><h2>Connect the delivery services</h2><ul><li>Zoom Server-to-Server OAuth credentials and meeting write scope</li><li>Resend API key and a verified sender domain for email</li><li>Meta WhatsApp Cloud API access token and phone number ID</li><li>An approved WhatsApp confirmation template with four body parameters</li></ul><p>Only backend environment variables are used for secrets. A missing service is shown as “not configured”; registrations are still saved.</p></aside></section>}
    <footer className="admin-footer">Mubsa Fin Institute · Private admin area <a href="/">Return to public site</a></footer></div></main>
}

function WebinarSummary({ webinar, onEdit, onDelete }) {
  return <article className="webinar-summary"><div className="webinar-summary-top"><span className={`webinar-status ${webinar.status}`}>{webinar.status}</span><time>{formatDate(webinar.startsAt, webinar.timeZone)}</time></div><h3>{webinar.title}</h3>{webinar.description && <p>{webinar.description}</p>}<div className="webinar-summary-meta"><span>{webinar.durationMinutes} min</span><span>{webinar.speaker || 'Instructor to be announced'}</span>{webinar.zoomMeetingId && <span>Zoom connected</span>}</div><div className="webinar-summary-actions"><a href={webinar.joinUrl} target="_blank" rel="noreferrer">Open join link ↗</a>{onEdit && <button onClick={() => onEdit(webinar)}>Edit</button>}{onDelete && <button className="danger-link" onClick={() => onDelete(webinar)}>Delete</button>}</div></article>
}

const emptySpotlight = () => ({ type: 'promotion', title: '', description: '', ctaLabel: '', href: '', expiresAt: '', status: 'published' })
function SpotlightManager({ items, refresh, setNotice }) {
  const [form, setForm] = useState(emptySpotlight)
  const [editingId, setEditingId] = useState('')
  const [busy, setBusy] = useState(false)
  const edit = (item) => { setEditingId(item.id); setForm({ ...item, expiresAt: item.expiresAt ? toLocalDateTimeInput(item.expiresAt) : '' }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const reset = () => { setForm(emptySpotlight()); setEditingId('') }
  const save = async (event) => {
    event.preventDefault(); setBusy(true); setNotice({ type: '', text: '' })
    try {
      const payload = { ...form, expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : '' }
      await api(editingId ? `/api/admin/spotlights/${editingId}` : '/api/admin/spotlights', { method: editingId ? 'PATCH' : 'POST', body: JSON.stringify(payload) })
      reset(); await refresh(); setNotice({ type: 'success', text: editingId ? 'Spotlight updated.' : 'Spotlight published to the rotating website banner.' })
    } catch (error) { setNotice({ type: 'error', text: error.message }) }
    finally { setBusy(false) }
  }
  const remove = async (item) => {
    if (!window.confirm(`Remove “${item.title}” from the public banner?`)) return
    try { await api(`/api/admin/spotlights/${item.id}`, { method: 'DELETE' }); await refresh(); setNotice({ type: 'success', text: 'Spotlight removed from the website.' }) }
    catch (error) { setNotice({ type: 'error', text: error.message }) }
  }
  return <section className="spotlight-layout"><form className="admin-panel admin-form" onSubmit={save}><div className="admin-panel-head"><div><p className="eyebrow">{editingId ? 'EDIT WEBSITE SLIDE' : 'NEW WEBSITE SLIDE'}</p><h2>{editingId ? 'Update spotlight' : 'Create a spotlight'}</h2></div></div><p className="admin-muted">Published promotions and collaborations rotate with upcoming webinars on the public site.</p><div className="admin-form-grid"><label>Slide type<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option value="promotion">Promotion / advertisement</option><option value="collaboration">Collaborator / partner</option></select></label><label>Visibility<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="published">Publish on website</option><option value="draft">Keep as draft</option></select></label></div><label>Headline<input required minLength="3" maxLength="140" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="e.g. New market foundations workshop" /></label><label>Short message<textarea required minLength="10" maxLength="500" rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What should visitors know?" /></label><div className="admin-form-grid"><label>Button label<input maxLength="48" value={form.ctaLabel} onChange={(event) => setForm({ ...form, ctaLabel: event.target.value })} placeholder="Learn more" /></label><label>Button destination<input type="text" maxLength="500" value={form.href} onChange={(event) => setForm({ ...form, href: event.target.value })} placeholder="/courses or https://example.com" /></label><label>Optional end date<input type="datetime-local" value={form.expiresAt} onChange={(event) => setForm({ ...form, expiresAt: event.target.value })} /></label></div><div className="admin-form-actions"><button className="admin-primary" disabled={busy}>{busy ? 'Saving…' : editingId ? 'Save spotlight' : 'Publish spotlight'}</button>{editingId && <button className="admin-secondary" type="button" onClick={reset}>Cancel</button>}</div></form><section className="admin-panel"><div className="admin-panel-head"><div><p className="eyebrow">ROTATING PUBLIC BANNER</p><h2>Promotions & collaborators</h2></div><span className="admin-count">{items.length}</span></div><div className="admin-webinar-list">{items.length ? items.map((item) => <article className="webinar-summary" key={item.id}><div className="webinar-summary-top"><span className={`webinar-status ${item.status}`}>{item.type}</span>{item.expiresAt && <time>Ends {formatDate(item.expiresAt)}</time>}</div><h3>{item.title}</h3><p>{item.description}</p><div className="webinar-summary-actions"><button onClick={() => edit(item)}>Edit</button><button className="danger-link" onClick={() => remove(item)}>Delete</button></div></article>) : <div className="admin-empty"><strong>No promotions or partners yet</strong><span>Publish a slide here. Upcoming webinars are added to the same public rotation automatically.</span></div>}</div></section></section>
}
