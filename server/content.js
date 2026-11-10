import { defaultContent } from '../src/siteDefaults.js'
export { defaultContent }

export function validateContent(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Provide website content.')
  const text = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : ''
  const required = (value, max, label) => { const result = text(value, max); if (!result) throw new Error(`Enter ${label}.`); return result }
  const list = (value, max, label) => { if (!Array.isArray(value) || value.length > max || value.some(x => !x || typeof x !== 'object')) throw new Error(`Provide up to ${max} ${label}.`); return value }
  const https = value => { try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password } catch { return false } }
  const result = { popupEnabled: input.popupEnabled !== false, popupDelay: Math.max(1, Math.min(60, Number(input.popupDelay) || 4)), popupTitle: required(input.popupTitle, 180, 'a popup headline'), popupText: text(input.popupText, 1000), videoUrl: text(input.videoUrl, 500) }
  if (result.videoUrl && !/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(result.videoUrl)) throw new Error('Use a YouTube HTTPS video URL.')
  for (const key of ['gallery', 'testimonials', 'policies']) {
    result[key] = list(input[key], 30, key).map(entry => {
      if (key === 'gallery') {
        const image = text(entry.image, 500)
        if (!https(image) && !/^\/(?!\/)[\w/.-]+\.(jpg|jpeg|png|webp)$/i.test(image)) throw new Error('Gallery images must use an HTTPS URL or a local image path.')
        return { title: text(entry.title, 150), city: text(entry.city, 80), image }
      }
      if (key === 'testimonials') return { name: text(entry.name, 120), role: text(entry.role, 120), quote: text(entry.quote, 2000) }
      return { slug: text(entry.slug, 80).replace(/[^a-z-]/g, ''), title: text(entry.title, 160), body: text(entry.body, 12000) }
    })
  }
  const contact = input.contact ?? defaultContent.contact
  result.contact = Object.fromEntries(Object.entries({ title:180, description:1000, location:300, phone:30, email:254 }).map(([key,max]) => [key,required(contact?.[key],max,`contact ${key}`)]))
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.contact.email)) throw new Error('Enter a valid contact email.')
  if (!/^\+?[\d\s().-]{7,30}$/.test(result.contact.phone) || result.contact.phone.replace(/\D/g,'').length < 7) throw new Error('Enter a valid contact phone number.')
  result.registrationLabel = required(input.registrationLabel ?? defaultContent.registrationLabel, 60, 'a registration button label')
  result.communityLabel = required(input.communityLabel ?? defaultContent.communityLabel, 60, 'a community button label')
  result.socialLinks = list(input.socialLinks ?? [], 12, 'social links').map(entry => {
    const url = text(entry.url,500)
    if (!https(url)) throw new Error('Social links must use valid HTTPS URLs without embedded credentials.')
    return { label:required(entry.label,60,'a social link label'), url }
  })
  result.faqs = list(input.faqs ?? defaultContent.faqs, 60, 'FAQs').map(entry => ({
    category: required(entry.category,60,'an FAQ category'), question:required(entry.question,300,'an FAQ question'), answer:required(entry.answer,4000,'an FAQ answer'),
  }))
  result.courses = list(input.courses ?? defaultContent.courses, 12, 'courses').map((entry,i) => {
    const slug = required(entry.slug,80,'a course slug')
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Course slugs can contain lowercase letters, numbers, and single hyphens.')
    const course = { slug, number:String(i+1).padStart(2,'0') }
    for (const [key,max] of Object.entries({name:100,tagline:200,description:2000,intro:8000,focusTitle:200,focus:4000})) course[key] = key === 'name' || key === 'description' ? required(entry[key],max,`course ${key}`) : text(entry[key],max)
    course.modules = list(entry.modules,40,'course modules').map(module => {
      if (!Array.isArray(module) || !Array.isArray(module[2]) || module[2].length > 60) throw new Error('Each module needs a title, description and up to 60 topics.')
      return [required(module[0],200,'a module title'),text(module[1],4000),module[2].map(topic => required(topic,500,'a module topic'))]
    })
    return course
  })
  if (!result.courses.length) throw new Error('Keep at least one course available.')
  if (new Set(result.courses.map(c => c.slug)).size !== result.courses.length) throw new Error('Each course needs a unique slug.')
  if (new Set(result.courses.map(c => c.name.toLowerCase())).size !== result.courses.length) throw new Error('Each course needs a unique name.')
  return result
}
