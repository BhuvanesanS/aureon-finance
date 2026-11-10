import { useEffect, useState } from 'react'
import ContentEditors from './ContentEditors'

async function request(path, options = {}) {
  const res = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json' } })
  const data = await res.json()
  if (!res.ok) throw Error(data.message || 'Request failed.')
  return data
}
export default function ContentManager({ section = 'Content' }) {
  const [content, setContent] = useState(null), [message, setMessage] = useState(''), [busy, setBusy] = useState(false)
  useEffect(() => { request('/api/admin/content').then(setContent).catch(e => setMessage(e.message)) }, [])
  const field = (key, value) => setContent(c => ({ ...c, [key]: value }))
  const change = (group, index, key, value) => field(group, content[group].map((x,i) => i === index ? { ...x, [key]: value } : x))
  async function save(e) {
    e.preventDefault(); setBusy(true); setMessage('')
    const groups = { Content:['popupEnabled','popupDelay','popupTitle','popupText','videoUrl','gallery','testimonials','policies'], Contact:['contact'], FAQs:['faqs'], Courses:['courses'], Links:['socialLinks','registrationLabel','communityLabel'] }
    const payload = Object.fromEntries(groups[section].map(key => [key,content[key]]))
    if (payload.courses) payload.courses = payload.courses.map(c => ({...c,modules:c.modules.map(([t,d,items]) => [t,d,items.filter(x => x.trim())])}))
    try { const result = await request('/api/admin/content', { method:'PUT', body:JSON.stringify(payload) }); setContent(result); setMessage('Published. The website refreshes within 30 seconds.') }
    catch (error) { setMessage(error.message) }
    finally { setBusy(false) }
  }
  if (!content) return <p role="status">{message || 'Loading content…'}</p>
  return <form className="admin-panel admin-form" onSubmit={save}><h2>{section === 'Content' ? 'Website & popups' : section === 'Links' ? 'Social links & buttons' : section === 'Contact' ? 'Contact information' : section === 'FAQs' ? 'Frequently asked questions' : 'Course details'}</h2><p className="admin-muted">Only publish client-approved text, images, and testimonials. Changes are saved together when you select Publish content.</p>{section === 'Content' && <><label>Welcome popup<select value={String(content.popupEnabled)} onChange={e => field('popupEnabled', e.target.value === 'true')}><option value="true">Enabled</option><option value="false">Disabled</option></select></label><label>Popup delay (seconds)<input type="number" min="1" max="60" value={content.popupDelay} onChange={e => field('popupDelay', Number(e.target.value))} /></label><label>Popup headline<input required maxLength="180" value={content.popupTitle} onChange={e => field('popupTitle', e.target.value)} /></label><label>Popup description<textarea maxLength="1000" value={content.popupText} onChange={e => field('popupText', e.target.value)} /></label><label>Free insight YouTube URL<input type="url" value={content.videoUrl || ''} onChange={e => field('videoUrl', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." /></label>
    {[
      ['gallery','Event gallery',{ title:'', city:'', image:'' },[['title','Photo title'],['city','City / category'],['image','Image URL or /local-photo.jpg']]],
      ['testimonials','Approved testimonials',{ name:'', role:'', quote:'', rating:'' },[['name','Learner name'],['role','Role'],['quote','Approved feedback (optional if rated)']]],
      ['policies','Policy pages',{ slug:'privacy-policy', title:'', body:'' },[['slug','Page slug'],['title','Page title'],['body','Approved policy text']]],
    ].map(([group,label,empty,fields]) => <section key={group}><h3>{label}</h3>{content[group].map((item,index) => <fieldset key={index} style={{ margin:'16px 0', padding:20, border:'1px solid #516777' }}><legend>{label} {index+1}</legend>{fields.map(([key,title]) => <label key={key}>{title}{key === 'body' || key === 'quote' ? <textarea required={key !== 'quote'} rows="5" value={item[key] || ''} onChange={e => change(group,index,key,e.target.value)} /> : <input required={key !== 'role'} value={item[key] || ''} onChange={e => change(group,index,key,e.target.value)} />}</label>)}{group === 'testimonials' && <label>Class easy to understand — rating (optional)<select value={item.rating ?? ''} onChange={e => change(group,index,'rating',e.target.value)}><option value="">No rating</option>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}/5</option>)}</select></label>}<button className="admin-secondary" type="button" onClick={() => field(group, content[group].filter((_,i) => i !== index))}>Remove this entry</button></fieldset>)}<button className="admin-secondary" type="button" disabled={content[group].length >= 30} onClick={() => field(group,[...content[group],empty])}>Add {label.toLowerCase()}</button></section>)}
    </>}
    <ContentEditors section={section} content={content} field={field} />
    <button className="admin-primary" disabled={busy}>{busy ? 'Publishing…' : 'Publish content'}</button><p role="status">{message}</p>
  </form>
}

export function EnquiryManager({ bookings, refresh }) {
  const [message,setMessage] = useState(''), [busy,setBusy] = useState('')
  async function update(id,status) {
    setBusy(id); setMessage('')
    try { await request(`/api/admin/bookings/${id}`,{ method:'PATCH', body:JSON.stringify({status}) }); await refresh(); setMessage('Enquiry status saved.') }
    catch(e) { setMessage(e.message) } finally { setBusy('') }
  }
  return <section className="admin-panel"><h2>Course & webinar enquiries</h2><p role="status">{message}</p>{!bookings.length ? <p className="admin-empty">No enquiries yet.</p> : <div className="admin-table-wrap"><table><thead><tr><th>Reference / name</th><th>Contact</th><th>Course / message</th><th>Status</th></tr></thead><tbody>{bookings.map(b => <tr key={b.id}><td>{b.reference}<br /><strong>{b.fullName}</strong></td><td>{b.email}<br />{b.phone}</td><td>{b.kind === 'webinar-interest' ? 'Next webinar updates' : b.course}{b.city && <p>{b.city}{b.profession && <> · {b.profession}</>}</p>}<p style={{whiteSpace:'pre-wrap',maxWidth:400}}>{b.message}</p></td><td><select aria-label={`Status for ${b.fullName}`} value={b.status} disabled={busy === b.id} onChange={e => update(b.id,e.target.value)}>{['requested','contacted','closed'].map(s => <option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div>}</section>
}
