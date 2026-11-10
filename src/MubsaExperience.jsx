import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { FaWhatsapp, FaTelegram, FaSun, FaMoon, FaBars, FaXmark, FaArrowRight, FaPlay, FaChevronLeft, FaChevronRight, FaChartLine, FaCompass, FaClock, FaGraduationCap } from 'react-icons/fa6'
import AdminDashboard from './AdminDashboard'
import { defaultContent as defaults } from './siteDefaults'
import './experience.css'
import { AnnouncementTicker, WebinarPanel } from './WebinarExperience'
import { SocialDock, WhatsAppPanel, BackToTop, TopicTiles, FeedbackCards } from './ReferenceInteractions'
import './reference-refinements.css'
import CourseBranches from './CourseBranches'
import './course-branches.css'
import { usePageMotion } from './usePageMotion'

const founder = '/client-founder.jpg'
const portrait = '/client-portrait.jpg'
const SiteContext = createContext({ content: defaults, whatsappUrl: '', telegramUrl: '' })
const guide = [
  ['Prepare before the market', 'Choose the market and timeframe you want to study. Mark the relevant highs, lows, and areas of interest. Write down what would change your view.'],
  ['Read time and price together', 'Observe how price behaves around levels over time. Use technical concepts as questions to investigate, rather than as promises about the next move.'],
  ['Define the risk first', 'Consider position size, invalidation, and potential loss before any trade. A setup is incomplete without a clear risk plan.'],
  ['Review the process', 'Record your reasoning and outcome. Review whether you followed your plan, not simply whether a trade made money.'],
]
const topics = [['Time cycles', 'Study rhythm and recurring intervals.'], ['Square of nine', 'Explore numerical relationships in price.'], ['Natural ratios', 'Understand geometric market concepts.'], ['Gann angles', 'Study trend, time, and price relationships.'], ['Price targets', 'Plan scenarios with clear invalidation.']]
const fmtDate = w => new Date(w.startsAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: w.timeZone || 'Asia/Kolkata' })

export function Modal({ title, close, children, wide = false }) {
  const ref = useRef(null)
  useEffect(() => {
    const origin = document.activeElement
    const dialog = ref.current
    dialog.showModal()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { dialog.close(); document.body.style.overflow = previous; origin?.focus?.() }
  }, [])
  return <dialog ref={ref} className={`m-dialog ${wide ? 'wide' : ''}`} aria-label={title} onCancel={e => { e.preventDefault(); close() }} onClick={e => { if (e.target === e.currentTarget) close() }}><div className="m-dialog-body"><button className="m-close" aria-label="Close popup" onClick={close}><FaXmark /></button>{children}</div></dialog>
}

function LeadForm({ webinar, webinarInterest = false, subject = '', onSuccess }) {
  const { content } = useContext(SiteContext)
  const courses = content.courses
  const [status, setStatus] = useState({})
  const formRef = useRef()
  async function submit(e) {
    e.preventDefault()
    const values = Object.fromEntries(new FormData(e.currentTarget))
    setStatus({ busy: true })
    try {
      const body = webinar ? { ...values, name: values.fullName, webinarId: webinar.id, consent: true } : { ...values, ...(webinarInterest ? { kind:'webinar-interest', course:courses[0].name } : {}), message: `${subject ? `Subject: ${subject}\n` : ''}${values.message || ''}`, consent: true }
      const response = await fetch(webinar ? '/api/webinar-registrations' : '/api/booking-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await response.json()
      if (!response.ok) { setStatus({ error: data.message, errors: data.errors || {} }); return }
      setStatus({ success: true, reference: data.reference })
      onSuccess?.()
    } catch { setStatus({ error: 'We could not connect. Your details are still here. Please retry or contact us by phone.' }) }
  }
  if (status.success) return <div className="m-success" role="status"><h3>{webinar ? 'You’re registered.' : 'Your enquiry is saved.'}</h3><p>{webinar ? 'Keep this reference. Contact the team if you need joining details.' : 'The team will contact you using the details you provided.'}</p><strong>{status.reference}</strong><button className="m-btn secondary" onClick={() => setStatus({})}>Send another enquiry</button></div>
  const error = name => status.errors?.[name] && <small className="m-error" id={`err-${name}`}>{status.errors[name]}</small>
  return <form className="m-form" ref={formRef} onSubmit={submit}>
    <div className="m-form-grid"><label>Full name<input name="fullName" autoComplete="name" minLength="2" maxLength="120" required aria-describedby="err-name" />{error('name')}{error('fullName')}</label><label>Email address<input name="email" autoComplete="email" type="email" maxLength="254" required />{error('email')}</label></div>
    <label>Phone / WhatsApp<input name="phone" autoComplete="tel" type="tel" placeholder="Include country code" minLength="7" maxLength="30" required />{error('phone')}</label>
    {(webinar || webinarInterest) ? <div className="m-form-grid"><label>City<select name="city" defaultValue="" required><option value="" disabled>Select your city</option>{['Chennai', 'Coimbatore', 'Madurai', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Dubai', 'Other'].map(x => <option key={x}>{x}</option>)}</select>{error('city')}</label><label>Profession<select name="profession" defaultValue="" required><option value="" disabled>Select profession</option>{['Student', 'Business owner', 'Salaried professional', 'Finance professional', 'Homemaker', 'Educator', 'Other'].map(x => <option key={x}>{x}</option>)}</select>{error('profession')}</label></div> : <><label>Course of interest<select name="course" defaultValue={courses.find(c => c.name === subject)?.name || courses[0].name}>{courses.map(c => <option key={c.slug}>{c.name}</option>)}</select>{error('course')}</label><label>Your message<textarea name="message" rows="3" maxLength="2000" /></label></>}
    <label className="m-consent"><input type="checkbox" required name="consent" />I agree to be contacted about this {webinar || webinarInterest ? 'webinar' : 'enquiry'}.</label>
    {status.error && <div className="m-error" role="alert">{status.error}{error('webinarId')}</div>}
    <button className="m-btn" disabled={status.busy}>{status.busy ? 'Saving…' : webinar ? webinar.ctaLabel || content.registrationLabel : webinarInterest ? 'Notify me about the next webinar' : 'Send enquiry'} <FaArrowRight /></button>
  </form>
}

function FAQ({ full = false }) {
  const { content } = useContext(SiteContext)
  const questions = content.faqs.map(faq => [faq.category,faq.question,faq.answer])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [expanded, setExpanded] = useState(full)
  const filtered = questions.filter(([c, q, a]) => (category === 'All' || c === category) && `${q} ${a}`.toLowerCase().includes(search.toLowerCase()))
  return <section className="m-section" id="faq"><Heading eyebrow="HELP CENTER" title="Frequently asked questions" text="A little clarity before your next step." /><div className="m-faq"><label className="m-search">Search questions<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses, trading, support…" /></label><div className="m-chips">{['All', ...new Set(questions.map(q => q[0]))].map(c => <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div>{(expanded ? filtered : filtered.slice(0, 4)).map(([, q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}{!filtered.length && <p role="status">No matching questions. Try another search.</p>}{filtered.length > 4 && <button className="m-text" onClick={() => setExpanded(!expanded)}>{expanded ? 'Show fewer' : 'View more answers'} <FaArrowRight /></button>}</div></section>
}
function Heading({ eyebrow, title, text }) { return <div className="m-heading"><p className="m-kicker">{eyebrow}</p><h2>{title}</h2>{text && <p>{text}</p>}</div> }
function Graph() { return <svg className="m-chart" viewBox="0 0 600 300" aria-label="Illustrative price and time study, not live market data" role="img"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="currentColor" opacity=".12" /></pattern></defs><rect width="600" height="300" fill="url(#grid)" /><path d="M0 260L85 215L140 240L210 150L270 170L335 85L410 120L480 40L540 70L600 12" fill="none" stroke="currentColor" strokeWidth="3" /><path d="M0 290L600 0M0 290L600 140M0 290L300 0" fill="none" stroke="currentColor" opacity=".3" /><text x="18" y="26" fill="currentColor" fontSize="11">ILLUSTRATIVE TIME / PRICE STUDY</text></svg> }

function Gallery({ items, open }) {
  const [city, setCity] = useState('All')
  return <section className="m-section" id="gallery"><Heading eyebrow="OUR COMMUNITY" title="Moments of learning." text="Meet the people and ideas behind Mubsa." /><div className="m-chips">{['All', ...new Set(items.map(x => x.city))].map(c => <button aria-pressed={city === c} key={c} onClick={() => setCity(c)}>{c}</button>)}</div><div className="m-gallery">{items.filter(x => city === 'All' || x.city === city).map((x, i) => <button key={`${x.title}-${i}`} onClick={() => open({ type: 'image', item: x })}><img src={x.image} alt={x.title} loading="lazy" /><span>{x.title}<small>{x.city}</small></span></button>)}</div>{!items.length && <div className="m-empty">Event memories will be shared here after our next published session.<button className="m-text" onClick={() => open({ type: 'webinar' })}>Ask about upcoming sessions <FaArrowRight /></button></div>}</section>
}
function Feedback({ items }) {
  return <section className="m-section m-tone" id="testimonials"><Heading eyebrow="LEARNER VOICES" title="People from different paths, learning with purpose." text="Feedback from the Mubsa Fin Institute learning community." /><FeedbackCards items={items} /></section>
}
function SocialLinks() {
  const { content, telegramUrl } = useContext(SiteContext)
  return <div className="m-social-links" aria-label="Social media links">{telegramUrl && <a href={telegramUrl} target="_blank" rel="noreferrer">Telegram ↗</a>}{content.socialLinks.map(link => <a key={link.label + link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div>
}
function Contact() {
  const { content, whatsappUrl } = useContext(SiteContext)
  const { title, description, location, email, phone } = content.contact
  return <section className="m-section m-contact" id="contact"><div><p className="m-kicker">CONTACT US</p><h2>{title}</h2><p>{description}</p><dl><dt>BASED IN</dt><dd>{location}</dd><dt>EMAIL US</dt><dd><a href={`mailto:${email}`}>{email}</a></dd><dt>CALL US</dt><dd><a href={`tel:${phone.replace(/[^+0-9]/g,'')}`}>{phone}</a></dd></dl>{whatsappUrl && <a className="m-text" href={whatsappUrl} target="_blank" rel="noreferrer"><FaWhatsapp /> Chat on WhatsApp</a>}<SocialLinks /></div><LeadForm /></section>
}
function Funds({ open }) {
  const [monthly, setMonthly] = useState(5000), [years, setYears] = useState(10), [rate, setRate] = useState(8)
  const months = years * 12, r = rate / 1200, invested = monthly * months, projected = r ? monthly * ((1 + r) ** months - 1) / r : invested
  const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
  return <section className="m-section m-contact"><div><p className="m-kicker">MUTUAL FUND EDUCATION</p><h1>Understand compounding.</h1><p>Explore how a regular contribution and an assumed return affect a hypothetical investment. This illustration excludes fees, taxes, and changing returns; it is not a forecast or recommendation.</p><button className="m-btn" onClick={() => open({ type: 'enquiry', subject: 'Mutual fund education' })}>Ask the team <FaArrowRight /></button></div><div className="m-card m-form"><label>Monthly contribution (₹)<input type="number" min="0" max="10000000" value={monthly} onChange={e => setMonthly(Math.max(0, Math.min(10000000, Number(e.target.value))))} /></label><label>Years: {years}<input type="range" min="1" max="40" value={years} onChange={e => setYears(Number(e.target.value))} /></label><label>Assumed annual return (%): {rate}<input type="range" min="0" max="20" value={rate} onChange={e => setRate(Number(e.target.value))} /></label><p>Contributed <strong>{money(invested)}</strong></p><p>Illustrative value <strong>{money(projected)}</strong></p></div></section>
}

export default function MubsaExperience() {
  const [path, setPath] = useState(window.location.pathname)
  const [anchor, setAnchor] = useState(window.location.hash)
  const [menu, setMenu] = useState(false), [more, setMore] = useState(false)
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('mubsa-theme') || 'dark' } catch { return 'dark' } })
  const [data, setData] = useState({ content: defaults, slides: [] }), [loaded, setLoaded] = useState(false), [offline, setOffline] = useState(false)
  const [modal, setModal] = useState(null), [intro, setIntro] = useState(0), [book, setBook] = useState(0)
  const [copyrightYear] = useState(() => new Date().getFullYear())
  const seen = useRef(false)
  usePageMotion(path)
  const content = { ...defaults, ...data.content }
  const courses = content.courses
  const { phone, email } = content.contact
  const whatsappUrl = data.whatsappUrl || `https://wa.me/${phone.replace(/\D/g, '')}`
  const introCourse = courses[intro % courses.length]
  const go = (url) => { window.history.pushState({}, '', url); setPath(url.split('#')[0] || '/'); setAnchor(window.location.hash); setMenu(false); setMore(false); if (url.includes('#')) setTimeout(() => document.getElementById(url.split('#')[1])?.scrollIntoView(), 0); else window.scrollTo(0, 0) }
  useEffect(() => { const pop = () => { setPath(location.pathname); setAnchor(location.hash); setMenu(false); setMore(false) }; window.addEventListener('popstate', pop); window.addEventListener('hashchange',pop); return () => { window.removeEventListener('popstate', pop); window.removeEventListener('hashchange',pop) } }, [])
  useEffect(() => {
    const dismiss = e => { if (!e.target.closest('.m-header')) { setMore(false); setMenu(false) } }
    const escape = e => { if (e.key === 'Escape') { setMore(false); setMenu(false) } }
    document.addEventListener('pointerdown', dismiss); document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown',dismiss); document.removeEventListener('keydown',escape) }
  }, [])
  useEffect(() => {
    const label = path.startsWith('/courses/') ? data.content.courses?.find(c => path === `/courses/${c.slug}`)?.name : ({'/courses':'Courses','/services':'Services','/events':'Events','/about':'About','/team':'Our team','/testimonials':'Learner feedback','/faq':'FAQs','/contact':'Contact','/booking':'Book a session','/mutual-funds':'Mutual fund education'})[path]
    document.title = label ? `${label} | Mubsa Fin Institute` : 'Mubsa Fin Institute | Market Education'
  }, [path, data.content])
  useEffect(() => { if (anchor) requestAnimationFrame(() => document.getElementById(anchor.slice(1))?.scrollIntoView()) }, [path, anchor])
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('mubsa-theme', theme) } catch {} }, [theme])
  useEffect(() => {
    if (path === '/admin') return
    let active = true
    const refresh = async () => { try { const res = await fetch('/api/site-content'); if (!res.ok) throw Error(); const result = await res.json(); if (active) { setData(result); setOffline(false) } } catch { if (active) setOffline(true) } finally { if (active) setLoaded(true) } }
    refresh(); const timer = setInterval(refresh, 30000)
    return () => { active = false; clearInterval(timer) }
  }, [path])
  useEffect(() => { if (!loaded || path !== '/' || seen.current || modal || !content.popupEnabled) return; let dismissed = false; try { dismissed = sessionStorage.getItem('mubsa-welcome') === 'seen' } catch {} if (dismissed) return; const timer = setTimeout(() => { seen.current = true; try { sessionStorage.setItem('mubsa-welcome', 'seen') } catch {} setModal({ type: 'welcome' }) }, content.popupDelay * 1000); return () => clearTimeout(timer) }, [loaded, path, modal, content.popupEnabled, content.popupDelay])
  const close = () => { if (modal?.type === 'welcome') { try { sessionStorage.setItem('mubsa-welcome', 'seen') } catch {} } setModal(null) }
  const open = value => { seen.current = true; setModal(value) }
  if (path === '/admin' || path === '/login') return <AdminDashboard />
  const webinar = data.webinar
  const routeCourse = courses.find(c => path === `/courses/${c.slug}`)
  const navLink = (label, href) => <a href={href} aria-current={path + anchor === href ? 'page' : undefined} onClick={e => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); go(href) } }}>{label}</a>
  const community = () => data.telegramUrl ? window.open(data.telegramUrl, '_blank', 'noopener,noreferrer') : open({ type: 'enquiry', subject: 'Community updates' })
  const gallery = content.gallery
  const policySlug = path.startsWith('/policies/') ? path.split('/').pop() : ''
  const policy = content.policies.find(x => x.slug === policySlug)
  const isHome = path === '/'
  return <SiteContext.Provider value={{ ...data, content, whatsappUrl }}><div className="mubsa-site"><a className="m-skip" href="#main-content">Skip to content</a>
    <header className="m-header"><a href="/" className="m-brand" onClick={e => { e.preventDefault(); go('/') }}><span>M</span><div>MUBSA<small>FIN INSTITUTE</small></div></a><button className="m-mobile" aria-label="Toggle navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <FaXmark /> : <FaBars />}</button><nav className={menu ? 'open' : ''} aria-label="Main navigation">{navLink('Home', '/')}{navLink('About', '/#about')}{navLink('Services', '/#services')}{navLink('Mutual Funds', '/mutual-funds')}<div className="m-more"><button aria-expanded={more} onClick={() => setMore(!more)}>More ▾</button>{more && <div onKeyDown={e => { if (e.key === 'Escape') setMore(false) }}>{[['Courses','/courses'],['Events','/events'],['Team','/#team'],['Testimonials','/testimonials'],['Study guide','/#book'],['FAQs','/faq'],['Contact','/contact']].map(([label, url]) => <span key={url}>{navLink(label, url)}</span>)}</div>}</div><div className="m-mobile-links">{navLink('Login', '/login')}<button className="m-btn small" onClick={community}>{content.communityLabel} <FaArrowRight /></button></div></nav><div className="m-header-actions"><button className="m-icon" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <FaSun /> : <FaMoon />}</button>{navLink('Login', '/login')}<button className="m-btn small" onClick={community}>{content.communityLabel} <FaArrowRight /></button></div></header>
    {offline && <div className="m-offline" role="status">The online services are unavailable. Please retry shortly or call {phone}.</div>}
    <AnnouncementTicker webinar={webinar} telegramUrl={data.telegramUrl} community={community} register={() => open({type:'webinar'})} slides={data.slides || []} />
    <main id="main-content">
    {isHome && <><section className="m-hero"><div className="m-hero-copy"><p className="m-kicker">MARKET EDUCATION · CHART ANALYSIS · RISK AWARENESS</p><h1>Learn the markets.<br /><em>Build your own process.</em></h1><p>Understand how markets work, learn to read price charts, and develop a more considered approach to investing and trading. Mubsa Fin Institute offers learning paths from market fundamentals to advanced technical analysis.</p><div className="m-actions m-hero-actions"><button className="m-btn" onClick={() => open({type:'webinar'})}>Join Free Webinar <FaArrowRight /></button><a className="m-btn secondary" href="#services">Explore Courses <FaArrowRight /></a><button className="m-btn secondary" onClick={() => open({ type: 'insight' })}>Watch Free Insight <FaPlay /></button></div><button className="m-text m-session-link" onClick={() => open({type:'guidance'})}>Request a Session <FaArrowRight /></button></div><div className="m-hero-image"><img src={founder} alt="Mubarak Ahmad, founder of Mubsa Fin Institute" fetchPriority="high" width="960" height="1440" /><div className="m-mentor-label"><small>YOUR MENTOR</small><strong>Mubarak Ahmad</strong><span>Founder & Academic Director</span></div></div></section><div className="m-principles">{[['01','Structured learning'],['02','Multiple markets'],['03','Time & price study'],['04','Risk comes first']].map(([n,t]) => <div key={n}><strong>{n}</strong><span>{t}</span></div>)}</div>
    <section className="m-section m-intro" id="about"><div><p className="m-kicker">A CLEARER START</p><h2>A stronger foundation for every market decision.</h2><p>Markets can feel difficult to follow when the language, charts, and methods are unfamiliar. Our courses make those ideas easier to study, with a structured path through market basics, chart analysis, trading frameworks, and advanced methods.</p><p>Learn the concepts. Practice what you learn. Build an approach that reflects your own understanding and risk decisions.</p><button className="m-text" onClick={() => open({ type: 'vision' })}>Discover our vision <FaArrowRight /></button></div><div className="m-card"><p className="m-kicker">LEARNING PATH</p><FaGraduationCap className="m-large-icon" /><h3>{introCourse.name}</h3><p>{introCourse.description}</p><div className="m-controls"><button aria-label="Previous introduction" onClick={() => setIntro((intro + courses.length - 1) % courses.length)}><FaChevronLeft /></button><button aria-label="Next introduction" onClick={() => setIntro((intro + 1) % courses.length)}><FaChevronRight /></button></div></div></section>
    <section className="m-section m-intro m-tone"><div><p className="m-kicker">LEARNING PROCESS</p><h2>Study concepts.<br />Practice with purpose.</h2><p>Work through market language, chart examples, and structured topics with a path that matches your current knowledge.</p>{[['Learn the concept','Understand the language, tools, and analytical methods covered in your course.'],['Apply it to charts','Work through chart examples and practice identifying the ideas you have studied.'],['Develop your process','Use what you learn to organise your analysis, plan possible trades, and consider risk.']].map(([t,d],i) => <div className="m-focus-row" key={t}><span>0{i+1}</span><div><strong>{t}</strong><p>{d}</p></div></div>)}</div><div className="m-chart-panel"><Graph /><span>PREPARATION BEFORE PREDICTION</span></div></section>
    <section className="m-section" id="gann"><Heading eyebrow="TIME + PRICE" title="Explore the Gann framework." text="A structured study of price, time, and geometric relationships." /><TopicTiles topics={topics} open={open} /><div className="m-center"><button className="m-btn" onClick={() => go(`/courses/${courses.find(c => c.slug === 'advanced')?.slug || courses[courses.length-1].slug}`)}>Explore full curriculum <FaArrowRight /></button></div></section></>}
    {(isHome || path === '/courses' || path === '/services') && <section className="m-section m-tone" id="services"><Heading eyebrow="OUR EXPERTISE" title="Where should I Start?" text="Start with the fundamentals, develop your chart analysis, or explore advanced technical methods. Each course has its own focus." />{isHome || path === '/services' ? <CourseBranches courses={courses} go={go} /> : <div className="m-course-grid">{courses.map((c,i) => <a className="m-card m-course-link" key={c.slug} href={`/courses/${c.slug}`} onClick={e => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); go(`/courses/${c.slug}`) } }}>{[<FaCompass key="a" />,<FaChartLine key="b" />,<FaClock key="c" />][i % 3]}<p className="m-kicker">{c.tagline}</p><h3>{c.name}</h3><p>{c.description}</p><span className="m-text">View curriculum <FaArrowRight /></span></a>)}</div>}<div className="m-center"><button className="m-btn secondary" onClick={() => open({ type: 'guidance' })}>Help me choose a course</button></div></section>}
    {isHome && <section className="m-section m-intro"><div><p className="m-kicker">COURSE PRINCIPLES</p><h2>A thoughtful approach to the markets.</h2><p>Trading is a skill that requires study, practice, and discipline. It is not a shortcut to guaranteed income. Our courses focus on education, market analysis, and risk awareness, not promises of fixed profits.</p></div><div><p className="m-kicker">YOUR NEXT STEP</p><h2>Find the course that fits your next step.</h2><p>Explore the course outlines to see what each level covers. If you are unsure where to begin, contact our team with your questions.</p><div className="m-actions"><a className="m-btn" href="/courses" onClick={e => { e.preventDefault(); go('/courses') }}>Compare Courses <FaArrowRight /></a><a className="m-btn secondary" href="/contact" onClick={e => { e.preventDefault(); go('/contact') }}>Ask a Question</a></div></div></section>}
    {routeCourse && <section className="m-section"><p className="m-kicker">COURSE CURRICULUM</p><h1>{routeCourse.name}</h1><p className="m-kicker">{routeCourse.tagline}</p><p className="m-lead">{routeCourse.intro || routeCourse.description}</p>{routeCourse.focusTitle && <h2>{routeCourse.focusTitle}</h2>}{routeCourse.focus && <p className="m-lead">{routeCourse.focus}</p>}<button className="m-btn" onClick={() => open({ type: 'enquiry', subject: routeCourse.name })}>Enquire about this course <FaArrowRight /></button><div className="m-modules">{routeCourse.modules.map(([title,desc,items],i) => <details key={title} open={i === 0}><summary><small>MODULE {i+1}</small>{title}</summary><p>{desc}</p><ul>{items.map(x => <li key={x}>{x}</li>)}</ul></details>)}</div></section>}
    {isHome && <section className="m-section m-book-section" id="book"><div><p className="m-kicker">THE MUBSA STUDY NOTES</p><h2>A process you<br />can return to.</h2><p>An introductory four-part reading guide to preparation, time and price, risk, and review.</p><div className="m-actions"><button className="m-btn" onClick={() => open({ type: 'guide' })}>View study guide <FaArrowRight /></button><button className="m-text" onClick={() => open({ type: 'enquiry', subject: 'Study guide' })}>Enquire now</button></div></div><div className="m-book"><small>MUBSA FIN INSTITUTE / LEARNING NOTES</small><span>THE<br />MARKET<br /><em>METHOD.</em></span><div className="m-book-page" key={book} aria-live="polite"><b>{guide[book][0]}</b><p>{guide[book][1]}</p></div><div className="m-controls"><button aria-label="Previous guide page" onClick={() => setBook((book + 3) % 4)}><FaChevronLeft /></button><button aria-label="Next guide page" onClick={() => setBook((book+1) % 4)}><FaChevronRight /></button></div></div></section>}
    {(isHome || path === '/events') && data.webinars?.length > 0 && <section className="m-section m-tone" id="seminars"><Heading eyebrow="UPCOMING SEMINARS" title="Learn with us, live." text="Choose a session and reserve your place." /><div className="m-course-grid">{data.webinars.map(event => <article className="m-card" key={event.id}><p className="m-kicker">{fmtDate(event)} · {event.timeZone}</p><h3>{event.title}</h3><p>{event.description}</p><p>{event.speaker} · {event.durationMinutes} minutes</p><button className="m-btn" onClick={() => open({ type:'webinar', webinar:event })}>{event.ctaLabel || content.registrationLabel} <FaArrowRight /></button></article>)}</div></section>}
    {(isHome || path === '/events') && <Gallery items={gallery} open={open} />}
    {(isHome || path === '/about' || path === '/team') && <section className="m-section m-team" id="team"><div className="m-team-image"><img src={portrait} alt="Mubarak Ahmad" width="912" height="1136" loading="lazy" /></div><div><p className="m-kicker">MEET YOUR MENTOR</p><h2>Mubarak Ahmad.</h2><p className="m-gold">Founder & Academic Director</p><p>A share-market educator based in Dubai, Mubarak brings an emphasis on preparation, patience, and risk awareness to the classroom.</p><p>His mission is to help people build a stronger understanding of markets through structured education and consistent practice.</p><blockquote>“Learn with purpose. Move forward with knowledge.”</blockquote><button className="m-btn secondary" onClick={() => open({ type: 'enquiry', subject: 'Mentorship' })}>Meet the learning team <FaArrowRight /></button></div></section>}
    {(isHome || path === '/testimonials') && <Feedback items={content.testimonials} />}
    {isHome && <section className="m-community"><FaTelegram /><div><h2>Keep learning. Together.</h2><p>Connect with the team for session announcements and market learning updates.</p></div><button className="m-btn" onClick={community}>{content.communityLabel} <FaArrowRight /></button></section>}
    {(isHome || path === '/faq') && <FAQ key={path} full={!isHome} />}
    {(isHome || path === '/contact' || path === '/booking') && <Contact />}
    {path === '/mutual-funds' && <Funds open={open} />}
    {policySlug && <section className="m-section m-policy"><p className="m-kicker">MUBSA FIN INSTITUTE</p><h1>{policy?.title || policySlug.replaceAll('-', ' ')}</h1><p>{policy?.body || (policySlug === 'risk-disclaimer' ? 'Trading and investing involve risk, including loss of capital. Mubsa provides educational information, not personalised investment advice. No course, research method, or webinar guarantees profit or future results.' : 'Please contact Mubsa Fin Institute for the current terms applicable to your course or enquiry. Confirm the schedule, fees, cancellation terms, and data-use details with the team before enrolling.')}</p><a href={`mailto:${email}`}>{email}</a></section>}
    {!isHome && !routeCourse && !policySlug && !['/courses','/services','/events','/about','/team','/testimonials','/faq','/contact','/booking','/mutual-funds'].includes(path) && <section className="m-section"><h1>Page not found.</h1><button className="m-btn" onClick={() => go('/')}>Back to home</button></section>}
    </main>
    <footer className="m-footer"><div><a className="m-brand" href="/"><span>M</span><div>MUBSA<small>FIN INSTITUTE</small></div></a><p>Mubsa Fin Institute offers learning paths from market fundamentals to advanced technical analysis. Study market concepts, practice reading charts, and develop your own process with an emphasis on discipline and risk awareness.</p><p>Market education from foundations to advanced analysis.</p><p>MubsaCapital.com · {content.contact.location}</p><a href={`mailto:${email}`}>{email}</a><a href={`tel:${phone.replace(/[^+0-9]/g,'')}`}>{phone}</a><SocialLinks /></div><div className="m-footer-links"><h3>Explore</h3>{navLink('Home','/')}{navLink('About us','/#about')}{navLink('Our courses','/courses')}{navLink('Meet the team','/#team')}{navLink('Events','/events')}</div><div className="m-footer-links"><h3>Legal</h3>{['risk-disclaimer','terms-and-conditions','privacy-policy','refund-policy'].map(slug => <span key={slug}>{navLink(slug.replaceAll('-',' '), `/policies/${slug}`)}</span>)}</div><div className="m-footer-links"><h3>Helpful links</h3>{navLink('FAQs','/faq')}{navLink('Feedback','/testimonials')}{navLink('Study guide','/#book')}{navLink('Contact us','/contact')}<button onClick={() => open({ type: 'welcome' })}>Show webinar registration</button></div><div className="m-footer-bottom">© {copyrightYear} Mubsa Fin Institute. Trading and investing involve risk, including possible loss of capital. Course content is educational and does not guarantee profits or replace financial advice based on individual circumstances.</div></footer>
    <SocialDock links={content.socialLinks} telegramUrl={data.telegramUrl} /><WhatsAppPanel url={whatsappUrl} /><BackToTop />
    {modal && <Modal title={modal.type === 'welcome' ? 'Webinar registration' : modal.title || modal.type} close={close} wide={['welcome','guide','image'].includes(modal.type)}>
      {['welcome','webinar'].includes(modal.type) && <div className={modal.type === 'welcome' ? 'm-webinar-welcome' : ''}>{modal.type === 'welcome' && <div className="m-webinar-mentor"><img src={founder} alt="Mubarak Ahmad" /><strong>Mubarak Ahmad</strong><p>Founder & Academic Director<br />Mubsa Fin Institute</p></div>}<div><WebinarPanel webinar={modal.webinar || webinar} content={content} whatsappUrl={whatsappUrl}><LeadForm key={(modal.webinar || webinar)?.id || 'next-webinar'} webinar={modal.webinar || webinar} webinarInterest subject="Next webinar updates" /></WebinarPanel></div></div>}
      {modal.type === 'guidance' && <><p className="m-kicker">COURSE GUIDANCE</p><h2>Not sure where to begin?</h2><p>Choose a course level and request a guidance session. Mubsa Fin Institute will confirm availability with you directly.</p><div className="m-guidance-options">{courses.map(course => <button className="m-card" key={course.slug} onClick={() => open({type:'enquiry',subject:course.name})}><strong>{course.name}</strong><span>{course.tagline}</span><FaArrowRight /></button>)}</div>{whatsappUrl && <a className="m-text" href={whatsappUrl} target="_blank" rel="noreferrer"><FaWhatsapp /> WhatsApp us</a>}</>}
      {modal.type === 'enquiry' && <><p className="m-kicker">LET’S TALK</p><h2>{modal.subject || 'Course enquiry'}</h2><LeadForm subject={modal.subject} /></>}
      {modal.type === 'image' && <figure className="m-lightbox"><img src={modal.item.image} alt={modal.item.title} /><figcaption>{modal.item.title} · {modal.item.city}</figcaption></figure>}
      {modal.type === 'guide' && <><p className="m-kicker">MUBSA STUDY GUIDE</p><h2>The market method.</h2>{guide.map(([t,p]) => <article className="m-guide-page" key={t}><h3>{t}</h3><p>{p}</p></article>)}</>}
      {modal.type === 'topic' && <><p className="m-kicker">ADVANCED LEARNING</p><h2>{modal.title}</h2><p>{modal.text} Explore this concept in context, test assumptions, and consider risk. It is a study tool, not a guarantee of future price movement.</p><button className="m-btn" onClick={() => { close(); go(`/courses/${courses.find(c => c.slug === 'advanced')?.slug || courses[courses.length-1].slug}`) }}>View advanced curriculum <FaArrowRight /></button></>}
      {modal.type === 'vision' && <><p className="m-kicker">OUR VISION</p><h2>Build understanding.<br />Then build your process.</h2><p>Our mission is to make market learning clearer and more accessible. We bring foundations, chart study, and risk planning into a progressive educational path for working professionals and dedicated learners.</p><button className="m-btn" onClick={() => { close(); go('/about') }}>Meet your mentor <FaArrowRight /></button></>}
      {modal.type === 'insight' && <><p className="m-kicker">FREE LEARNING INSIGHT</p><h2>Preparation before prediction.</h2><p>Begin with a timeframe, mark relevant price levels, and define what would invalidate your idea. Record the plan before looking for a result.</p>{content.videoUrl ? <a className="m-btn" href={content.videoUrl} target="_blank" rel="noreferrer">Watch the mentor’s video <FaPlay /></a> : <p>The next video insight will be announced here. You can explore the free study notes now.</p>}<button className="m-text" onClick={() => open({ type: 'guide' })}>Read free study notes <FaArrowRight /></button></>}
    </Modal>}
  </div></SiteContext.Provider>
}
