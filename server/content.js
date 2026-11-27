import { defaultContent } from '../src/siteDefaults.js'
export { defaultContent }

export function validateContent(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Provide website content.')
  const text = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : ''
  const required = (value, max, label) => { const result = text(value, max); if (!result) throw new Error(`Enter ${label}.`); return result }
  const list = (value, max, label) => { if (!Array.isArray(value) || value.length > max || value.some(x => !x || typeof x !== 'object')) throw new Error(`Provide up to ${max} ${label}.`); return value }
  const https = value => { try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password } catch { return false } }
  const imageValid = value => {
    if (!value) return true
    if (typeof value !== 'string') return false
    const trimmed = value.trim()
    if (!trimmed) return true
    if (https(trimmed)) return true
    return /^\/(?!\/)[\w/.-]+\.(jpg|jpeg|png|webp|svg|gif)$/i.test(trimmed)
  }

  const result = {
    popupEnabled: input.popupEnabled !== false,
    popupDelay: Math.max(1, Math.min(60, Number(input.popupDelay) || 4)),
    popupTitle: required(input.popupTitle, 180, 'a popup headline'),
    popupText: text(input.popupText, 1000),
    videoUrl: text(input.videoUrl, 500)
  }
  if (result.videoUrl && !/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(result.videoUrl)) throw new Error('Use a YouTube HTTPS video URL.')

  for (const key of ['gallery', 'testimonials', 'policies']) {
    result[key] = list(input[key] ?? defaultContent[key] ?? [], 50, key).map(entry => {
      if (key === 'gallery') {
        const image = text(entry.image, 500)
        if (!https(image) && !/^\/(?!\/)[\w/.-]+\.(jpg|jpeg|png|webp|svg|gif)$/i.test(image)) throw new Error('Gallery images must use an HTTPS URL or a local image path.')
        return { title: text(entry.title, 150), city: text(entry.city, 80), image }
      }
      if (key === 'testimonials') {
        const rating = entry.rating === '' || entry.rating == null ? null : Number(entry.rating)
        if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) throw new Error('Choose a class clarity rating from 1 to 5.')
        return { name: required(entry.name, 120, 'a learner name'), role: text(entry.role, 120), quote: text(entry.quote, 2000), rating }
      }
      return { slug: text(entry.slug, 80).replace(/[^a-z-]/g, ''), title: text(entry.title, 160), body: text(entry.body, 12000) }
    })
  }

  const contact = input.contact ?? defaultContent.contact
  result.contact = Object.fromEntries(Object.entries({ title:180, description:1000, location:300, phone:30, email:254 }).map(([key,max]) => [key,required(contact?.[key],max,`contact ${key}`)]))
  if (contact?.website != null) result.contact.website = text(contact.website, 120)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.contact.email)) throw new Error('Enter a valid contact email.')
  if (!/^\+?[\d\s().-]{7,30}$/.test(result.contact.phone) || result.contact.phone.replace(/\D/g,'').length < 7) throw new Error('Enter a valid contact phone number.')

  result.registrationLabel = required(input.registrationLabel ?? defaultContent.registrationLabel, 60, 'a registration button label')
  result.communityLabel = required(input.communityLabel ?? defaultContent.communityLabel, 60, 'a community button label')

  result.socialLinks = list(input.socialLinks ?? [], 12, 'social links').map(entry => {
    const url = text(entry.url, 500)
    if (!https(url)) throw new Error('Social links must use valid HTTPS URLs without embedded credentials.')
    return { label: required(entry.label, 60, 'a social link label'), url }
  })

  result.faqs = list(input.faqs ?? defaultContent.faqs, 60, 'FAQs').map(entry => ({
    category: required(entry.category, 60, 'an FAQ category'),
    question: required(entry.question, 300, 'an FAQ question'),
    answer: required(entry.answer, 4000, 'an FAQ answer'),
  }))

  result.courses = list(input.courses ?? defaultContent.courses, 12, 'courses').map((entry, i) => {
    const slug = required(entry.slug, 80, 'a course slug')
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Course slugs can contain lowercase letters, numbers, and single hyphens.')
    const course = { slug, number: String(i + 1).padStart(2, '0') }
    for (const [key, max] of Object.entries({ name: 100, tagline: 200, ctaLabel: 120, description: 2000, intro: 8000, focusTitle: 200, focus: 4000 })) {
      course[key] = key === 'name' || key === 'description' ? required(entry[key], max, `course ${key}`) : text(entry[key], max)
    }
    course.modules = list(entry.modules, 40, 'course modules').map(module => {
      if (!Array.isArray(module) || !Array.isArray(module[2]) || module[2].length > 60) throw new Error('Each module needs a title, description and up to 60 topics.')
      return [required(module[0], 200, 'a module title'), text(module[1], 4000), module[2].map(topic => required(topic, 500, 'a module topic'))]
    })
    return course
  })
  if (!result.courses.length) throw new Error('Keep at least one course available.')
  if (new Set(result.courses.map(c => c.slug)).size !== result.courses.length) throw new Error('Each course needs a unique slug.')
  if (new Set(result.courses.map(c => c.name.toLowerCase())).size !== result.courses.length) throw new Error('Each course needs a unique name.')

  // Brand validation
  const brand = input.brand ?? defaultContent.brand ?? {}
  const logo = text(brand.logo ?? defaultContent.brand?.logo, 500)
  if (!imageValid(logo)) throw new Error('Brand logo must be a valid HTTPS URL or local image path.')
  const favicon = text(brand.favicon ?? defaultContent.brand?.favicon, 500)
  if (!imageValid(favicon)) throw new Error('Favicon must be a valid HTTPS URL or local image path.')
  result.brand = {
    name: required(brand.name ?? defaultContent.brand?.name ?? 'Mubsa Fin Institute°', 100, 'brand name'),
    shortName: text(brand.shortName ?? defaultContent.brand?.shortName ?? 'Mubsa Fin Institute', 80),
    tagline: text(brand.tagline ?? defaultContent.brand?.tagline ?? 'We Grow Together', 140),
    descriptor: text(brand.descriptor ?? defaultContent.brand?.descriptor ?? 'MARKET EDUCATION', 80),
    logo: logo || '/mubsa-logo.jpg',
    favicon: favicon || '/favicon.svg',
    headerCtaLabel: text(brand.headerCtaLabel ?? defaultContent.brand?.headerCtaLabel ?? 'MUBSA MAGIC', 60),
    headerCtaUrl: text(brand.headerCtaUrl ?? defaultContent.brand?.headerCtaUrl ?? '', 500)
  }

  // Hero validation
  const hero = input.hero ?? defaultContent.hero ?? {}
  const heroImage = text(hero.image ?? defaultContent.hero?.image, 500)
  if (!imageValid(heroImage)) throw new Error('Hero image must be a valid HTTPS URL or local image path.')
  const workshopImage = text(hero.workshopImage ?? defaultContent.hero?.workshopImage, 500)
  if (!imageValid(workshopImage)) throw new Error('Workshop image must be a valid HTTPS URL or local image path.')
  result.hero = {
    kicker: text(hero.kicker ?? defaultContent.hero?.kicker ?? 'MARKET INTELLIGENCE · STRATEGIC ANALYSIS · RISK DISCIPLINE', 200),
    title: required(hero.title ?? defaultContent.hero?.title ?? "Don't just follow the market.\nLearn to read it.", 300, 'hero headline'),
    text: text(hero.text ?? defaultContent.hero?.text ?? '', 2000),
    image: heroImage || '/mubsa-market-learning-hero.png',
    workshopImage: workshopImage || '/mubsa-workshop-learning.png',
    primaryCtaText: text(hero.primaryCtaText ?? defaultContent.hero?.primaryCtaText ?? 'Join MARKET DNA', 60),
    primaryCtaLink: text(hero.primaryCtaLink ?? defaultContent.hero?.primaryCtaLink ?? '/webinar', 200),
    secondaryCtaText: text(hero.secondaryCtaText ?? defaultContent.hero?.secondaryCtaText ?? 'Explore Courses', 60),
    secondaryCtaLink: text(hero.secondaryCtaLink ?? defaultContent.hero?.secondaryCtaLink ?? '/courses', 200),
    communityCtaText: text(hero.communityCtaText ?? defaultContent.hero?.communityCtaText ?? 'The 5% Club', 60),
    badgeText: text(hero.badgeText ?? defaultContent.hero?.badgeText ?? 'STRUCTURED MARKET LEARNING', 100)
  }

  // About & Founder validation
  const about = input.about ?? defaultContent.about ?? {}
  const founderImage = text(about.founderImage ?? defaultContent.about?.founderImage, 500)
  if (!imageValid(founderImage)) throw new Error('Founder portrait image must be a valid HTTPS URL or local image path.')
  const founderMentorImage = text(about.founderMentorImage ?? defaultContent.about?.founderMentorImage, 500)
  if (!imageValid(founderMentorImage)) throw new Error('Founder mentor image must be a valid HTTPS URL or local image path.')
  result.about = {
    founderName: required(about.founderName ?? defaultContent.about?.founderName ?? 'Mubarak Ahmad', 120, 'founder name'),
    founderRole: text(about.founderRole ?? defaultContent.about?.founderRole ?? 'Founder & Academic Director', 120),
    founderImage: founderImage || '/client-portrait.jpg',
    founderMentorImage: founderMentorImage || '/client-founder.jpg',
    founderBio: text(about.founderBio ?? defaultContent.about?.founderBio ?? '', 10000),
    founderQuote: text(about.founderQuote ?? defaultContent.about?.founderQuote ?? '“The greatest investment begins with investing in knowledge.”', 500),
    visionTitle: text(about.visionTitle ?? defaultContent.about?.visionTitle ?? 'OUR VISION', 100),
    visionText: text(about.visionText ?? defaultContent.about?.visionText ?? '', 3000),
    missionTitle: text(about.missionTitle ?? defaultContent.about?.missionTitle ?? 'OUR MISSION', 100),
    missionText: text(about.missionText ?? defaultContent.about?.missionText ?? '', 3000),
    engineeringStoryTitle: text(about.engineeringStoryTitle ?? defaultContent.about?.engineeringStoryTitle ?? 'Engineering expertise, kept in its own lane.', 200),
    engineeringStoryText: text(about.engineeringStoryText ?? defaultContent.about?.engineeringStoryText ?? '', 6000)
  }

  // Stats validation
  const stats = input.stats ?? defaultContent.stats ?? []
  result.stats = list(stats, 12, 'stats').map(entry => ({
    number: required(entry.number, 30, 'a stat number (e.g. 5+)'),
    label: required(entry.label, 120, 'a stat label')
  }))

  // Stages validation
  const stages = input.stages ?? defaultContent.stages ?? []
  result.stages = list(stages, 10, 'stages').map((entry, index) => ({
    number: text(entry.number || String(index + 1).padStart(2, '0'), 10),
    title: required(entry.title, 100, 'stage title'),
    text: text(entry.text, 500)
  }))

  // Promises validation
  const promises = input.promises ?? defaultContent.promises ?? []
  result.promises = list(promises, 10, 'promises').map(entry => ({
    title: required(entry.title, 100, 'promise title')
  }))

  // Community validation
  const comm = input.community ?? defaultContent.community ?? {}
  result.community = {
    title: text(comm.title ?? defaultContent.community?.title ?? 'WE GROW TOGETHER.', 140),
    text: text(comm.text ?? defaultContent.community?.text ?? 'Be part of our growing community. Join our public Telegram channel to stay connected.', 600),
    buttonLabel: text(comm.buttonLabel ?? defaultContent.community?.buttonLabel ?? 'Join our 5% CLUB', 60),
    buttonUrl: text(comm.buttonUrl ?? defaultContent.community?.buttonUrl ?? '', 500)
  }

  // Footer validation
  const footer = input.footer ?? defaultContent.footer ?? {}
  result.footer = {
    description: text(footer.description ?? defaultContent.footer?.description ?? 'Build your market understanding through a structured, time-conscious approach. Mubsa Fin Institute helps learners study markets, charts, and risk with purpose.', 1000),
    disclaimer: text(footer.disclaimer ?? defaultContent.footer?.disclaimer ?? 'Trading and investing involve risk, including possible loss of capital. Course content is educational and does not guarantee profits or replace financial advice based on individual circumstances.', 1000),
    copyright: text(footer.copyright ?? defaultContent.footer?.copyright ?? 'Mubsa Fin Institute. All rights reserved.', 200)
  }

  // Media Library
  result.mediaLibrary = Array.isArray(input.mediaLibrary) ? input.mediaLibrary.slice(0, 100).map(item => ({
    id: text(item.id, 80),
    name: text(item.name, 120),
    url: text(item.url, 500),
    size: Number(item.size) || 0,
    uploadedAt: text(item.uploadedAt, 40)
  })) : (defaultContent.mediaLibrary || [])

  return result
}
