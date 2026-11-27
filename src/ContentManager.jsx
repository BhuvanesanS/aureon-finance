import { useEffect, useState } from 'react'
import ContentEditors from './ContentEditors'

async function request(path, options = {}) {
  const res = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json' } })
  const data = await res.json()
  if (!res.ok) throw Error(data.message || 'Request failed.')
  return data
}

export default function ContentManager({ section = 'Content' }) {
  const [content, setContent] = useState(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    request('/api/admin/content')
      .then(setContent)
      .catch(e => setMessage(e.message))
  }, [])

  const field = (key, value) => setContent(c => ({ ...c, [key]: value }))

  async function save(e) {
    e.preventDefault()
    setBusy(true)
    setMessage('')
    const groups = {
      'Branding & Logo': ['brand'],
      'Hero Section': ['hero'],
      'About & Founder': ['about'],
      'Key Numbers': ['stats'],
      'Roadmap & Stages': ['stages', 'promises'],
      'Courses': ['courses'],
      'Testimonials': ['testimonials'],
      'Media Library': ['mediaLibrary', 'gallery'],
      'Popups & Banners': ['popupEnabled', 'popupDelay', 'popupTitle', 'popupText', 'videoUrl'],
      'Community Banner': ['community'],
      'FAQs': ['faqs'],
      'Contact': ['contact'],
      'Footer & Legal': ['footer', 'policies'],
      'Social Links': ['socialLinks', 'registrationLabel', 'communityLabel'],
      'Links': ['socialLinks', 'registrationLabel', 'communityLabel'],
      'Content': ['popupEnabled', 'popupDelay', 'popupTitle', 'popupText', 'videoUrl', 'gallery', 'testimonials', 'policies', 'brand', 'hero', 'about', 'stats', 'stages', 'promises', 'community', 'footer']
    }
    const targetKeys = groups[section] || [section.toLowerCase()]
    const payload = Object.fromEntries(targetKeys.filter(k => content[k] !== undefined).map(k => [k, content[k]]))
    if (payload.courses) {
      payload.courses = payload.courses.map(c => ({
        ...c,
        modules: (c.modules || []).map(([t, d, items]) => [t, d, (items || []).filter(x => x && x.trim())])
      }))
    }
    try {
      const result = await request('/api/admin/content', { method: 'PUT', body: JSON.stringify(payload) })
      setContent(result)
      setMessage('Published successfully! The website refreshes within seconds.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  const sectionMeta = {
    'Branding & Logo': { title: 'Website Branding & Logo', note: 'Manage official brand name, tagline, logo image, favicon, and header CTA button.' },
    'Hero Section': { title: 'Hero Banner & Visuals', note: 'Customize the homepage hero banner headline, description, action buttons, and hero images.' },
    'About & Founder': { title: 'Founder Profile & About Details', note: 'Edit Mubarak Ahmad’s background story, portrait images, quote, vision, mission, and engineering career.' },
    'Key Numbers': { title: 'Key Statistics & Metrics', note: 'Manage the statistics counters (e.g. 5+ Years Market Education) displayed across the website.' },
    'Roadmap & Stages': { title: 'Market DNA Learning Stages', note: 'Customize the 5 structured learning stages and feature promises.' },
    'Courses': { title: 'Course Outlines & Curriculum', note: 'Update course cards, syllabus modules, topics, descriptions, and learning focuses.' },
    'Testimonials': { title: 'Student Reviews & Ratings', note: 'Add, edit, reorder or remove student reviews and clarity star ratings displayed across the website.' },
    'Media Library': { title: 'Image & Media Repository', note: 'Upload images from your device, copy asset URLs, and manage event gallery photos.' },
    'Popups & Banners': { title: 'Welcome Popup & Video Insights', note: 'Control the registration popup delay, headline, and free insight YouTube video.' },
    'Community Banner': { title: 'Community Banner & Telegram Callout', note: 'Customize the homepage community callout and invite visitors to the 5% Club.' },
    'FAQs': { title: 'Frequently Asked Questions', note: 'Manage questions and answers. Categories automatically appear in the FAQ filter.' },
    'Contact': { title: 'Contact Information & Office Location', note: 'Update phone number, email, official website, and address.' },
    'Footer & Legal': { title: 'Footer Details & Policy Pages', note: 'Customize footer descriptions, risk disclaimer notices, copyright, and legal policies.' },
    'Social Links': { title: 'Social Profiles & Button Labels', note: 'Update social media profile links and default button labels.' },
    'Links': { title: 'Social Links & Buttons', note: 'Manage social channels and action button labels.' },
    'Content': { title: 'Website & Popups', note: 'Manage website text, images, and content.' }
  }

  const meta = sectionMeta[section] || { title: section, note: 'Manage content displayed on the website.' }

  if (!content) return <p role="status">{message || 'Loading content…'}</p>

  return (
    <form className="admin-panel admin-form" onSubmit={save}>
      <div className="admin-panel-head">
        <div>
          <p className="eyebrow">CMS & CONTENT CONTROL</p>
          <h2>{meta.title}</h2>
        </div>
      </div>
      <p className="admin-muted">{meta.note}</p>
      
      <ContentEditors section={section} content={content} field={field} />

      <div className="admin-form-actions" style={{ marginTop: '24px' }}>
        <button className="admin-primary" disabled={busy}>
          {busy ? 'Publishing…' : 'Publish Changes to Website'}
        </button>
      </div>
      {message && <p className={`admin-notice ${message.startsWith('Published') ? 'success' : 'error'}`} role="status">{message}</p>}
    </form>
  )
}

export function EnquiryManager({ bookings, refresh }) {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState('')

  async function update(id, status) {
    setBusy(id)
    setMessage('')
    try {
      await request(`/api/admin/bookings/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
      await refresh()
      setMessage('Enquiry status saved.')
    } catch (e) {
      setMessage(e.message)
    } finally {
      setBusy('')
    }
  }

  return (
    <section className="admin-panel">
      <div className="admin-panel-head">
        <div>
          <p className="eyebrow">CUSTOMER ENQUIRIES</p>
          <h2>Course & webinar enquiries</h2>
        </div>
        <span className="admin-count">{bookings.length}</span>
      </div>
      {message && <p className="admin-notice success" role="status">{message}</p>}
      {!bookings.length ? (
        <div className="admin-empty">
          <strong>No enquiries yet</strong>
          <span>When visitors request course guidance or register for upcoming webinars, their details appear here.</span>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Reference / Name</th>
                <th>Contact</th>
                <th>Course / Message</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>
                    {b.reference}<br />
                    <strong>{b.fullName}</strong>
                  </td>
                  <td>
                    {b.email}<br />
                    {b.phone}
                  </td>
                  <td>
                    {b.kind === 'webinar-interest' ? 'Next webinar updates' : b.course}
                    {b.city && <p>{b.city}{b.profession && <> · {b.profession}</>}</p>}
                    <p style={{ whiteSpace: 'pre-wrap', maxWidth: 400 }}>{b.message}</p>
                  </td>
                  <td>
                    <select
                      aria-label={`Status for ${b.fullName}`}
                      value={b.status}
                      disabled={busy === b.id}
                      onChange={e => update(b.id, e.target.value)}
                    >
                      {['requested', 'contacted', 'closed'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
