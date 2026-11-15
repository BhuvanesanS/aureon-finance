import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  FaWhatsapp,
  FaTelegram,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaXTwitter,
  FaSun,
  FaMoon,
  FaBars,
  FaXmark,
  FaArrowRight,
  FaChartLine,
  FaCompass,
  FaClock
} from 'react-icons/fa6'
import AdminDashboard from './AdminDashboard'
import { defaultContent as defaults } from './siteDefaults'
import './experience.css'
import { AnnouncementTicker, WebinarPanel } from './WebinarExperience'
import { SocialDock, BackToTop } from './ReferenceInteractions'
import TestimonialsShowcase from './TestimonialsShowcase'
import './reference-refinements.css'
import './motion.css'
import WebinarLanding from './WebinarLanding'
import { usePageMotion } from './usePageMotion'

const founder = '/client-founder.jpg'
const portrait = '/client-portrait.jpg'
const SiteContext = createContext({ content: defaults, whatsappUrl: '', telegramUrl: '' })

const indianStatesAndUTs = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
  'Dubai', 'UAE', 'Other'
]

const socialNetworks = [
  { label: 'Telegram', url: 'https://t.me/mubsafin', icon: FaTelegram },
  { label: 'Instagram', url: 'https://instagram.com/mubsafin', icon: FaInstagram },
  { label: 'YouTube', url: 'https://youtube.com/@mubsafin', icon: FaYoutube },
  { label: 'LinkedIn', url: 'https://linkedin.com/company/mubsafin', icon: FaLinkedinIn },
  { label: 'Facebook', url: 'https://facebook.com/mubsafin', icon: FaFacebookF },
  { label: 'X', url: 'https://x.com/mubsafin', icon: FaXTwitter }
]

export function Modal({ title, close, children, wide = false }) {
  const ref = useRef(null)
  useEffect(() => {
    const origin = document.activeElement
    const dialog = ref.current
    if (dialog && !dialog.open) {
      dialog.showModal()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = previous
      origin?.focus?.()
    }
  }, [])
  return (
    <dialog
      ref={ref}
      className={`m-dialog ${wide ? 'wide' : ''}`}
      aria-label={title}
      onCancel={e => {
        e.preventDefault()
        close()
      }}
      onClick={e => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div className="m-dialog-body">
        <button className="m-close" aria-label="Close popup" onClick={close}>
          <FaXmark />
        </button>
        {children}
      </div>
    </dialog>
  )
}

function SocialIcons({ links = [] }) {
  const { telegramUrl } = useContext(SiteContext)
  const items = socialNetworks.map(net => {
    if (net.label === 'Telegram' && telegramUrl) return { ...net, url: telegramUrl }
    const custom = links.find(l => l.label?.toLowerCase() === net.label.toLowerCase())
    return custom ? { ...net, url: custom.url } : net
  })
  return (
    <div className="m-social-icon-row" aria-label="Social media channels">
      {items.map(({ label, url, icon: Icon }) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="m-social-icon-btn"
          aria-label={label}
          title={label}
        >
          <Icon aria-hidden="true" />
        </a>
      ))}
    </div>
  )
}

function Heading({ eyebrow, title, text }) {
  return (
    <div className="m-heading">
      {eyebrow && <p className="m-kicker">{eyebrow}</p>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  )
}

function WebinarRegistrationForm({ webinar, onSuccess }) {
  const [status, setStatus] = useState({})
  async function submit(e) {
    e.preventDefault()
    const values = Object.fromEntries(new FormData(e.currentTarget))
    setStatus({ busy: true })
    try {
      const isLiveWebinar = Boolean(webinar?.id)
      const body = isLiveWebinar
        ? {
            name: values.fullName,
            email: values.email,
            phone: values.phone,
            state: values.state,
            profession: values.profession,
            webinarId: webinar.id,
            consent: true
          }
        : {
            fullName: values.fullName,
            email: values.email,
            phone: values.phone,
            state: values.state,
            city: values.state,
            profession: values.profession,
            kind: 'webinar-interest',
            course: 'Basic Course',
            message: `State / UT: ${values.state}\nProfession: ${values.profession}\nWebinar Registration`,
            consent: true
          }

      const response = await fetch(isLiveWebinar ? '/api/webinar-registrations' : '/api/booking-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await response.json()
      if (!response.ok) {
        setStatus({ error: data.message, errors: data.errors || {} })
        return
      }
      setStatus({ success: true, reference: data.reference })
      onSuccess?.()
    } catch {
      setStatus({ error: 'We could not connect. Your details are still here. Please retry or contact us by phone.' })
    }
  }

  if (status.success) {
    return (
      <div className="m-success" role="status">
        <h3>You’re registered.</h3>
        <p>Keep this reference. Contact the team if you need joining details.</p>
        <strong>{status.reference}</strong>
        <button className="m-btn secondary" onClick={() => setStatus({})}>
          Register another person
        </button>
      </div>
    )
  }

  const error = name => status.errors?.[name] && <small className="m-error">{status.errors[name]}</small>

  return (
    <form className="m-form" onSubmit={submit}>
      <div className="m-form-grid">
        <label>
          Full name
          <input name="fullName" autoComplete="name" minLength="2" maxLength="120" required placeholder="Your full name" />
          {error('name') || error('fullName')}
        </label>
        <label>
          Email address
          <input name="email" autoComplete="email" type="email" maxLength="254" required placeholder="you@example.com" />
          {error('email')}
        </label>
      </div>

      <label>
        WhatsApp
        <input name="phone" autoComplete="tel" type="tel" placeholder="Include country code, e.g. +91 99999 99999" minLength="7" maxLength="30" required />
        {error('phone')}
      </label>

      <div className="m-form-grid">
        <label>
          State & Union Territory
          <select name="state" defaultValue="" required>
            <option value="" disabled>Select your state / UT</option>
            {indianStatesAndUTs.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {error('city') || error('state')}
        </label>

        <label>
          Profession
          <select name="profession" defaultValue="" required>
            <option value="" disabled>Select profession</option>
            {['Student', 'Business owner', 'Salaried professional', 'Finance professional', 'Homemaker', 'Educator', 'Other'].map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {error('profession')}
        </label>
      </div>

      <label className="m-consent">
        <input type="checkbox" required name="consent" />
        I agree to be contacted about this webinar.
      </label>

      {status.error && <div className="m-error" role="alert">{status.error}</div>}

      <button className="m-btn" disabled={status.busy}>
        {status.busy ? 'Saving…' : 'Register now'} <FaArrowRight />
      </button>
    </form>
  )
}

function CourseGuidanceForm({ initialCourse = '', onSuccess }) {
  const [status, setStatus] = useState({})
  async function submit(e) {
    e.preventDefault()
    const values = Object.fromEntries(new FormData(e.currentTarget))
    setStatus({ busy: true })
    try {
      const messageBody = `Current Experience Level: ${values.experienceLevel || 'Not specified'}\nPreferred Contact Method: ${values.contactMethod || 'Email'}\n\nWhat Would You Like to Learn:\n${values.learnTopics || 'Not specified'}`
      const body = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        course: values.course || 'Basic Course',
        message: messageBody,
        consent: true
      }
      const response = await fetch('/api/booking-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await response.json()
      if (!response.ok) {
        setStatus({ error: data.message, errors: data.errors || {} })
        return
      }
      setStatus({ success: true, reference: data.reference })
      onSuccess?.()
    } catch {
      setStatus({ error: 'We could not connect. Your details are still here. Please retry or contact us by phone.' })
    }
  }

  if (status.success) {
    return (
      <div className="m-success" role="status">
        <h3>Your guidance request is received.</h3>
        <p>Our support team will typically respond within 24 hours during business days.</p>
        <strong>{status.reference}</strong>
        <button className="m-btn secondary" onClick={() => setStatus({})}>
          Submit another request
        </button>
      </div>
    )
  }

  const error = name => status.errors?.[name] && <small className="m-error">{status.errors[name]}</small>

  return (
    <div className="m-card">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Request course guidance</h2>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--m-muted)' }}>
          Share a few details and Mubsa Fin Institute will follow up with you.
        </p>
      </div>

      <form className="m-form" onSubmit={submit}>
        <div className="m-form-grid">
          <label>
            1. Full name
            <input name="fullName" autoComplete="name" minLength="2" maxLength="120" required placeholder="Your full name" />
            {error('fullName') || error('name')}
          </label>
          <label>
            2. Email Address
            <input name="email" autoComplete="email" type="email" maxLength="254" required placeholder="your.email@example.com" />
            {error('email')}
          </label>
        </div>

        <label>
          3. Contact Number (with country code)
          <input name="phone" autoComplete="tel" type="tel" placeholder="+91 99999 99999" minLength="7" maxLength="30" required />
          {error('phone')}
        </label>

        <div className="m-form-grid">
          <label>
            4. Current Experience Level
            <select name="experienceLevel" defaultValue="Beginner – New to financial markets" required>
              <option value="Beginner – New to financial markets">Beginner – New to financial markets</option>
              <option value="Basic Knowledge – Familiar with market fundamentals">Basic Knowledge – Familiar with market fundamentals</option>
              <option value="Intermediate – Have some trading or chart analysis experience">Intermediate – Have some trading or chart analysis experience</option>
              <option value="Experienced – Actively involved in trading or investing">Experienced – Actively involved in trading or investing</option>
            </select>
          </label>

          <label>
            5. Course of Interest
            <select name="course" defaultValue={initialCourse || 'Basic Course'} required>
              <option value="Basic Course">Basic Course</option>
              <option value="Intermediate Course">Intermediate Course</option>
              <option value="Advanced Course">Advanced Course</option>
              <option value="Not Sure – Need Course Guidance">Not Sure – Need Course Guidance</option>
            </select>
            {error('course')}
          </label>
        </div>

        <label>
          6. Preferred Contact Method
          <select name="contactMethod" defaultValue="Email" required>
            <option value="Email">Email</option>
            <option value="Phone Call">Phone Call</option>
            <option value="WhatsApp">WhatsApp</option>
          </select>
        </label>

        <label>
          7. What Would You Like to Learn? (Optional)
          <textarea
            name="learnTopics"
            rows="3"
            placeholder="Tell us about your current experience, learning interests, and the topics you'd like to explore."
            maxLength="2000"
          />
        </label>

        <label className="m-consent">
          <input type="checkbox" required name="consent" />
          I agree that Mubsa Fin Institute may contact me about this request.
        </label>

        {status.error && <div className="m-error" role="alert">{status.error}</div>}

        <button className="m-btn" disabled={status.busy} style={{ width: '100%' }}>
          {status.busy ? 'Submitting…' : 'Request a Guidance Session'} <FaArrowRight />
        </button>

        <p style={{ fontSize: '11px', color: 'var(--m-muted)', margin: '8px 0 0', lineHeight: '1.6' }}>
          This form is for enquiries only and does not confirm course enrolment or purchase. Our team will contact you with further details.
        </p>
      </form>
    </div>
  )
}

function ContactForm() {
  const [status, setStatus] = useState({})
  async function submit(e) {
    e.preventDefault()
    const values = Object.fromEntries(new FormData(e.currentTarget))
    setStatus({ busy: true })
    try {
      const body = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        course: values.course || 'Basic Course',
        message: values.message || '',
        consent: true
      }
      const response = await fetch('/api/booking-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await response.json()
      if (!response.ok) {
        setStatus({ error: data.message, errors: data.errors || {} })
        return
      }
      setStatus({ success: true, reference: data.reference })
    } catch {
      setStatus({ error: 'We could not connect. Your details are still here. Please retry or contact us by phone.' })
    }
  }

  if (status.success) {
    return (
      <div className="m-success" role="status">
        <h3>Your enquiry is saved.</h3>
        <p>The team will contact you using the details you provided.</p>
        <strong>{status.reference}</strong>
        <button className="m-btn secondary" onClick={() => setStatus({})}>
          Send another enquiry
        </button>
      </div>
    )
  }

  const error = name => status.errors?.[name] && <small className="m-error">{status.errors[name]}</small>

  return (
    <form className="m-form" onSubmit={submit}>
      <div className="m-form-grid">
        <label>
          Full name
          <input name="fullName" autoComplete="name" minLength="2" maxLength="120" required placeholder="Your full name" />
          {error('fullName') || error('name')}
        </label>
        <label>
          Email address
          <input name="email" autoComplete="email" type="email" maxLength="254" required placeholder="your.email@example.com" />
          {error('email')}
        </label>
      </div>
      <label>
        Phone / WhatsApp
        <input name="phone" autoComplete="tel" type="tel" placeholder="Include country code" minLength="7" maxLength="30" required />
        {error('phone')}
      </label>
      <label>
        Course of interest
        <select name="course" defaultValue="Basic Course">
          <option value="Basic Course">Basic Course</option>
          <option value="Intermediate Course">Intermediate Course</option>
          <option value="Advanced Course">Advanced Course</option>
          <option value="Other">Other</option>
        </select>
        {error('course')}
      </label>
      <label>
        Your message
        <textarea name="message" rows="3" maxLength="2000" placeholder="Write your message here…" />
      </label>
      <label className="m-consent">
        <input type="checkbox" required name="consent" />
        I agree that Mubsa Fin Institute may contact me about this enquiry.
      </label>
      {status.error && <div className="m-error" role="alert">{status.error}</div>}
      <button className="m-btn" disabled={status.busy}>
        {status.busy ? 'Saving…' : 'Send enquiry'} <FaArrowRight />
      </button>
    </form>
  )
}

function FAQ({ full = false }) {
  const { content } = useContext(SiteContext)
  const questions = content.faqs
  const [expanded, setExpanded] = useState(full)
  const displayed = full || expanded ? questions : questions.slice(0, 4)

  return (
    <section className="m-section" id="faq">
      <Heading eyebrow="HELP CENTER" title="Frequently asked questions" text="A little clarity before your next step." />
      <div className="m-faq">
        {displayed.map((faq, i) => (
          <details key={faq.question} open={i === 0}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
        {!full && questions.length > 4 && (
          <button className="m-text" onClick={() => setExpanded(!expanded)} style={{ marginTop: '20px' }}>
            {expanded ? 'Show fewer' : 'View more answers'} <FaArrowRight />
          </button>
        )}
      </div>
    </section>
  )
}

function Contact() {
  const { content, whatsappUrl } = useContext(SiteContext)
  const { location, email, phone } = content.contact
  return (
    <section className="m-section m-contact" id="contact">
      <div>
        <p className="m-kicker">Connect with us</p>
        <h2>Have a question about the courses or other queries?</h2>
        <p>Contact Mubsa Fin Institute</p>
        <dl>
          <dt>BASED IN</dt>
          <dd>{location}</dd>
          <dt>EMAIL US</dt>
          <dd><a href={`mailto:${email}`}>{email}</a></dd>
          <dt>WEBSITE</dt>
          <dd><a href="https://mubsafin.com" target="_blank" rel="noreferrer">mubsafin.com</a></dd>
          <dt>CALL US</dt>
          <dd><a href={`tel:${phone.replace(/[^+0-9]/g, '')}`}>{phone}</a></dd>
        </dl>
        {whatsappUrl && (
          <p style={{ marginTop: '20px' }}>
            <a className="m-text" href={whatsappUrl} target="_blank" rel="noreferrer">
              <FaWhatsapp /> Chat on WhatsApp
            </a>
          </p>
        )}
        <div style={{ marginTop: '24px' }}>
          <SocialIcons links={content.socialLinks} />
        </div>
      </div>
      <ContactForm />
    </section>
  )
}

export default function MubsaExperience() {
  const [path, setPath] = useState(window.location.pathname)
  const [anchor, setAnchor] = useState(window.location.hash)
  const [menu, setMenu] = useState(false)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('mubsa-theme') || 'dark'
    } catch {
      return 'dark'
    }
  })
  const [data, setData] = useState({ content: defaults, slides: [] })
  const [loaded, setLoaded] = useState(false)
  const [offline, setOffline] = useState(false)
  const [modal, setModal] = useState(null)
  const [copyrightYear] = useState(() => new Date().getFullYear())
  const seen = useRef(false)

  usePageMotion(path)
  const content = { ...defaults, ...data.content }
  const courses = content.courses
  const { phone, email } = content.contact
  const whatsappUrl = data.whatsappUrl || `https://wa.me/${phone.replace(/\D/g, '')}`
  const telegramUrl = data.telegramUrl || 'https://t.me/mubsafin'

  const go = (url) => {
    window.history.pushState({}, '', url)
    setPath(url.split('#')[0] || '/')
    setAnchor(window.location.hash)
    setMenu(false)
    if (url.includes('#')) {
      setTimeout(() => document.getElementById(url.split('#')[1])?.scrollIntoView(), 0)
    } else {
      window.scrollTo(0, 0)
    }
  }

  const openTelegram = () => {
    window.open(telegramUrl, '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    const pop = () => {
      setPath(location.pathname)
      setAnchor(location.hash)
      setMenu(false)
    }
    window.addEventListener('popstate', pop)
    window.addEventListener('hashchange', pop)
    return () => {
      window.removeEventListener('popstate', pop)
      window.removeEventListener('hashchange', pop)
    }
  }, [])

  useEffect(() => {
    const dismiss = e => {
      if (!e.target.closest('.m-header')) {
        setMenu(false)
      }
    }
    const escape = e => {
      if (e.key === 'Escape') {
        setMenu(false)
      }
    }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', escape)
    }
  }, [])

  useEffect(() => {
    const titles = {
      '/': 'Home',
      '/about': 'About',
      '/founder': 'Founder',
      '/courses': 'Courses',
      '/enquire': 'Course Guidance',
      '/testimonials': 'Voices of Mubsa Family',
      '/faq': 'FAQs',
      '/contact': 'Contact',
      '/webinar': 'Market DNA'
    }
    const label = path.startsWith('/courses/')
      ? courses.find(c => path === `/courses/${c.slug}`)?.name
      : titles[path]
    document.title = label ? `${label} | Mubsa Fin Institute` : 'Mubsa Fin Institute° — We Grow Together'
  }, [path, courses])

  useEffect(() => {
    if (anchor) requestAnimationFrame(() => document.getElementById(anchor.slice(1))?.scrollIntoView())
  }, [path, anchor])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('mubsa-theme', theme)
    } catch {}
  }, [theme])

  useEffect(() => {
    if (path === '/admin') return
    let active = true
    const refresh = async () => {
      try {
        const res = await fetch('/api/site-content')
        if (!res.ok) throw Error()
        const result = await res.json()
        if (active) {
          setData(result)
          setOffline(false)
        }
      } catch {
        if (active) setOffline(true)
      } finally {
        if (active) setLoaded(true)
      }
    }
    refresh()
    const timer = setInterval(refresh, 30000)
    return () => {
      active = false
      clearInterval(timer)
    }
  }, [path])

  useEffect(() => {
    if (!loaded || path !== '/' || seen.current || modal || !content.popupEnabled) return
    let dismissed = false
    try {
      dismissed = sessionStorage.getItem('mubsa-welcome') === 'seen'
    } catch {}
    if (dismissed) return
    const timer = setTimeout(() => {
      seen.current = true
      try {
        sessionStorage.setItem('mubsa-welcome', 'seen')
      } catch {}
      setModal({ type: 'welcome' })
    }, content.popupDelay * 1000)
    return () => clearTimeout(timer)
  }, [loaded, path, modal, content.popupEnabled, content.popupDelay])

  const close = () => {
    if (modal?.type === 'welcome') {
      try {
        sessionStorage.setItem('mubsa-welcome', 'seen')
      } catch {}
    }
    setModal(null)
  }

  const open = value => {
    seen.current = true
    setModal(value)
  }

  if (path === '/admin' || path === '/login') return <AdminDashboard />

  const webinar = data.webinar
  const routeCourse = courses.find(c => path === `/courses/${c.slug}`)
  const isHome = path === '/'
  const policySlug = path.startsWith('/policies/') ? path.split('/').pop() : ''
  const policy = content.policies.find(x => x.slug === policySlug)

  const navLink = (label, href) => (
    <a
      href={href}
      aria-current={path === href ? 'page' : undefined}
      onClick={e => {
        if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
          e.preventDefault()
          go(href)
        }
      }}
    >
      {label}
    </a>
  )

  return (
    <SiteContext.Provider value={{ ...data, content, whatsappUrl, telegramUrl }}>
      <div className={`mubsa-site ${path === '/webinar' ? 'm-webinar-page' : ''}`}>
        <a className="m-skip" href="#main-content">
          Skip to content
        </a>

        {path !== '/webinar' && (
          <>
            <header className="m-header">
              <a
                href="/"
                className="m-brand"
                onClick={e => {
                  e.preventDefault()
                  go('/')
                }}
              >
                <img
                  src="/mubsa-logo.jpg"
                  alt="Mubsa Fin Institute° — We Grow Together"
                  className="m-brand-img"
                />
                <div className="m-brand-title">
                  <strong>Mubsa Fin Institute°</strong>
                  <small>We Grow Together</small>
                </div>
              </a>

              <button
                className="m-mobile"
                aria-label="Toggle navigation"
                aria-expanded={menu}
                onClick={() => setMenu(!menu)}
              >
                {menu ? <FaXmark /> : <FaBars />}
              </button>

              <nav className={menu ? 'open' : ''} aria-label="Main navigation">
                {navLink('Home', '/')}
                {navLink('About', '/about')}
                {navLink('Founder', '/founder')}
                {navLink('Course', '/courses')}
                {navLink('Enquire', '/enquire')}
                {navLink('Testimonials', '/testimonials')}
                {navLink('FAQs', '/faq')}
                {navLink('Contact', '/contact')}
                <div className="m-mobile-links">
                  <button className="m-btn small" onClick={openTelegram}>
                    MUBSA MAGIC <FaArrowRight />
                  </button>
                </div>
              </nav>

              <div className="m-header-actions">
                <button
                  className="m-icon"
                  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </button>
                <button className="m-btn small" onClick={openTelegram}>
                  MUBSA MAGIC <FaArrowRight />
                </button>
              </div>
            </header>

            {offline && (
              <div className="m-offline" role="status">
                The online services are unavailable. Please retry shortly or call {phone}.
              </div>
            )}

            <AnnouncementTicker
              webinar={webinar}
              telegramUrl={telegramUrl}
              community={openTelegram}
              register={() => go('/webinar')}
              slides={data.slides || []}
            />
          </>
        )}

        <main id="main-content" key={path} className="m-page-transition">
          {path === '/webinar' && (
            <WebinarLanding
              webinar={webinar}
              content={content}
              register={() => open({ type: 'webinar' })}
            />
          )}

          {/* HOME PAGE */}
          {isHome && (
            <>
              {/* Hero Banner */}
              <section className="m-hero">
                <div className="m-hero-copy">
                  <p className="m-kicker">MARKET INTELLIGENCE · STRATEGIC ANALYSIS · RISK DISCIPLINE</p>
                  <h1>
                    Don't just follow the market.<br />
                    <em>Learn to read it.</em>
                  </h1>
                  <p>
                    At Mubsa Fin Institute, we provide structured market education, practical chart analysis, and focused learning in trading strategies, risk management and learn to approach every trade with a clear strategy and disciplined mind set.
                  </p>
                  <div className="m-actions m-hero-actions">
                    <button className="m-btn" onClick={() => go('/webinar')}>
                      Join MARKET DNA <FaArrowRight />
                    </button>
                    <button className="m-btn secondary" onClick={() => go('/courses')}>
                      Explore Courses <FaArrowRight />
                    </button>
                    <button className="m-btn secondary" onClick={openTelegram}>
                      <FaTelegram /> The 5% Club
                    </button>
                  </div>
                </div>

                <div className="m-hero-image">
                  <img
                    src={founder}
                    alt="Mubarak Ahmad, Founder & Academic Director"
                    fetchPriority="high"
                    width="960"
                    height="1440"
                  />
                  <div className="m-mentor-label">
                    <small>YOUR MENTOR</small>
                    <strong>Mubarak Ahmad</strong>
                    <span>Founder & Academic Director</span>
                  </div>
                </div>
              </section>

              {/* Highlight strip */}
              <div className="m-highlight-banner">
                <strong>BUILD YOUR EDGE — LEARN · APPLY · EVOLVE</strong>
              </div>

              {/* Learn the language of market */}
              <section className="m-section" id="about-intro">
                <div style={{ maxWidth: '840px' }}>
                  <p className="m-kicker">LEARN THE LANGUAGE OF MARKET</p>
                  <h2>Discover the mechanics of the markets</h2>
                  <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    From foundational concepts to advanced analytical methodologies, explore structured programmes covering technical analysis, trading strategies, market behaviour, and risk management. Gain the knowledge, strengthen your market understanding and shape your own strategy.
                  </p>
                  <div style={{ marginTop: '28px' }}>
                    <button className="m-btn" onClick={() => go('/courses')}>
                      Explore the Curriculum <FaArrowRight />
                    </button>
                  </div>
                </div>
              </section>

              {/* The Four Pillars of Trading */}
              <section className="m-section m-tone" id="learning-process">
                <div className="m-heading">
                  <p className="m-kicker">THE FOUR PILLARS OF TRADING</p>
                  <h2>Plan · Protect · Control · Review.</h2>
                  <p>Follow these four principles to trade with clarity, discipline, and responsibility.</p>
                </div>
                <div className="m-pillars-grid">
                  <div className="m-pillar-card">
                    <span className="m-pillar-num">PILLAR 01</span>
                    <h3>Plan</h3>
                    <p>
                      A clear trading strategy provides direction and purpose to every trade. Define your entry, exit, and trading conditions before entering.
                    </p>
                  </div>
                  <div className="m-pillar-card">
                    <span className="m-pillar-num">PILLAR 02</span>
                    <h3>Protect</h3>
                    <p>
                      Preserving capital is essential for long-term participation in the markets. Set your stop-loss and calculate your risk before every trade.
                    </p>
                  </div>
                  <div className="m-pillar-card">
                    <span className="m-pillar-num">PILLAR 03</span>
                    <h3>Control</h3>
                    <p>
                      Emotional discipline helps maintain consistency during market fluctuations. Avoid impulsive decisions and follow your trading plan.
                    </p>
                  </div>
                  <div className="m-pillar-card">
                    <span className="m-pillar-num">PILLAR 04</span>
                    <h3>Review</h3>
                    <p>
                      Continuous evaluation helps identify mistakes and strengthen your approach. Record every trade, analyse your results, and learn from each outcome.
                    </p>
                  </div>
                </div>
              </section>

              {/* The Knowledge Map */}
              <section className="m-section" id="services">
                <div className="m-heading">
                  <p className="m-kicker">THE KNOWLEDGE MAP</p>
                  <h2>Inside Our Curriculum</h2>
                  <p>From Market Fundamentals to Advanced Analysis. Learn with purpose. Progress with knowledge.</p>
                </div>
                <div className="m-course-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
                  {courses.map((c, i) => (
                    <article className="m-card m-course-link" key={c.slug} style={{ display: 'flex', flexDirection: 'column' }}>
                      {[<FaCompass key="a" />, <FaChartLine key="b" />, <FaClock key="c" />][i % 3]}
                      <h3>{c.name}</h3>
                      <p>{c.description}</p>
                      <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                        <button className="m-btn small" onClick={() => go(`/courses/${c.slug}`)}>
                          {c.ctaLabel || `Explore the ${c.name}`} <FaArrowRight />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="m-center" style={{ marginTop: '40px', textAlign: 'center' }}>
                  <button className="m-btn secondary" onClick={() => go('/enquire')}>
                    Help me choose a course
                  </button>
                </div>
              </section>

              {/* Choice & Where Should I Start */}
              <section className="m-section m-intro m-tone">
                <div>
                  <h2>Let's Make the Right Choice</h2>
                  <p>
                    Begin with the foundations, build your analytical skills, or explore advanced methods. Choose the level that fits what you have studied so far.
                  </p>
                </div>
                <div>
                  <h2>Where should I start?</h2>
                  <p>
                    Not sure which level suits you? Request a guidance session, our team will confirm availability and guide in selecting the right programme for you.
                  </p>
                  <div className="m-actions">
                    <button className="m-btn" onClick={() => go('/enquire')}>
                      Request Course Guidance <FaArrowRight />
                    </button>
                  </div>
                </div>
              </section>

              {/* Voices of Mubsa Family (Testimonials) */}
              <section className="m-section" id="testimonials">
                <Heading
                  eyebrow="Voices of Mubsa Family"
                  title="People from different paths, learning with purpose."
                  text="“Real experiences from our aspiring traders who are developing their market knowledge through practical education.”"
                />
                <TestimonialsShowcase items={content.testimonials} go={go} />
              </section>

              {/* Community Banner */}
              <section className="m-community">
                <FaTelegram />
                <div>
                  <h2>WE GROW TOGETHER.</h2>
                  <p>Be part of our growing community. Join our public Telegram channel to stay connected.</p>
                </div>
                <button className="m-btn" onClick={openTelegram}>
                  Join our 5% CLUB <FaArrowRight />
                </button>
              </section>

              {/* FAQs Preview */}
              <FAQ full={false} />

              {/* Contact */}
              <Contact />
            </>
          )}

          {/* ABOUT PAGE */}
          {path === '/about' && (
            <div className="m-page">
              <section className="m-section m-team">
                <div className="m-team-image">
                  <img src={portrait} alt="Mubarak Ahmad" width="912" height="1136" loading="lazy" />
                </div>
                <div>
                  <h2>Mubarak Ahmad.</h2>
                  <p className="m-gold">Founder & Academic Director</p>
                  <p>
                    Mubsa Fin Institute provides market education from the foundations to advanced analysis. Founder and Academic Director Mubarak Ahmad is a share-market educator based in Dubai. His mission is to help at least one million middle-class people move forward through proper trading and investment education.
                  </p>
                  <p>
                    His market journey includes five years of learning, four years of trading experience, and two years of teaching experience. He has completed basic, intermediate, and advanced training in Dubai through programmes carrying KHDA certification, and has attended more than 100 webinars and courses across the UAE, India, Malaysia, the United States, and the United Kingdom.
                  </p>
                  <p>
                    His teaching approach puts preparation, a focused market window, patience, selective entries, and planned exits ahead of watching the market all day. The aim is to make market learning more structured for working professionals and full-time traders. Trading remains risky; no method can guarantee income or results.
                  </p>
                  <blockquote>“The greatest investment begins with investing in knowledge.”</blockquote>
                  <button className="m-btn secondary" onClick={() => go('/founder')}>
                    EXPLORE THE STORY <FaArrowRight />
                  </button>
                </div>
              </section>

              {/* Vision and Mission */}
              <section className="m-section m-tone">
                <div className="m-heading">
                  <p className="m-kicker">OUR PURPOSE</p>
                  <h2>Clear vision. Meaningful mission.</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginTop: '36px' }}>
                  <div className="m-card">
                    <p className="m-kicker">PURPOSE</p>
                    <h3>OUR VISION</h3>
                    <p style={{ marginTop: '16px', lineHeight: '1.8' }}>
                      To shape a generation of knowledgeable and disciplined traders and investors who understand market behaviour, think independently, identify opportunities through informed analysis, and approach financial markets with confidence and responsibility.
                    </p>
                  </div>
                  <div className="m-card">
                    <p className="m-kicker">COMMITMENT</p>
                    <h3>OUR MISSION</h3>
                    <p style={{ marginTop: '16px', lineHeight: '1.8' }}>
                      To empower at least one million middle-class individuals through accessible and quality trading and investment education, equipping them with the knowledge and skills to navigate financial markets responsibly.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* FOUNDER PAGE */}
          {(path === '/founder' || path === '/team') && (
            <div className="m-page">
              <section className="m-section m-team">
                <div className="m-team-image">
                  <img src={portrait} alt="Mubarak Ahmad" width="912" height="1136" loading="lazy" />
                </div>
                <div>
                  <p className="m-kicker">FOUNDER & ACADEMIC DIRECTOR</p>
                  <h2>Mubarak Ahmad.</h2>
                  <p className="m-gold">Founder & Academic Director</p>
                  <p>
                    Mubsa Fin Institute provides market education from the foundations to advanced analysis. Founder and Academic Director Mubarak Ahmad is a share-market educator based in Dubai. His mission is to help at least one million middle-class people move forward through proper trading and investment education.
                  </p>
                  <p>
                    His market journey includes five years of learning, four years of trading experience, and two years of teaching experience. He has completed basic, intermediate, and advanced training in Dubai through programmes carrying KHDA certification, and has attended more than 100 webinars and courses across the UAE, India, Malaysia, the United States, and the United Kingdom.
                  </p>
                  <p>
                    His teaching approach puts preparation, a focused market window, patience, selective entries, and planned exits ahead of watching the market all day. The aim is to make market learning more structured for working professionals and full-time traders. Trading remains risky; no method can guarantee income or results.
                  </p>
                  <blockquote>“The greatest investment begins with investing in knowledge.”</blockquote>
                </div>
              </section>

              {/* Security Systems Experience */}
              <section className="m-section m-tone">
                <div style={{ maxWidth: '860px' }}>
                  <p className="m-kicker">SECURITY SYSTEMS EXPERIENCE</p>
                  <h2>Engineering expertise, kept in its own lane.</h2>
                  <p style={{ fontSize: '15px', lineHeight: '1.8', marginTop: '20px' }}>
                    Alongside his market education work, Mubarak Ahmad is a senior security systems engineer with more than 12 years of experience in the UAE and India. At Hikvision MEA, he supports technical delivery and training across the UAE and Oman, with a focus on AI-enabled security, CCTV, and ELV systems.
                  </p>
                  <p style={{ fontSize: '15px', lineHeight: '1.8' }}>
                    His engineering work includes system planning, configuration, implementation support, troubleshooting, and user training. His profile records more than 150 product and user training sessions and a technical-support community of more than 600 MEA engineers that has resolved over 4,000 cases.
                  </p>
                </div>
              </section>

              {/* Stats / Experience numbers */}
              <section className="m-section">
                <div className="m-heading">
                  <p className="m-kicker">PRACTICAL BACKGROUND</p>
                  <h2>EXPERIENCE BUILT THROUGH LEARNING, PRACTICE & EDUCATION</h2>
                </div>
                <div className="m-stats-grid">
                  <div className="m-stat-card">
                    <strong>5+</strong>
                    <span>Years of Market Education</span>
                  </div>
                  <div className="m-stat-card">
                    <strong>4+</strong>
                    <span>Years of Active Market Experience</span>
                  </div>
                  <div className="m-stat-card">
                    <strong>2+</strong>
                    <span>Years of Trading Education</span>
                  </div>
                  <div className="m-stat-card">
                    <strong>100+</strong>
                    <span>Learning Sessions & Industry Webinars</span>
                  </div>
                  <div className="m-stat-card">
                    <strong>100%</strong>
                    <span>Rule-Based Trading Framework</span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* COURSES DIRECTORY */}
          {(path === '/courses' || path === '/services') && (
            <div className="m-page">
              <section className="m-section m-tone">
                <div className="m-heading">
                  <h2>Inside Our Curriculum</h2>
                  <p>From Market Fundamentals to Advanced Analysis. Learn with purpose. Progress with knowledge.</p>
                </div>
                <div className="m-course-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', marginTop: '40px' }}>
                  {courses.map((c, i) => (
                    <article className="m-card m-course-link" key={c.slug} style={{ display: 'flex', flexDirection: 'column' }}>
                      {[<FaCompass key="a" />, <FaChartLine key="b" />, <FaClock key="c" />][i % 3]}
                      <h3>{c.name}</h3>
                      <p>{c.description}</p>
                      <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                        <button className="m-btn small" onClick={() => go(`/courses/${c.slug}`)}>
                          {c.ctaLabel || `Explore the ${c.name}`} <FaArrowRight />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="m-center" style={{ marginTop: '48px', textAlign: 'center' }}>
                  <button className="m-btn secondary" onClick={() => go('/enquire')}>
                    Help me choose a course
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* COURSE DETAIL PAGE */}
          {routeCourse && (
            <section className="m-section">
              <h1>{routeCourse.name}</h1>
              <p className="m-lead" style={{ fontSize: '18px', lineHeight: '1.8', margin: '24px 0 32px' }}>
                {routeCourse.intro || routeCourse.description}
              </p>
              <button
                className="m-btn"
                onClick={() => go(`/enquire?course=${encodeURIComponent(routeCourse.name)}`)}
              >
                Enquire about this course <FaArrowRight />
              </button>
              <div className="m-modules">
                {routeCourse.modules.map(([title, desc, items], i) => (
                  <details key={title} open={i === 0}>
                    <summary>
                      <small>MODULE {i + 1}</small>
                      {title}
                    </summary>
                    <p>{desc}</p>
                    {items && items.length > 0 && (
                      <ul>
                        {items.map(x => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    )}
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* ENQUIRE PAGE */}
          {path === '/enquire' && (
            <div className="m-page">
              <section className="m-section m-tone">
                <div className="m-heading">
                  <p className="m-kicker">COURSE GUIDANCE</p>
                  <h1>Feeling stuck on choosing?</h1>
                  <p>Choose the course level you are considering and share what you would like to study. Mubsa Fin Institute will contact you to confirm availability.</p>
                </div>

                <div style={{ marginTop: '48px' }}>
                  <h3>Let us Guide you</h3>
                  <div className="m-steps-grid">
                    <div className="m-step-card">
                      <strong>STEP 01</strong>
                      <p>Fill the form as per your requirement</p>
                    </div>
                    <div className="m-step-card">
                      <strong>STEP 02</strong>
                      <p>Once you’ve submitted, Our support team will typically responds within 24 hours during business days.</p>
                    </div>
                    <div className="m-step-card">
                      <strong>STEP 03</strong>
                      <p>Submission of this form does not guarantee enrolment on the course.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="m-section">
                <div style={{ maxWidth: '820px', margin: '0 auto' }}>
                  <CourseGuidanceForm
                    initialCourse={new URLSearchParams(window.location.search).get('course') || ''}
                  />
                </div>
              </section>
            </div>
          )}

          {/* TESTIMONIALS PAGE */}
          {path === '/testimonials' && (
            <div className="m-page">
              <section className="m-section m-tone" id="testimonials">
                <Heading
                  eyebrow="Voices of Mubsa Family"
                  title="People from different paths, learning with purpose."
                  text="“Real experiences from our aspiring traders who are developing their market knowledge through practical education.”"
                />
                <TestimonialsShowcase items={content.testimonials} go={go} />
              </section>
            </div>
          )}

          {/* FAQ PAGE */}
          {path === '/faq' && <FAQ full={true} />}

          {/* CONTACT PAGE */}
          {path === '/contact' && <Contact />}

          {/* POLICY PAGES */}
          {policySlug && (
            <section className="m-section m-policy">
              <p className="m-kicker">MUBSA FIN INSTITUTE</p>
              <h1>{policy?.title || policySlug.replaceAll('-', ' ')}</h1>
              <p>
                {policy?.body ||
                  (policySlug === 'risk-disclaimer'
                    ? 'Trading and investing involve risk, including loss of capital. Mubsa provides educational information, not personalised investment advice. No course, research method, or webinar guarantees profit or future results.'
                    : 'Please contact Mubsa Fin Institute for the current terms applicable to your course or enquiry. Confirm the schedule, fees, cancellation terms, and data-use details with the team before enrolling.')}
              </p>
              <a href={`mailto:${email}`}>{email}</a>
            </section>
          )}

          {/* 404 CATCH-ALL */}
          {!isHome &&
            !routeCourse &&
            !policySlug &&
            ![
              '/courses',
              '/services',
              '/events',
              '/about',
              '/founder',
              '/team',
              '/testimonials',
              '/faq',
              '/contact',
              '/enquire',
              '/webinar'
            ].includes(path) && (
              <section className="m-section">
                <h1>Page not found.</h1>
                <button className="m-btn" onClick={() => go('/')}>
                  Back to home
                </button>
              </section>
            )}
        </main>

        <footer className="m-footer">
          <div>
            <a
              className="m-brand"
              href="/"
              onClick={e => {
                e.preventDefault()
                go('/')
              }}
            >
              <img
                src="/mubsa-logo.jpg"
                alt="Mubsa Fin Institute° — We Grow Together"
                className="m-brand-img"
              />
              <div className="m-brand-title">
                <strong>Mubsa Fin Institute°</strong>
                <small>We Grow Together</small>
              </div>
            </a>
            <p>
              Build your market understanding through a structured, time-conscious approach. Mubsa Fin Institute helps learners study markets, charts, and risk with purpose.
            </p>
            <p>MubsaCapital.com · {content.contact.location}</p>
            <p>
              Website :{' '}
              <a
                href="https://mubsafin.com"
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline', color: 'var(--m-gold)' }}
              >
                mubsafin.com
              </a>
            </p>
            <a href={`mailto:${email}`}>{email}</a>
            <a href={`tel:${phone.replace(/[^+0-9]/g, '')}`}>{phone}</a>
            <SocialIcons links={content.socialLinks} />
          </div>

          <div className="m-footer-links">
            <h3>Explore</h3>
            {navLink('Home', '/')}
            {navLink('About', '/about')}
            {navLink('Founder', '/founder')}
            {navLink('Courses', '/courses')}
            {navLink('Testimonials', '/testimonials')}
          </div>

          <div className="m-footer-links">
            <h3>Legal</h3>
            {['risk-disclaimer', 'terms-and-conditions', 'privacy-policy', 'refund-policy'].map(slug => (
              <span key={slug}>{navLink(slug.replaceAll('-', ' '), `/policies/${slug}`)}</span>
            ))}
          </div>

          <div className="m-footer-links">
            <h3>Helpful links</h3>
            {navLink('Enquire', '/enquire')}
            {navLink('Contact', '/contact')}
            {navLink('FAQs', '/faq')}
          </div>

          <div className="m-footer-bottom">
            © {copyrightYear} Mubsa Fin Institute. Trading and investing involve risk, including possible loss of capital. Course content is educational and does not guarantee profits or replace financial advice based on individual circumstances.
          </div>
        </footer>

        <SocialDock links={content.socialLinks} telegramUrl={telegramUrl} />
        <BackToTop />

        {modal && (
          <Modal
            title={modal.type === 'welcome' ? 'Webinar registration' : modal.title || modal.type}
            close={close}
            wide={['welcome', 'webinar', 'guidance'].includes(modal.type)}
          >
            {['welcome', 'webinar'].includes(modal.type) && (
              <div className={modal.type === 'welcome' ? 'm-webinar-welcome' : ''}>
                {modal.type === 'welcome' && (
                  <div className="m-webinar-mentor">
                    <img src={founder} alt="Mubarak Ahmad" />
                    <strong>Mubarak Ahmad</strong>
                    <p>Founder & Academic Director<br />Mubsa Fin Institute</p>
                  </div>
                )}
                <div>
                  <WebinarPanel webinar={modal.webinar || webinar} content={content} whatsappUrl={whatsappUrl}>
                    <WebinarRegistrationForm webinar={modal.webinar || webinar} onSuccess={close} />
                  </WebinarPanel>
                </div>
              </div>
            )}

            {modal.type === 'guidance' && (
              <CourseGuidanceForm initialCourse={modal.subject || ''} onSuccess={close} />
            )}
          </Modal>
        )}
      </div>
    </SiteContext.Provider>
  )
}
