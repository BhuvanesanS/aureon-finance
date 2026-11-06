import { useEffect, useState } from 'react'
import './App.css'
import './pages.css'
import logoMark from './assets/mubsa-mark.svg'
import heroImage from './assets/mubsa-market-learning-hero.png'
import workshopImage from './assets/mubsa-workshop-learning.png'
import AdminDashboard from './AdminDashboard.jsx'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaXTwitter, FaYoutube } from 'react-icons/fa6'

const site = { name: 'Mubsa Fin Institute', shortName: 'Mubsa Fin Institute', descriptor: 'MARKET EDUCATION', email: 'askme@mubsacapital.com', phone: '+91 9983 67 9983', locations: 'Dubai · India' }
const courses = [
  { slug: 'basic', number: '01', name: 'Basic Course', tagline: 'Learn the language of markets and charts', description: 'Start with market fundamentals, trading terminology, Trading Charts, candlesticks, market structure, trends, and chart levels.', intro: 'Build your understanding from the ground up. This course introduces share, forex, and commodity markets, essential trading terms, chart tools, candlestick reading, and the basic structure of price movement. It is designed for learners who want a clearer starting point before studying more advanced chart concepts.', focusTitle: 'Build a base you can keep using', focus: 'The Basic Course introduces the language and tools used throughout the rest of the learning path. Students practice reading charts and identifying market structure so they can approach more advanced topics with a stronger foundation.', modules: [
    ['Understanding markets and instruments', 'Get an introduction to the markets covered in the course and the people who take part in them.', ['What the share market is and how it works', 'Forex market basics and why currencies move', 'Investor and trader roles', 'Long-term and short-term approaches', 'Differences between stocks, forex, and commodities', 'Major forex participants, including banks, institutions, retail traders, and liquidity providers', 'Currency pairs, including majors, minors, and exotics', 'Base and quote currencies', 'Introductory pip concepts']],
    ['Trading terminology and chart tools', 'Become familiar with terms used in trading and learn your way around Trading Charts.', ['Spread, leverage, and margin', 'Lot size, bid, and ask', 'Swap', 'Chart layouts and timeframes', 'Drawing tools', 'Watch lists']],
    ['Candlesticks and price behavior', 'Learn the parts of a candlestick and consider what its shape may communicate about activity between buyers and sellers.', ['Candle types', 'Candle bodies and wicks', 'Basic candle psychology', 'Reading candle information in context', 'How buyers and sellers may be represented in price movement']],
    ['Market structure and trends', 'Study how price swings are organized and how traders describe common market conditions.', ['Higher highs and higher lows', 'Lower highs and lower lows', 'Introductory break of structure and change of character concepts', 'Uptrends, downtrends, and ranges', 'Basic trend rules']],
    ['Support, resistance, and chart patterns', 'Learn to identify areas and formations traders commonly use when studying charts, while recognizing that patterns can fail.', ['Support and resistance', 'Supply and demand areas', 'Key price levels', 'Basic chart patterns', 'Common pattern failure conditions']],
  ] },
  { slug: 'intermediate', number: '02', name: 'Intermediate Course', tagline: 'Develop your chart analysis and trade planning', description: 'Study liquidity, Smart Money concepts, Fibonacci, harmonic patterns, news awareness, trade planning, and risk management.', intro: 'Build on your market foundations with a deeper study of price action and technical concepts. Explore liquidity, Smart Money concepts, Fibonacci, harmonic patterns, news awareness, and risk planning. This course also introduces separate frameworks for investment, intraday trading, and swing trading.', focusTitle: 'Make analysis part of a plan', focus: 'The Intermediate Course brings chart concepts together with trade planning and risk awareness. Students study methods for analyzing potential setups and practice defining the conditions, risk, and possible outcomes they want to consider.', modules: [
    ['Liquidity and price areas', 'Study how traders identify areas of potential buying and selling interest and how price may interact with those areas.', ['Liquidity concepts', 'Equal highs and equal lows', 'Liquidity pools', 'Stop hunts', 'Premium and discount areas', 'Fair value concepts']],
    ['Order blocks and fair value gaps', 'Explore selected Smart Money concepts and how they are used in chart analysis.', ['Order blocks and entry logic', 'Breaker blocks and why an order block may fail', 'Fair value gaps (FVG)', 'Inverse fair value gaps (IFVG)']],
    ['Fibonacci tools', 'Learn how Fibonacci measurements can be applied when studying price retracements and extensions.', ['Fibonacci retracement', 'Fibonacci extension', 'Practical chart application']],
    ['Harmonic pattern models', 'Study structured price patterns and practice mapping possible entry, stop-loss, and target areas.', ['ABCD pattern', 'XABCD pattern', 'Entry planning', 'Stop-loss planning', 'Potential target planning']],
    ['News and market awareness', 'Consider how scheduled news and economic announcements may affect market conditions and why some traders may choose to avoid trading around certain events.', ['Identifying news that may matter to markets', 'Considering possible market impact', 'Planning for or avoiding high-impact announcements']],
    ['Risk and Money Management', 'Learn how to manage trading risk, protect your capital, and make informed decisions before entering a trade. Develop a disciplined approach to risk management and understand the importance of planning every trade.', ['Risk Percentage: Understand how much capital to risk on each trade.', 'Position Sizing: Learn how to determine an appropriate trade size based on your risk.', 'Stop-Loss Strategy: Understand how to set stop-loss levels to manage potential losses.', 'Risk-to-Reward Planning: Learn to evaluate potential risk against potential returns before entering a trade.']],
    ['Three trading frameworks', 'Compare three approaches with different holding periods and planning needs.', ['Investment framework for longer-term planning', 'Intraday framework for same-day trade planning', 'Swing framework for trades that may be held over a period of weeks']],
    ['Introduction to the US Stock Market', 'Understand the basics of the US stock market, its major trading sessions, key market instruments, and selected trading setups.', ['US Stock Market Fundamentals — Introduction to how the US stock market works.', 'Trading Market Sessions — Understanding the Sydney, Tokyo (Asian), London, and New York sessions.', 'Key US Market Instruments — Introduction to major US stocks and market indices.', 'Market Opening and Closing Times — Understanding US market hours and their significance.', 'Selected Trading Setups — Introduction to trading setups used in market analysis.']],
  ] },
  { slug: 'advanced', number: '03', name: 'Advanced Course', tagline: 'Explore advanced methods of market analysis', description: 'Explore advanced analytical methods, including Elliott Wave analysis, Pitchfork methods, and Gann theory.', intro: 'For learners who want to study more advanced technical frameworks, the Advanced Course is planned to include Elliott Wave analysis, Pitchfork methods, Gann theory, and related applications. These methods require a strong foundation and sustained chart practice. Contact Mubsa Fin Institute for details about the planned syllabus and course availability.', focusTitle: 'Extend your analytical toolkit', focus: 'Advanced study builds on a solid understanding of markets, chart reading, and risk. The course is intended to introduce further analytical frameworks for students who are ready to deepen their technical study.', modules: [
    ['Elliott Wave analysis', 'Understand the fundamentals of Elliott Wave Theory and learn how recurring wave patterns can help analyze market structure and potential price movements.', []], ['Pitchfork methods', 'Learn how to use Pitchfork tools to identify price channels, analyze market direction, and study potential support and resistance area.', []], ['Gann theory', 'Explore the key concepts of Gann Theory and learn how selected Gann tools can be used to study price movements, market patterns, and potential turning points on charts.', []], ['Further advanced topics', 'Additional advanced tools and chart applications may be included as the syllabus develops. Contact Mubsa Fin Institute for the latest course details.', []],
  ] },
]
const faqs = [
  ['Which course should I start with?', 'If you are new to market analysis, the Basic Course covers the foundations. If you already understand the basics, review the Intermediate and Advanced topics or request course guidance.'],
  ['What does each course cover?', 'The Basic Course covers market fundamentals and chart basics. The Intermediate Course covers additional analytical concepts, trade planning, and risk management. The Advanced Course explores Elliott Wave analysis, Pitchfork methods, and Gann theory.'],
  ['Can I request help choosing a course?', 'Yes. Choose a course level and request a guidance session. Our team will confirm availability with you directly.'],
  ['Does the course guarantee trading profits?', 'No. Trading and investing involve risk, including possible loss of capital. Course content is educational and does not guarantee profits.'],
  ['Is this personal financial advice?', 'No. Course content is educational. It does not replace financial advice based on your individual circumstances.'],
  ['How does the course approach market discipline?', 'The learning path covers preparation, chart analysis, trade planning, and risk awareness. Learners are encouraged to wait for a setup they understand, follow a plan, and avoid decisions driven by greed or emotion.'],
  ['Can this approach guarantee results?', 'No. Markets are uncertain, and trading involves risk. No course or method can guarantee income or results.'],
]
const Arrow = () => <span className="arrow" aria-hidden="true">↗</span>
const copyrightYear = new Date().getFullYear()
const whatsappUrl = `https://wa.me/${site.phone.replace(/\D/g, '')}`
const courseVisuals = { basic: workshopImage, intermediate: heroImage, advanced: workshopImage }
const socialItems = [
  { label: 'Instagram', icon: FaInstagram },
  { label: 'YouTube', icon: FaYoutube },
  { label: 'LinkedIn', icon: FaLinkedinIn },
  { label: 'Facebook', icon: FaFacebookF },
  { label: 'X', icon: FaXTwitter },
]

function useRoute() {
  const current = () => `${window.location.pathname}${window.location.search}`
  const [path, setPath] = useState(current)
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    const handlePopState = () => {
      setIsNavigating(true)
      setPath(current())
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.setTimeout(() => setIsNavigating(false), 220)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const go = (to) => {
    if (to === current()) return
    setIsNavigating(true)
    window.setTimeout(() => {
      window.history.pushState({}, '', to)
      setPath(to)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.setTimeout(() => setIsNavigating(false), 220)
    }, 130)
  }

  return [path, go, isNavigating]
}
function useAmbientMotion() {
  useEffect(() => {
    const root = document.documentElement
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotion.matches) return undefined

    let frame = 0
    const updateScroll = () => {
      root.style.setProperty('--scroll-shift', `${Math.min(window.scrollY, 900) * -0.025}px`)
    }
    const updatePointer = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 18
        const y = (event.clientY / window.innerHeight - 0.5) * 14
        root.style.setProperty('--pointer-x', `${x}px`)
        root.style.setProperty('--pointer-y', `${y}px`)
        root.style.setProperty('--cursor-left', `${event.clientX}px`)
        root.style.setProperty('--cursor-top', `${event.clientY}px`)
        root.style.setProperty('--pointer-grid-x', `${x * -0.28}px`)
        root.style.setProperty('--pointer-grid-y', `${y * -0.28}px`)
        root.style.setProperty('--pointer-aurora-x', `${x * -0.45}px`)
        root.style.setProperty('--pointer-aurora-y', `${y * -0.45}px`)
      })
    }
    const sections = [...document.querySelectorAll('main section')]
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('in-view', entry.isIntersecting))
    }, { threshold: 0.12 })

    root.classList.add('motion-ready')
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('pointermove', updatePointer, { passive: true })
    sections.forEach((section) => observer.observe(section))
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('pointermove', updatePointer)
      observer.disconnect()
      root.classList.remove('motion-ready')
      root.style.removeProperty('--scroll-shift')
      root.style.removeProperty('--pointer-x')
      root.style.removeProperty('--pointer-y')
      root.style.removeProperty('--cursor-left')
      root.style.removeProperty('--cursor-top')
      root.style.removeProperty('--pointer-grid-x')
      root.style.removeProperty('--pointer-grid-y')
      root.style.removeProperty('--pointer-aurora-x')
      root.style.removeProperty('--pointer-aurora-y')
    }
  }, [])
}
function useInitialLoader() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => setLoading(false), reducedMotion ? 0 : 950)
    return () => window.clearTimeout(timer)
  }, [])
  return loading
}
function Brand({ go }) { return <a className="brand" href="/" onClick={(e) => { e.preventDefault(); go('/') }} aria-label={site.name}><img className="brand-mark brand-logo" src={logoMark} alt="" /><span className="brand-copy"><b>{site.shortName}<span>°</span></b><small>{site.descriptor}</small></span></a> }
function Header({ path, go }) {
  const [open, setOpen] = useState(false)
  const active = path.split('?')[0]
  const links = [['/', 'Home'], ['/courses', 'Courses'], ['/about', 'About'], ['/booking', 'Booking'], ['/testimonials', 'Testimonials'], ['/faq', 'FAQ'], ['/contact', 'Contact']]
  const navigate = (to) => { go(to); setOpen(false) }

  return <header className={open ? 'site-header menu-open' : 'site-header'}>
    <Brand go={go} />
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open}><span /><span /></button>
    {open && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    <nav className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
      {links.map(([url, label]) => <a href={url} className={active === url || (url === '/courses' && active.startsWith('/courses/')) ? 'current' : ''} onClick={(e) => { e.preventDefault(); navigate(url) }} key={url}>{label}</a>)}
      <button className="mobile-enquire" onClick={() => navigate('/contact')}>Enquire Now <Arrow /></button>
    </nav>
    <button className="header-cta" onClick={() => go('/booking')}>Request Course Guidance <Arrow /></button>
  </header>
}
function PageHero({ number, eyebrow, title, description, children }) { return <section className="page-hero"><div className="page-hero-grid" /><div className="page-hero-orb" /><div className="page-hero-copy"><p className="eyebrow"><span /> {eyebrow}</p><h1>{title}</h1><p>{description}</p>{children}</div>{number && <span className="page-counter" aria-hidden="true">{number}<i /></span>}</section> }
function CourseCards({ go }) { return <div className="course-grid">{courses.map((c) => <a id={`course-${c.slug}`} className="course-card" href={`/courses/${c.slug}`} onClick={(event) => { event.preventDefault(); go(`/courses/${c.slug}`) }} key={c.slug}><span>{c.number}</span><div className="solution-visual course-visual"><img src={courseVisuals[c.slug]} alt="" /><i /><b>{c.number}</b></div><p className="eyebrow">COURSE LEVEL</p><h3>{c.name}</h3><p>{c.description}</p><span className="text-link link-button">Explore the {c.name} <Arrow /></span></a>)}</div> }

function CourseFeedback() { return <section className="testimonials-placeholder"><p className="eyebrow">LEARNER TESTIMONIALS</p><h2>Feedback belongs<br />in learners’ <em>own words.</em></h2><p>Approved testimonials will appear here when available. Mubsa Fin Institute will publish learner feedback only after the wording is verified and each learner has given permission.</p><span>Verified learner feedback is being prepared.</span></section> }

function Home({ go }) {
  return <>
    <section className="hero mubsa-hero"><div className="hero-grid" /><div className="aurora aurora-one" /><div className="aurora aurora-two" /><div className="hero-photo"><img src={heroImage} alt="Learner studying financial charts" /><i /></div><div className="hero-copy"><p className="eyebrow"><span /> MARKET EDUCATION · CHART ANALYSIS · RISK AWARENESS</p><h1>Understand the market.<br /><em>Build your own method.</em></h1><p className="hero-description">Learn how markets work, read price charts with greater clarity, and develop a disciplined approach to analysis. Mubsa Fin Institute offers a structured learning path from market fundamentals to advanced technical methods. Build knowledge, practise patience, and make decisions with risk in mind.</p><div className="hero-actions"><button className="button primary" onClick={() => go('/courses')}>Explore Courses <Arrow /></button><button className="button hero-secondary" onClick={() => go('/booking')}>Request Course Guidance <Arrow /></button></div><div className="hero-trust"><span>Structured learning</span><i /> <span>Practice-led study</span><i /> <span>Risk awareness</span></div></div><div className="hero-foot"><span>LEARN WITH PURPOSE</span><i /><span>STUDY · PRACTISE · REVIEW</span></div></section>
    <QuoteTicker />
    <section className="learning-stats" aria-label="Institute learning experience"><div><strong>5 years</strong><span>Learning</span></div><div><strong>4 years</strong><span>Trading experience</span></div><div><strong>2 years</strong><span>Teaching experience</span></div><div><strong>100+</strong><span>Webinars and courses attended</span></div></section>
    <section className="mission-strip"><p className="eyebrow">A LONG-TERM EDUCATION MISSION</p><p>Help at least <strong>one million middle-class people</strong> move forward through proper trading and investment education.</p></section>
    <section className="statement"><p className="eyebrow">01 / A CLEARER WAY TO LEARN</p><div className="statement-layout"><h2>Understand first.<br /><em>Then shape a process.</em></h2><div><p>The language of markets can feel complex at first. Start with the essentials, build your chart knowledge step by step, and practise applying what you learn. The aim is not to copy someone else’s decisions. It is to strengthen your understanding and shape a process of your own.</p><p>Study the idea. See it on the chart. Then use it to organise your thinking.</p><button className="text-link link-button" onClick={() => document.getElementById('learning-path')?.scrollIntoView({ behavior: 'smooth' })}>See the Learning Path <span>↓</span></button></div></div></section>
    <section className="solutions home-solutions" id="learning-path"><div className="section-heading"><div><p className="eyebrow">02 / THREE LEVELS OF LEARNING</p><h2>Choose where you<br />want to <em>begin.</em></h2></div><p>Begin with the foundations, build your analytical skills, or explore advanced methods. Choose the level that fits what you have studied so far.</p></div><CourseLevelPicker /><CourseCards go={go} /><CourseComparison /></section>
    <LearningSteps />
    <section className="learning-showcase"><img src={workshopImage} alt="A chart analysis learning session" /><div><p className="eyebrow">A PRACTICAL LEARNING PATH</p><h2>Study concepts. <em>Practise with purpose.</em></h2><p>Learn the concepts, study chart examples, and develop a process for organising your analysis, planning possible trades, and considering risk before acting.</p><button className="text-link link-button" onClick={() => go('/booking')}>Request Course Guidance <Arrow /></button></div></section>
    <section className="market-mindset"><div><p className="eyebrow">MARKET MINDSET</p><h2>Patience over impulse.<br /><em>Process over emotion.</em></h2></div><div><p>A sound market process needs more than chart knowledge. It also needs <strong>patience, discipline, and emotional control.</strong> Greed can push people to chase trades or ignore a plan. Fear and excitement can cloud judgement.</p><p>Learn to wait for a clear setup, define your plan, consider the risk, and accept that no trade is guaranteed to work.</p></div></section>
    <QuoteTicker compact />
    <section className="course-principles"><p className="eyebrow">EDUCATION FIRST · RISK ALWAYS</p><h2>Build understanding before you make a <em>decision.</em></h2><p>Trading takes study, practice, and discipline. It does not offer guaranteed income. Our courses focus on market education, analysis, and risk awareness. They do not promise profits or replace financial advice based on individual circumstances.</p><button className="button primary" onClick={() => go('/contact')}>Ask a Question <Arrow /></button></section>
    <ContactBand go={go} title={<>Learn with purpose. Move forward with <em>knowledge.</em></>} text="Build your market understanding through a structured, time-conscious approach. Explore the courses or contact us to discuss where to begin. Mubsa Fin Institute’s long-term mission is to help at least one million middle-class people move forward through proper trading and investment education." primary="Explore Market Education" primaryPath="/courses" secondary="Get in Touch" />
  </>
}
function QuoteTicker({ compact = false }) {
  const lines = compact ? ['Learn the market. Build your own method.', 'Study with purpose. Analyse with discipline.', 'Patience over impulse. Process over emotion.', 'Make a plan. Manage risk. Respect the outcome.', 'Clear concepts. Better chart reading. Risk-aware decisions.', 'Build understanding before you make a decision.'] : ['Learn the chart. Question the setup. Respect the risk.', 'Discipline means following your plan, especially when emotions rise.', 'Markets reward patience more than haste.', 'Patience is a position too. Wait for a setup you understand.', 'Greed rushes. A clear process waits.', 'Control your decisions. The market is beyond your control.', 'Plan the trade. Respect the risk. Accept the outcome.', 'More screen time does not always mean better decisions.', 'Learn the market. Build your own method.', 'Clear concepts. Better chart reading. Risk-aware decisions.', 'Build understanding before you make a decision.', 'Study with purpose. Analyse with discipline.', 'Patience over impulse. Process over emotion.', 'Make a plan. Manage risk. Respect the outcome.']
  return <div className={compact ? 'quote-ticker quote-ticker-compact' : 'quote-ticker'} tabIndex="0" aria-label="Original Mubsa Fin Institute learning quotes"><div className="quote-ticker-track">{[...lines, ...lines].map((line, index) => <span key={`${index}-${line}`} aria-hidden={index >= lines.length}>&quot;{line}&quot;</span>)}</div></div>
}
function CourseLevelPicker() {
  const choices = [['basic', 'I am new to chart analysis'], ['intermediate', 'I know the basics'], ['advanced', 'I want to study advanced methods']]
  return <div className="course-level-picker"><p>Find your course level</p>{choices.map(([slug, label]) => <button key={slug} onClick={() => document.getElementById(`course-${slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>{label}<Arrow /></button>)}</div>
}
function LearningSteps() {
  const steps = [['Prepare', 'Set aside a focused time to study the market and the concepts you have learned.'], ['Wait', 'Be patient. Wait for a setup you understand instead of chasing movement.'], ['Plan', 'Write down your idea, possible entry and exit, and the risk you are willing to consider.'], ['Review', 'Reflect on the decision and the process, whatever the outcome.']]
  const [active, setActive] = useState(0)
  return <section className="learning-steps"><div className="learning-steps-heading"><p className="eyebrow">A FOUR-STEP LEARNING PROCESS</p><h2>Prepare. Wait.<br /><em>Plan. Review.</em></h2><p>Choose a step to read a short learning tip.</p></div><div className="learning-step-list"><div className="learning-step-line" />{steps.map(([title], index) => <button key={title} className={active === index ? 'learning-step active' : 'learning-step'} aria-pressed={active === index} aria-controls="learning-step-tip" onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{title}</strong><i>{active === index ? '−' : '+'}</i></button>)}<p id="learning-step-tip" className="learning-step-tip" aria-live="polite">{steps[active][1]}</p></div></section>
}
function CourseComparison() {
  return <details className="course-comparison"><summary>Compare course levels and topics</summary><div className="course-comparison-table"><table><thead><tr><th scope="col">Course level</th><th scope="col">Focus</th><th scope="col">Topics</th></tr></thead><tbody><tr><th scope="row">Basic</th><td>Market foundations and chart reading</td><td>Market basics, trading terminology, charts, candlesticks, market structure, trends, and chart levels</td></tr><tr><th scope="row">Intermediate</th><td>Developing analysis and trade planning</td><td>Liquidity, Smart Money concepts, Fibonacci, harmonic patterns, news awareness, trade planning, and risk management</td></tr><tr><th scope="row">Advanced</th><td>Advanced technical study</td><td>Elliott Wave analysis, Pitchfork methods, and Gann theory</td></tr></tbody></table></div></details>
}
function Method({ number, title, text }) { return <article className="method-card"><span>{number}</span><div className="method-symbol">◌</div><h3>{title}</h3><p>{text}</p></article> }
function Courses({ go }) { return <><PageHero number="03" eyebrow="COURSES" title={<>Build your market knowledge <em>one level at a time.</em></>} description="Each course has a distinct focus, from core market concepts to advanced technical analysis." /><section className="course-intro"><p>The course outlines below explain the topics covered at each level. If you are unsure which course suits your experience, request a guidance session. Mubsa Fin Institute will confirm availability with you directly.</p></section><section className="solution-deck mubsa-course-deck"><CourseLevelPicker /><CourseCards go={go} /><CourseComparison /></section><section className="content-intro"><p className="eyebrow">FIND YOUR STARTING POINT</p><h2>Where should I <em>start?</em></h2><div className="start-copy"><p>Not sure which level suits you? Tell us what you have studied so far and what you want to learn. Request a guidance session, and our team will confirm availability with you directly.</p><button className="button primary" onClick={() => go('/booking')}>Request Course Guidance <Arrow /></button></div></section></> }
function Testimonials({ go }) { return <><PageHero number="07" eyebrow="LEARNER TESTIMONIALS" title={<>Learner feedback in their<br /><em>own words.</em></>} description="We believe learner feedback should speak in learners’ own words." /><CourseFeedback /><ContactBand go={go} title={<>Ready to begin your <em>learning journey?</em></>} text="Explore the course outlines, compare the learning levels, or contact the Mubsa Fin Institute team with your questions." primary="Explore Courses" primaryPath="/courses" secondary="Ask a Question" /></> }
function Detail({ course, go }) { return <><PageHero number={course.number} eyebrow="COURSE DETAIL" title={<>{course.name}<br /><em>{course.tagline}</em></>} description={course.intro}><button className="button primary page-hero-button" onClick={() => go(`/contact?course=${encodeURIComponent(course.name)}`)}>Enquire About the {course.name} <Arrow /></button></PageHero><section className="course-detail"><div className="detail-heading"><p className="eyebrow">{course.slug === 'advanced' ? 'PLANNED AREAS OF STUDY' : 'WHAT YOU’LL LEARN'}</p><h2>{course.slug === 'advanced' ? 'Planned topics for deeper technical study.' : 'Study each module at your own pace.'}</h2></div><Modules items={course.modules} /></section><section className="content-intro course-focus"><p className="eyebrow">COURSE LEARNING FOCUS</p><h2>{course.focusTitle}</h2><p>{course.focus}</p></section><ContactBand go={go} title={course.slug === 'basic' ? 'Ready to build your foundation?' : course.slug === 'intermediate' ? 'Ready to take your analysis further?' : 'Ask about the Advanced Course'} text={course.slug === 'advanced' ? 'The advanced syllabus is in development. Contact Mubsa Fin Institute to ask about current topics, availability, and recommended preparation.' : `Contact Mubsa Fin Institute to ask about the ${course.name} and whether it fits your current level of experience.`} primary={`Enquire About the ${course.name}`} course={course.name} /></> }
function Modules({ items }) { const [open, setOpen] = useState(0); return <div className="module-list">{items.map(([title, description, topics], index) => <article className={open === index ? 'module-item open' : 'module-item'} key={title}><button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}><span>MODULE {String(index + 1).padStart(2, '0')}</span><strong>{title}</strong><b>+</b></button>{open === index && <div className="module-panel"><p>{description}</p>{topics.length > 0 && <ul>{topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>}</div>}</article>)}</div> }
function About({ go }) { return <><PageHero number="04" eyebrow="ABOUT THE INSTITUTE" title={<>Market learning with<br /><em>purpose and perspective.</em></>} description="Mubsa Fin Institute provides market education from the foundations to advanced analysis." /><section className="about-layout founder-story"><div><p className="eyebrow">FOUNDER & ACADEMIC DIRECTOR</p><h2>Mubarak<br /><em>Ahmad.</em></h2><p className="founder-location">Share-market educator · Dubai</p></div><div><p>Mubsa Fin Institute provides market education from the foundations to advanced analysis. Founder and Academic Director Mubarak Ahmad is a share-market educator based in Dubai. His mission is to help at least one million middle-class people move forward through proper trading and investment education.</p><p>His market journey includes five years of learning, four years of trading experience, and two years of teaching experience. He has completed basic, intermediate, and advanced training in Dubai through programmes carrying KHDA certification, and has attended more than 100 webinars and courses across the UAE, India, Malaysia, the United States, and the United Kingdom.</p><p>His teaching approach puts preparation, a focused market window, patience, selective entries, and planned exits ahead of watching the market all day. The aim is to make market learning more structured for working professionals and full-time traders. Trading remains risky; no method can guarantee income or results.</p><blockquote>&quot;Learn with purpose. Move forward with knowledge.&quot;</blockquote><strong className="founder-closing">Build understanding before you make a decision.</strong></div><div className="founder-portrait" aria-label="Founder portrait pending approved image"><span>MA</span><small>FOUNDER PORTRAIT</small></div></section><section className="security-profile"><p className="eyebrow">SECURITY SYSTEMS EXPERIENCE</p><h2>Engineering expertise,<br /><em>kept in its own lane.</em></h2><p>Alongside his market education work, Mubarak Ahmad is a senior security systems engineer with more than 12 years of experience in the UAE and India. At Hikvision MEA, he supports technical delivery and training across the UAE and Oman, with a focus on AI-enabled security, CCTV, and ELV systems.</p><p>His engineering work includes system planning, configuration, implementation support, troubleshooting, and user training. His profile records more than 150 product and user training sessions and a technical-support community of more than 600 MEA engineers that has resolved over 4,000 cases.</p></section><ContactBand go={go} title={<>Explore a learning path built around <em>understanding.</em></>} text="Build your market understanding through a structured approach. Explore the courses or contact us to discuss where to begin." primary="Explore Courses" primaryPath="/courses" secondary="Request Course Guidance" /></> }
function Value({ title, text }) { return <article className="value-card"><span>✦</span><h3>{title}</h3><p>{text}</p></article> }
function FAQ({ go }) { const [open, setOpen] = useState(0); return <><PageHero number="08" eyebrow="FREQUENTLY ASKED QUESTIONS" title={<>Start with the <em>fundamentals.</em></>} description="Clear answers about learning paths, market education, and the role of risk in every trading conversation." /><section className="faq-page"><div><p className="eyebrow">FREQUENTLY ASKED QUESTIONS</p><h2>Questions before your <em>next step.</em></h2><p>These answers help you choose a level with the right expectation: education and practice can improve understanding, but markets always involve risk.</p><button className="button ghost" onClick={() => go('/contact')}>Still have a question? <Arrow /></button></div><div className="faq-list">{faqs.map(([q, a], i) => <article className={open === i ? 'faq-item open' : 'faq-item'} key={q}><button aria-expanded={open === i} aria-controls={`faq-answer-${i}`} onClick={() => setOpen(open === i ? -1 : i)}><span>{String(i + 1).padStart(2, '0')}</span>{q}<b>+</b></button>{open === i && <p id={`faq-answer-${i}`} className="faq-answer" role="region">{a}</p>}</article>)}</div></section></> }
function Contact({ path }) {
  const [result, setResult] = useState({ status: 'idle', message: '', reference: '' })
  const course = new URLSearchParams(path.split('?')[1] || '').get('course') || 'Basic Course'
  const submit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form))
    setResult({ status: 'sending', message: '', reference: '' })
    try {
      const response = await fetch('/api/booking-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, consent: values.consent === 'on' }) })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.message || 'Unable to send your enquiry.')
      setResult({ status: 'success', message: payload.message, reference: payload.reference })
      form.reset()
    } catch (error) { setResult({ status: 'error', message: error.message, reference: '' }) }
  }
  return <><PageHero number="09" eyebrow="CONTACT" title={<>Contact Mubsa Fin <em>Institute.</em></>} description="Have a question about the courses? Contact Mubsa Fin Institute and tell us what you would like to learn." /><section className="contact-page"><form onSubmit={submit}><h2>Course enquiry</h2><p>Share your question and the course you are considering. We will contact you to discuss guidance and availability.</p><label>Full name<input required name="fullName" autoComplete="name" minLength="2" maxLength="120" placeholder="Your full name" /></label><label>Email address<input required name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label><label>Phone or WhatsApp number<input required name="phone" type="tel" autoComplete="tel" minLength="7" maxLength="30" placeholder="Include country code" /></label><label>Course of interest<select required name="course" defaultValue={course}>{courses.map((c) => <option key={c.name}>{c.name}</option>)}</select></label><label>Your question<textarea name="message" rows="5" maxLength="2000" placeholder="What would you like to learn?" /></label><label className="consent-check"><input required name="consent" type="checkbox" /> I agree that Mubsa Fin Institute may contact me about this enquiry.</label><button className="button primary" disabled={result.status === 'sending'}>{result.status === 'sending' ? 'Sending…' : 'Contact the Team'} <Arrow /></button>{result.status !== 'idle' && <p className={result.status === 'success' ? 'form-note' : 'form-error'} role="status">{result.message}{result.reference && <> Your reference: <strong>{result.reference}</strong>.</>}</p>}</form><aside className="contact-aside"><p className="eyebrow">CONTACT DETAILS</p><p>Have a question about market education? Reach us directly.</p><a href="https://mubsacapital.com" target="_blank" rel="noreferrer">MubsaCapital.com <Arrow /></a><a href={`mailto:${site.email}`}>{site.email}</a><a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a><a href={whatsappUrl} target="_blank" rel="noreferrer">Message us on WhatsApp <Arrow /></a><p>{site.locations}</p></aside></section></> }
function Booking({ path, go }) {
  const [result, setResult] = useState({ status: 'idle', message: '', reference: '' })
  const selectedCourse = new URLSearchParams(path.split('?')[1] || '').get('course') || 'Basic Course'
  const submit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form))
    values.message = `Preferred contact method: ${values.contactMethod}.\n\n${values.message || ''}`
    setResult({ status: 'sending', message: '', reference: '' })
    try {
      const response = await fetch('/api/booking-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, consent: values.consent === 'on' }) })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.message || 'Unable to submit your request.')
      setResult({ status: 'success', message: payload.message, reference: payload.reference })
      form.reset()
    } catch (error) { setResult({ status: 'error', message: error.message, reference: '' }) }
  }
  return <><PageHero number="06" eyebrow="BOOKING & COURSE GUIDANCE" title={<>Request a course <em>guidance session.</em></>} description="Choose the course level you are considering and share what you would like to study. Mubsa Fin Institute will contact you to confirm availability; submitting this form does not confirm a booking." /><section className="booking-page"><div className="booking-intro"><p className="eyebrow">HOW IT WORKS</p><h2>A clear next <em>step.</em></h2><ol><li><span>01</span> Choose the course you are considering.</li><li><span>02</span> Tell us what you have studied and want to learn.</li><li><span>03</span> We will contact you to confirm availability.</li></ol><a className="text-link" href={whatsappUrl} target="_blank" rel="noreferrer">Message Us on WhatsApp: {site.phone} <Arrow /></a></div><form className="booking-form" onSubmit={submit}><h2>Request course guidance</h2><p>Share a few details and Mubsa Fin Institute will follow up with you.</p><div className="booking-form-grid"><label>Full name<input required name="fullName" autoComplete="name" minLength="2" maxLength="120" placeholder="Your full name" /></label><label>Email address<input required name="email" type="email" autoComplete="email" maxLength="254" placeholder="you@example.com" /></label><label>Phone or WhatsApp number<input required name="phone" type="tel" autoComplete="tel" minLength="7" maxLength="30" placeholder="Include country code" /></label><label>Course level<select required name="course" defaultValue={selectedCourse}>{courses.map((c) => <option key={c.name}>{c.name}</option>)}</select></label><label>Preferred contact method<select required name="contactMethod" defaultValue=""><option value="" disabled>Choose how we should contact you</option><option>Email</option><option>Phone</option><option>WhatsApp</option></select></label></div><label>What would you like to learn? (optional)<textarea name="message" rows="4" maxLength="2000" placeholder="Share your current experience and the topics you want to study." /></label><label className="consent-check"><input required name="consent" type="checkbox" /> I agree that Mubsa Fin Institute may contact me about this request.</label><button className="button primary" disabled={result.status === 'sending'}>{result.status === 'sending' ? 'Sending request…' : 'Request a Guidance Session'} <Arrow /></button>{result.status !== 'idle' && <p className={result.status === 'success' ? 'form-note' : 'form-error'} role="status">{result.message}{result.reference && <> Your reference: <strong>{result.reference}</strong>.</>}</p>}<small className="booking-availability-note">Your request is not a confirmed booking. We will contact you to confirm availability.</small></form></section></> }
function ContactBand({ go, title, text, primary, secondary, course, primaryPath }) { return <section className="contact-band"><div><p className="eyebrow">NEXT STEP</p><h2>{title}</h2></div><div><p>{text}</p><div className="contact-band-actions"><button className="button primary" onClick={() => go(primaryPath || (course ? `/contact?course=${encodeURIComponent(course)}` : '/courses'))}>{primary} <Arrow /></button>{secondary && <button className="text-link link-button" onClick={() => go('/contact')}>{secondary} <Arrow /></button>}</div></div></section> }
function WebinarPopup({ open, close, webinar, whatsappLink }) {
  const [result, setResult] = useState({ status: 'idle', message: '', reference: '' })
  if (!open || !webinar) return null
  const submit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form))
    setResult({ status: 'sending', message: '', reference: '' })
    try {
      const response = await fetch('/api/webinar-registrations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, webinarId: webinar.id, consent: values.consent === 'on' }) })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.message || 'Unable to complete your registration.')
      setResult({ status: 'success', message: payload.message, reference: payload.reference })
      form.reset()
    } catch (error) { setResult({ status: 'error', message: error.message, reference: '' }) }
  }
      const date = new Date(webinar.startsAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short', timeZone: webinar.timeZone || 'Asia/Kolkata' })
  return <div className="guidance-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}><section className="guidance-popup webinar-popup" role="dialog" aria-modal="true" aria-labelledby="guidance-title"><button className="popup-close" onClick={close} aria-label="Close webinar registration">×</button><p className="eyebrow">FREE LIVE WEBINAR</p><h2 id="guidance-title">{webinar.title}</h2><p>{webinar.description || 'Reserve your place and we will send the joining details to your email and WhatsApp.'}</p><div className="webinar-popup-meta"><span>{date} · {webinar.timeZone || 'Asia/Kolkata'}</span><span>{webinar.durationMinutes} minutes</span>{webinar.speaker && <span>With {webinar.speaker}</span>}</div><form className="webinar-registration-form" onSubmit={submit}><label>Full name<input name="name" autoComplete="name" required minLength="2" maxLength="120" placeholder="Your name" /></label><label>Email address<input name="email" type="email" autoComplete="email" required maxLength="254" placeholder="you@example.com" /></label><label>WhatsApp number<input name="phone" type="tel" autoComplete="tel" required minLength="7" maxLength="30" placeholder="Include country code" /></label><label>City<select name="city" required defaultValue=""><option value="" disabled>Select your city</option>{['Chennai', 'Coimbatore', 'Madurai', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi', 'Dubai', 'Other'].map((city) => <option key={city}>{city}</option>)}</select></label><label>Profession<select name="profession" required defaultValue=""><option value="" disabled>Select your profession</option>{['Student', 'Business owner', 'Salaried professional', 'Finance professional', 'Homemaker', 'Educator', 'Other'].map((profession) => <option key={profession}>{profession}</option>)}</select></label><label className="webinar-consent"><input type="checkbox" name="consent" required /> I agree to receive webinar details and reminders by email and WhatsApp.</label><button className="button primary" disabled={result.status === 'sending'}>{result.status === 'sending' ? 'Saving your place…' : 'Register for free'} <Arrow /></button>{result.status !== 'idle' && <p className={result.status === 'success' ? 'form-note' : 'form-error'} role="status">{result.message}{result.reference && <> Registration reference: <strong>{result.reference}</strong>.</>}</p>}</form>{whatsappLink && <a className="popup-whatsapp" href={whatsappLink} target="_blank" rel="noreferrer">Questions? Contact us on WhatsApp <Arrow /></a>}</section></div>
}
function SocialRail({ go, compact = false }) { return <div className={compact ? 'footer-social' : 'social-rail'}>{compact && <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Chat with Mubsa Fin Institute on WhatsApp" title="WhatsApp"><FaWhatsapp /></a>}{socialItems.map(({ label, icon: Icon }) => <button key={label} onClick={() => go('/contact')} aria-label={`Ask for ${label} details`} title={`${label} details coming soon`}><Icon /></button>)}</div> }
function AnnouncementCarousel({ slides, telegramUrl, register }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused || slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % slides.length), 6500)
    return () => window.clearInterval(timer)
  }, [paused, slides.length])
  if (!slides.length && !telegramUrl) return null
  const activeIndex = slides.length ? index % slides.length : 0
  const slide = slides[activeIndex] || { id: 'community', type: 'community', label: 'MARKET LEARNING COMMUNITY', title: 'Join the Mubsa learning community', description: 'Get market learning updates and upcoming session announcements.', ctaLabel: 'Join our Telegram', href: telegramUrl }
  const date = slide.startsAt ? new Date(slide.startsAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: slide.timeZone || 'Asia/Kolkata' }) : ''
  return <aside className="announcement-strip" aria-label="Featured announcements" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }}><span className="announcement-label">{slide.label}</span><div className="announcement-copy" key={slide.id}><b>{slide.title}</b>{slide.description && <p>{slide.description}</p>}{date && <small>{date}{slide.speaker ? ` · With ${slide.speaker}` : ''}</small>}</div><div className="announcement-actions">{slide.type === 'session' ? <button onClick={() => register(slide)}>{slide.ctaLabel} <Arrow /></button> : slide.href ? <a href={slide.href} target={slide.href.startsWith('http') ? '_blank' : undefined} rel={slide.href.startsWith('http') ? 'noreferrer' : undefined}>{slide.ctaLabel || 'Explore'} <Arrow /></a> : null}{telegramUrl && slide.type !== 'community' && <a className="announcement-community-link" href={telegramUrl} target="_blank" rel="noreferrer">Telegram <Arrow /></a>}</div>{slides.length > 1 && <div className="announcement-controls"><button aria-label="Previous announcement" onClick={() => setIndex((current) => (current - 1 + slides.length) % slides.length)}>‹</button><span>{activeIndex + 1}/{slides.length}</span><button aria-label="Next announcement" onClick={() => setIndex((current) => (current + 1) % slides.length)}>›</button><button aria-label={paused ? 'Resume announcement rotation' : 'Pause announcement rotation'} onClick={() => setPaused((value) => !value)}>{paused ? '▶' : 'Ⅱ'}</button></div>}</aside>
}
function Footer({ go }) { return <footer><div><Brand go={go} /><p>Build your market understanding through a structured, time-conscious approach. Mubsa Fin Institute helps learners study markets, charts, and risk with purpose.</p></div><div className="footer-nav"><button onClick={() => go('/')}>Home</button><button onClick={() => go('/courses')}>Courses</button><button onClick={() => go('/testimonials')}>Testimonials</button><button onClick={() => go('/about')}>About</button><button onClick={() => go('/booking')}>Booking</button><button onClick={() => go('/contact')}>Contact</button><button onClick={() => go('/faq')}>FAQ</button></div><div className="footer-contact"><a href="https://mubsacapital.com" target="_blank" rel="noreferrer">MubsaCapital.com</a><a href={`mailto:${site.email}`}>{site.email}</a><a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a><span>{site.locations}</span><SocialRail go={go} compact /></div><small>© {copyrightYear} {site.name}. Trading and investing involve risk, including possible loss of capital. Course content is for educational purposes only. It does not guarantee profits or replace financial advice based on individual circumstances.</small></footer> }
function PageLoader({ show }) { return <div className={show ? 'route-loader show' : 'route-loader'} aria-hidden="true"><strong>M</strong><span>MUBSA FIN INSTITUTE</span><i /></div> }
export default function MubsaApp() {
  const [path, go, isNavigating] = useRoute()
  const [siteContent, setSiteContent] = useState({ webinar: null, slides: [], telegramUrl: '', whatsappUrl: '' })
  useAmbientMotion()
  const isInitialLoading = useInitialLoader()
  const [guidanceOpen, setGuidanceOpen] = useState(false)
  const [selectedWebinar, setSelectedWebinar] = useState(null)
  const [guidanceSeen, setGuidanceSeen] = useState(false)
  const plain = path.split('?')[0]
  useEffect(() => {
    const pageMeta = {
      '/': ['Mubsa Fin Institute | Market Education', 'Learn how markets work, read price charts with greater clarity, and develop a disciplined approach to market analysis with Mubsa Fin Institute.'],
      '/courses': ['Courses | Mubsa Fin Institute', 'Explore Basic, Intermediate, and Advanced market education courses from Mubsa Fin Institute.'],
      '/about': ['About Mubsa Fin Institute', 'Learn about Mubsa Fin Institute, its founder Mubarak Ahmad, and its market education approach.'],
      '/booking': ['Course Guidance | Mubsa Fin Institute', 'Request course guidance from Mubsa Fin Institute. Availability is confirmed directly by the team.'],
      '/testimonials': ['Learner Feedback | Mubsa Fin Institute', 'Approved learner testimonials will appear here after verification and permission.'],
      '/faq': ['FAQs | Mubsa Fin Institute', 'Answers about Mubsa Fin Institute courses, market education, and trading risk.'],
      '/contact': ['Contact Mubsa Fin Institute', 'Contact Mubsa Fin Institute about courses, market education, and guidance.'],
      '/admin': ['Admin | Mubsa Fin Institute', 'Private administration for Mubsa Fin Institute.'],
    }
    const detail = plain.startsWith('/courses/') ? [`${courses.find((item) => plain === `/courses/${item.slug}`)?.name || 'Course'} | Mubsa Fin Institute`, 'Course outline and market education topics from Mubsa Fin Institute.'] : null
    const [title, description] = pageMeta[plain] || detail || pageMeta['/']
    document.title = title
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) metaDescription.setAttribute('content', description)
  }, [plain])
  useEffect(() => {
    if (plain === '/admin') return undefined
    let active = true
    const refresh = () => fetch('/api/site-content').then((response) => response.ok ? response.json() : null).then((content) => { if (active && content) setSiteContent(content) }).catch(() => {})
    refresh()
    const timer = window.setInterval(refresh, 30_000)
    return () => { active = false; window.clearInterval(timer) }
  }, [plain])
  useEffect(() => {
    if (plain !== '/' || guidanceSeen || !siteContent.webinar) return undefined
    const timer = window.setTimeout(() => setGuidanceOpen(true), 7000)
    return () => window.clearTimeout(timer)
  }, [plain, guidanceSeen, siteContent.webinar])
  const dismissGuidance = () => { setGuidanceOpen(false); setGuidanceSeen(true); setSelectedWebinar(null) }
  const course = courses.find((c) => plain === `/courses/${c.slug}`)
  if (plain === '/admin') return <AdminDashboard />
  const page = course ? <Detail course={course} go={go} /> : plain === '/courses' ? <Courses go={go} /> : plain === '/testimonials' ? <Testimonials go={go} /> : plain === '/about' ? <About go={go} /> : plain === '/faq' ? <FAQ go={go} /> : plain === '/booking' ? <Booking path={path} go={go} /> : plain === '/contact' ? <Contact path={path} /> : <Home go={go} />
  const webinar = siteContent.webinar
  const popupWebinar = selectedWebinar || webinar
  const whatsappLink = siteContent.whatsappUrl || whatsappUrl
  return <main><div className="cursor-glow" aria-hidden="true"><i /><b /></div><PageLoader show={isNavigating || isInitialLoading} /><AnnouncementCarousel slides={siteContent.slides || []} telegramUrl={siteContent.telegramUrl} register={(slide) => { setSelectedWebinar(slide); setGuidanceOpen(true) }} /><Header path={path} go={go} /><SocialRail go={go} /><div className="route-view" key={path}>{page}</div><Footer go={go} /><a className="whatsapp-float" href={whatsappLink} target="_blank" rel="noreferrer" aria-label="Chat with Mubsa Fin Institute on WhatsApp"><FaWhatsapp /><b>WhatsApp</b></a><WebinarPopup key={`${guidanceOpen}-${popupWebinar?.id || ''}`} open={guidanceOpen} close={dismissGuidance} webinar={popupWebinar} whatsappLink={siteContent.whatsappUrl} /></main>
}
