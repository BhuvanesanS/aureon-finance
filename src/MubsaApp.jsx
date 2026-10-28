import { useEffect, useState } from 'react'
import './App.css'
import './pages.css'
import logoMark from './assets/mubsa-mark.svg'
import heroImage from './assets/mubsa-market-learning-hero.png'
import workshopImage from './assets/mubsa-workshop-learning.png'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaXTwitter, FaYoutube } from 'react-icons/fa6'

const site = { name: 'Mubsafin', shortName: 'MUBSAFIN', descriptor: 'MARKET EDUCATION', email: 'askme@mubsacapital.com', phone: '+91 9983 67 9983', locations: 'Dubai · India' }
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
const faqs = [['What is the difference between the three courses?', 'The Basic Course introduces markets, trading terminology, chart tools, candlesticks, and market structure. The Intermediate Course covers more detailed chart concepts, Fibonacci and harmonic patterns, news awareness, risk planning, and trading frameworks. The Advanced Course is planned to cover Elliott Wave analysis, Pitchfork methods, Gann theory, and related topics.'], ['Which course should a beginner choose?', 'The Basic Course is the recommended starting point for people who are new to markets or want to strengthen their understanding of charts and terminology.'], ['Do I need experience before joining the Intermediate Course?', 'The Intermediate Course builds on foundational market and chart knowledge. If you are unsure whether you have the required background, contact Mubsa Fin Institute for guidance.'], ['What will I learn in the Advanced Course?', 'The planned areas include Elliott Wave analysis, Pitchfork methods, and Gann theory. Contact Mubsa Fin Institute for current syllabus and availability details.'], ['Does the course guarantee trading profits?', 'No. Financial markets involve risk, and no course can guarantee profits or a specific result. The courses provide education; students remain responsible for their own decisions.'], ['Are students expected to practice?', 'Yes. Practice and completion of assigned work are important parts of learning. Students should be prepared to study the material and apply the concepts themselves.'], ['How can I ask about fees or availability?', 'Use the enquiry form on the Contact page or email askme@mubsacapital.com. The website should not display fees or dates until Mubsa Fin Institute confirms those details.']]
const learnerTestimonials = [
  ['Mr Samsul Abideen', 'MEP Senior Engineer'],
  ['Miss Sabreen', 'College Student'],
  ['Mrs Zainab Fathima', 'Home Maker'],
  ['Miss Rizvia', 'School Teacher'],
  ['Mr Habeeb', 'HR Manager'],
  ['Mr Mohammed Ali', 'Security System Engineer'],
]
const courseFeedback = [
  { rating: '4.7', quote: 'The class was very useful; I never felt bored. I look forward to continuing the learning journey.' },
  { rating: '5.0', quote: 'When I joined, I had doubts about whether I could learn trading. The teaching, examples, and experience shared were motivating, and doubts were always cleared.' },
  { rating: '5.0', quote: 'Before attending, I had zero knowledge of trading and no confidence in understanding the market. The clear, beginner-friendly teaching and continuous support helped me learn with confidence.' },
]
const Arrow = () => <span className="arrow" aria-hidden="true">↗</span>
const copyrightYear = new Date().getFullYear()
const bookingMinimumDate = new Date().toISOString().slice(0, 10)
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
  const links = [['/', 'Home'], ['/courses', 'Courses'], ['/testimonials', 'Testimonials'], ['/about', 'About'], ['/booking', 'Booking'], ['/contact', 'Contact']]
  const navigate = (to) => { go(to); setOpen(false) }

  return <header className={open ? 'site-header menu-open' : 'site-header'}>
    <Brand go={go} />
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open}><span /><span /></button>
    {open && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    <nav className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
      {links.map(([url, label]) => <a href={url} className={active === url || (url === '/courses' && active.startsWith('/courses/')) ? 'current' : ''} onClick={(e) => { e.preventDefault(); navigate(url) }} key={url}>{label}</a>)}
      <a className="mobile-only" href="/faq" onClick={(e) => { e.preventDefault(); navigate('/faq') }}>FAQ</a>
      <button className="mobile-enquire" onClick={() => navigate('/contact')}>Enquire Now <Arrow /></button>
    </nav>
    <button className="header-cta" onClick={() => go('/booking')}>Book a session <Arrow /></button>
  </header>
}
function PageHero({ number, eyebrow, title, description, children }) { return <section className="page-hero"><div className="page-hero-grid" /><div className="page-hero-orb" /><div className="page-hero-copy"><p className="eyebrow"><span /> {number} / {eyebrow}</p><h1>{title}</h1><p>{description}</p>{children}</div><div className="page-counter"><span>{number}</span><i /></div></section> }
function CourseCards({ go }) { return <div className="course-grid">{courses.map((c) => <article className="course-card" key={c.slug}><span>{c.number}</span><div className="solution-visual course-visual"><img src={courseVisuals[c.slug]} alt="" /><i /><b>{c.number}</b></div><p className="eyebrow">COURSE LEVEL</p><h3>{c.name}</h3><p>{c.description}</p><button className="text-link link-button" onClick={() => go(`/courses/${c.slug}`)}>Explore the {c.name} <Arrow /></button></article>)}</div> }

function LearnerTestimonials() { return <section className="learner-testimonials"><div className="learner-testimonials-inner"><div className="learner-testimonials-heading"><div><p className="eyebrow">05 / LEARNER TESTIMONIALS</p><h2>People from different paths,<br /><em>learning with purpose.</em></h2></div><p className="learner-testimonials-intro">Our learning community includes professionals, students, and educators who are building a clearer understanding of financial markets.</p></div><div className="learner-testimonial-grid">{learnerTestimonials.map(([name, role], index) => <article className="learner-testimonial-card" key={name}><span>{String(index + 1).padStart(2, '0')}</span><small>Course participant</small><h3>{name}</h3><p>{role}</p></article>)}</div></div></section> }
function CourseFeedback() { return <section className="course-feedback"><div className="course-feedback-inner"><div className="course-feedback-heading"><p className="eyebrow">VERIFIED COURSE FEEDBACK</p><h2>What learners said<br />after the <em>course.</em></h2><p>Feedback is presented from course surveys. Ratings reflect each individual response.</p></div><div className="course-feedback-grid">{courseFeedback.map((feedback, index) => <article className="course-feedback-card" key={feedback.quote}><div className="course-feedback-card-top"><span>{String(index + 1).padStart(2, '0')}</span><strong aria-label={`${feedback.rating} out of 5 rating`}>{feedback.rating}<small>/5</small></strong></div><p className="course-feedback-stars" aria-hidden="true">★★★★★</p><blockquote>“{feedback.quote}”</blockquote><small>Course participant</small></article>)}</div></div></section> }

function Home({ go }) { return <><section className="hero mubsa-hero"><div className="hero-grid" /><div className="aurora aurora-one" /><div className="aurora aurora-two" /><div className="hero-photo"><img src={heroImage} alt="Learner studying financial charts in a market education studio" /><i /></div><div className="hero-copy"><p className="eyebrow"><span /> MARKET EDUCATION · CHART ANALYSIS · RISK AWARENESS</p><h1>Learn the markets.<br /><em>Build your own process.</em></h1><p className="hero-description">Understand how markets work, learn to read price charts, and develop a more considered approach to investing and trading. Mubsa Fin Institute offers learning paths from market fundamentals to advanced technical analysis.</p><div className="hero-actions"><button className="button primary" onClick={() => go('/courses')}>Explore Courses <Arrow /></button><button className="button hero-secondary" onClick={() => go('/booking')}>Request a Session <Arrow /></button></div><div className="hero-trust"><span>Structured learning</span><i /> <span>Practice-led study</span><i /> <span>Risk awareness</span></div></div><div className="hero-foot"><span>LEARN WITH CLARITY</span><i /><span>STUDY · PRACTICE · REVIEW</span></div></section><section className="learning-stats"><div><strong>03</strong><span>Course levels</span></div><div><strong>Basic → Advanced</strong><span>A clear learning path</span></div><div><strong>Dubai · India</strong><span>Available to learners across locations</span></div></section><section className="statement"><p className="eyebrow">01 / A CLEARER START</p><div className="statement-layout"><h2>A stronger foundation for every <em>market decision.</em></h2><div><p>Markets can feel difficult to follow when the language, charts, and methods are unfamiliar. Our courses make those ideas easier to study, with a structured path through market basics, chart analysis, trading frameworks, and advanced methods.</p><p>Learn the concepts. Practice what you learn. Build an approach that reflects your own understanding and risk decisions.</p><button className="text-link link-button" onClick={() => document.getElementById('learning-path')?.scrollIntoView({ behavior: 'smooth' })}>See the Learning Path <span>↓</span></button></div></div></section><section className="solutions home-solutions" id="learning-path"><div className="section-heading"><div><p className="eyebrow">02 / THREE LEVELS OF LEARNING</p><h2>Choose where you<br />want to <em>begin.</em></h2></div><p>Start with the fundamentals, develop your chart analysis, or explore advanced technical methods. Each course has its own focus.</p></div><CourseCards go={go} /></section><section className="learning-showcase"><img src={workshopImage} alt="Instructor leading a financial chart learning session" /><div><p className="eyebrow">LEARNING THAT BUILDS OVER TIME</p><h2>Study concepts. <em>Practice with purpose.</em></h2><p>Work through market language, chart examples, and structured topics with a path that matches your current knowledge.</p><button className="text-link link-button" onClick={() => go('/booking')}>Talk through your learning level <Arrow /></button></div></section><section className="method-grid learning-methods"><Method number="01" title="Learn the concept" text="Understand the language, tools, and analytical methods covered in your course." /><Method number="02" title="Apply it to charts" text="Work through chart examples and practice identifying the ideas you have studied." /><Method number="03" title="Develop your process" text="Use what you learn to organize your analysis, plan possible trades, and consider risk." /></section><section className="course-principles"><p className="eyebrow">04 / COURSE PRINCIPLES</p><h2>A thoughtful approach to the <em>markets.</em></h2><p>Trading is a skill that requires study, practice, and discipline. It is not a shortcut to guaranteed income. Our courses focus on education, market analysis, and risk awareness—not promises of fixed profits.</p></section><ContactBand go={go} title={<>Find the course that fits your <em>next step.</em></>} text="Explore the course outlines to see what each level covers. If you are unsure where to begin, contact our team with your questions." primary="Compare Courses" secondary="Ask a Question" /></> }
function Method({ number, title, text }) { return <article className="method-card"><span>{number}</span><div className="method-symbol">◌</div><h3>{title}</h3><p>{text}</p></article> }
function Courses({ go }) { return <><PageHero number="02" eyebrow="COURSES" title={<>Explore the Mubsafin <em>courses.</em></>} description="Build your market knowledge through three learning levels. Begin with the foundations, continue into more detailed chart analysis, or explore advanced technical methods." /><section className="course-intro"><p>The course outlines below explain the topics covered at each level. If you are unsure which course suits your experience, contact Mubsafin before enrolling.</p></section><section className="solution-deck mubsa-course-deck"><CourseCards go={go} /></section><section className="content-intro"><p className="eyebrow">CHOOSING A COURSE</p><h2>Where should you <em>start?</em></h2><div className="start-copy"><p>Choose the Basic Course if you are new to market concepts or want to strengthen your understanding of charts and terminology.</p><p>Choose the Intermediate Course if you already understand the foundations and want to study more detailed chart concepts, trading frameworks, and risk planning.</p><p>Choose the Advanced Course if you want to explore advanced analytical methods. The topics listed for this course are planned areas of study; contact us for current course availability and details.</p><button className="button primary" onClick={() => go('/contact')}>Contact Us for Guidance <Arrow /></button></div></section></> }
function Testimonials({ go }) { return <><PageHero number="05" eyebrow="LEARNER TESTIMONIALS" title={<>Different backgrounds.<br /><em>One commitment to learning.</em></>} description="Meet members of the Mubsafin learning community who have chosen to strengthen their understanding of financial markets." /><CourseFeedback /><LearnerTestimonials /><ContactBand go={go} title={<>Ready to begin your <em>learning journey?</em></>} text="Explore the course outlines, compare the learning levels, or contact the Mubsafin team with your questions." primary="Explore Courses" primaryPath="/courses" secondary="Ask a Question" /></> }
function Detail({ course, go }) { return <><PageHero number={course.number} eyebrow="COURSE DETAIL" title={<>{course.name}<br /><em>{course.tagline}</em></>} description={course.intro}><button className="button primary page-hero-button" onClick={() => go(`/contact?course=${encodeURIComponent(course.name)}`)}>Enquire About the {course.name} <Arrow /></button></PageHero><section className="course-detail"><div className="detail-heading"><p className="eyebrow">{course.slug === 'advanced' ? 'PLANNED AREAS OF STUDY' : 'WHAT YOU’LL LEARN'}</p><h2>{course.slug === 'advanced' ? 'Planned topics for deeper technical study.' : 'Study each module at your own pace.'}</h2></div><Modules items={course.modules} /></section><section className="content-intro course-focus"><p className="eyebrow">COURSE LEARNING FOCUS</p><h2>{course.focusTitle}</h2><p>{course.focus}</p></section><ContactBand go={go} title={course.slug === 'basic' ? 'Ready to build your foundation?' : course.slug === 'intermediate' ? 'Ready to take your analysis further?' : 'Ask about the Advanced Course'} text={course.slug === 'advanced' ? 'The advanced syllabus is in development. Contact Mubsa Fin Institute to ask about current topics, availability, and recommended preparation.' : `Contact Mubsa Fin Institute to ask about the ${course.name} and whether it fits your current level of experience.`} primary={`Enquire About the ${course.name}`} course={course.name} /></> }
function Modules({ items }) { const [open, setOpen] = useState(0); return <div className="module-list">{items.map(([title, description, topics], index) => <article className={open === index ? 'module-item open' : 'module-item'} key={title}><button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}><span>MODULE {String(index + 1).padStart(2, '0')}</span><strong>{title}</strong><b>+</b></button>{open === index && <div className="module-panel"><p>{description}</p>{topics.length > 0 && <ul>{topics.map((topic) => <li key={topic}>{topic}</li>)}</ul>}</div>}</article>)}</div> }
function About({ go }) { return <><PageHero number="05" eyebrow="ABOUT" title={<>About <em>Mubsafin.</em></>} description="Market education built around understanding and practice." /><section className="about-layout"><div><p className="eyebrow">OUR LEARNING APPROACH</p><h2>Clear concepts.<br />Practical study.<br /><em>Responsible expectations.</em></h2></div><div><p>Mubsafin provides market education for people who want to understand financial markets and develop their knowledge of chart analysis. Our courses cover market foundations, technical concepts, trading frameworks, and risk awareness.</p><p>We believe learning should be approached with patience and responsibility. Concepts need to be studied, practiced, and reviewed. No course can remove market risk or guarantee a particular result.</p></div></section><section className="values-grid"><Value title="Clear concepts" text="We introduce financial and technical terms in a structured learning path, from foundational ideas to more advanced methods." /><Value title="Practical study" text="Students work with chart examples and apply concepts through practice and assigned work." /><Value title="Responsible expectations" text="We encourage students to focus on learning, practice discipline, manage risk responsibly, and build their skills step by step." /></section><ContactBand go={go} title={<>Find the right <em>learning level.</em></>} text="Explore the Basic, Intermediate, and Advanced courses to see which topics match your current knowledge and learning goals." primary="Explore Courses" primaryPath="/courses" /></> }
function Value({ title, text }) { return <article className="value-card"><span>✦</span><h3>{title}</h3><p>{text}</p></article> }
function FAQ({ go }) { const [open, setOpen] = useState(0); return <><PageHero number="06" eyebrow="FREQUENTLY ASKED QUESTIONS" title={<>Start with the <em>fundamentals.</em></>} description="Clear answers about learning paths, market education, and the role of risk in every trading conversation." /><section className="faq-page"><div><p className="eyebrow">FREQUENTLY ASKED QUESTIONS</p><h2>Questions before your <em>next step.</em></h2><p>These answers help you choose a level with the right expectation: education and practice can improve understanding, but markets always involve risk.</p><button className="button ghost" onClick={() => go('/contact')}>Still have a question? <Arrow /></button></div><div className="faq-list">{faqs.map(([q, a], i) => <article className={open === i ? 'faq-item open' : 'faq-item'} key={q}><button onClick={() => setOpen(open === i ? -1 : i)}><span>{String(i + 1).padStart(2, '0')}</span>{q}<b>+</b></button>{open === i && <p className="faq-answer">{a}</p>}</article>)}</div></section></> }
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
  return <><PageHero number="07" eyebrow="CONTACT" title={<>Contact Mubsa Fin <em>Institute.</em></>} description="Have a question about the courses or want help choosing a level? Send us a message and our team will get back to you." /><section className="contact-page"><form onSubmit={submit}><h2>Course enquiry</h2><label>Full name<input required name="fullName" placeholder="Your full name" /></label><label>Email address<input required name="email" type="email" placeholder="you@example.com" /></label><label>Phone number<input required name="phone" type="tel" placeholder="Your phone number" /></label><label>City (optional)<input name="city" placeholder="Your city" /></label><label>Course of interest<select required name="course" defaultValue={course}>{courses.map((c) => <option key={c.name}>{c.name}</option>)}</select></label><label>Your question<textarea name="message" rows="5" placeholder="How can we help?" /></label><label className="consent-check"><input required name="consent" type="checkbox" /> I agree that Mubsa Fin Institute may contact me about my enquiry.</label><button className="button primary" disabled={result.status === 'sending'}>{result.status === 'sending' ? 'Sending…' : 'Send Enquiry'} <Arrow /></button>{result.status !== 'idle' && <p className={result.status === 'success' ? 'form-note' : 'form-error'}>{result.message}{result.reference && <> Your reference: <strong>{result.reference}</strong>.</>}</p>}</form><aside className="contact-aside"><p className="eyebrow">CONTACT DETAILS</p><a href="https://MubsaCapital.com" target="_blank" rel="noreferrer">MubsaCapital.com</a><a href={`mailto:${site.email}`}>{site.email}</a><a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a><p>{site.locations}</p><small>Contact details should be confirmed before publishing.</small></aside></section></> }
function Booking({ path, go }) {
  const [result, setResult] = useState({ status: 'idle', message: '', reference: '' })
  const selectedCourse = new URLSearchParams(path.split('?')[1] || '').get('course') || 'Basic Course'
  const submit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form))
    setResult({ status: 'sending', message: '', reference: '' })
    try {
      const response = await fetch('/api/booking-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, consent: values.consent === 'on' }) })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.message || 'Unable to submit your request.')
      setResult({ status: 'success', message: payload.message, reference: payload.reference })
      form.reset()
    } catch (error) { setResult({ status: 'error', message: error.message, reference: '' }) }
  }
  return <><PageHero number="08" eyebrow="BOOKING REQUEST" title={<>Request your course <em>guidance session.</em></>} description="Tell us which course you are considering and your preferred time. Your request is not a confirmed booking until Mubsa Fin Institute contacts you with availability." /><section className="booking-page"><div className="booking-intro"><p className="eyebrow">HOW IT WORKS</p><h2>A simple next <em>step.</em></h2><ol><li><span>01</span> Choose the course you want to discuss.</li><li><span>02</span> Share your preferred date and time.</li><li><span>03</span> Receive confirmation from the Mubsa Fin Institute team.</li></ol><button className="text-link link-button" onClick={() => go('/courses')}>Review course outlines <Arrow /></button></div><form className="booking-form" onSubmit={submit}><h2>Request a session</h2><div className="booking-form-grid"><label>Full name<input required name="fullName" placeholder="Your full name" /></label><label>Email address<input required name="email" type="email" placeholder="you@example.com" /></label><label>Phone number<input required name="phone" type="tel" placeholder="Your phone number" /></label><label>City (optional)<input name="city" placeholder="Your city" /></label><label>Course<select required name="course" defaultValue={selectedCourse}>{courses.map((c) => <option key={c.name}>{c.name}</option>)}</select></label><label>Preferred date (optional)<input name="preferredDate" type="date" min={bookingMinimumDate} /></label><label>Preferred time (optional)<select name="preferredTime"><option value="">Choose a time</option><option>Morning</option><option>Afternoon</option><option>Evening</option></select></label></div><label>Anything we should know? (optional)<textarea name="message" rows="4" placeholder="Tell us what you would like to discuss." /></label><label className="consent-check"><input required name="consent" type="checkbox" /> I agree that Mubsa Fin Institute may contact me about this request.</label><button className="button primary" disabled={result.status === 'sending'}>{result.status === 'sending' ? 'Submitting…' : 'Submit Booking Request'} <Arrow /></button>{result.status !== 'idle' && <p className={result.status === 'success' ? 'form-note' : 'form-error'}>{result.message}{result.reference && <> Your reference: <strong>{result.reference}</strong>.</>}</p>}</form></section></> }
function ContactBand({ go, title, text, primary, secondary, course, primaryPath }) { return <section className="contact-band"><div><p className="eyebrow">NEXT STEP</p><h2>{title}</h2></div><div><p>{text}</p><div className="contact-band-actions"><button className="button primary" onClick={() => go(primaryPath || (course ? `/contact?course=${encodeURIComponent(course)}` : '/courses'))}>{primary} <Arrow /></button>{secondary && <button className="text-link link-button" onClick={() => go('/contact')}>{secondary} <Arrow /></button>}</div></div></section> }
function GuidancePopup({ open, close, go }) { if (!open) return null; return <div className="guidance-backdrop" role="presentation"><section className="guidance-popup" role="dialog" aria-modal="true" aria-labelledby="guidance-title"><button className="popup-close" onClick={close} aria-label="Close guidance popup">×</button><p className="eyebrow">COURSE GUIDANCE</p><h2 id="guidance-title">Not sure where to <em>begin?</em></h2><p>Choose a course level and request a guidance session. Mubsa Fin Institute will confirm availability with you directly.</p><div className="popup-course-options">{courses.map((course) => <button key={course.slug} onClick={() => { close(); go(`/booking?course=${encodeURIComponent(course.name)}`) }}><span>{course.number}</span><strong>{course.name}</strong><Arrow /></button>)}</div><a className="popup-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp us <Arrow /></a></section></div> }
function SocialRail({ go, compact = false }) { return <div className={compact ? 'footer-social' : 'social-rail'}>{compact && <a href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Chat with Mubsa Fin Institute on WhatsApp" title="WhatsApp"><FaWhatsapp /></a>}{socialItems.map(({ label, icon: Icon }) => <button key={label} onClick={() => go('/contact')} aria-label={`Ask for ${label} details`} title={`${label} details coming soon`}><Icon /></button>)}</div> }
function Footer({ go }) { return <footer><div><Brand go={go} /><p>Market education from foundations to advanced analysis.</p></div><div className="footer-nav"><button onClick={() => go('/')}>Home</button><button onClick={() => go('/courses')}>Courses</button><button onClick={() => go('/testimonials')}>Testimonials</button><button onClick={() => go('/about')}>About</button><button onClick={() => go('/booking')}>Booking</button><button onClick={() => go('/contact')}>Contact</button><button onClick={() => go('/faq')}>FAQ</button></div><div className="footer-contact"><a href="https://MubsaCapital.com">MubsaCapital.com</a><a href={`mailto:${site.email}`}>{site.email}</a><a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a><span>{site.locations}</span><SocialRail go={go} compact /></div><small>© {copyrightYear} {site.name}. Trading and investing involve risk, including possible loss of capital. Course content is educational and does not guarantee profits or replace financial advice based on individual circumstances.</small></footer> }
function PageLoader({ show }) { return <div className={show ? 'route-loader show' : 'route-loader'} aria-hidden="true"><strong>M</strong><span>MUBSAFIN</span><i /></div> }
export default function MubsaApp() {
  const [path, go, isNavigating] = useRoute()
  useAmbientMotion()
  const isInitialLoading = useInitialLoader()
  const [guidanceOpen, setGuidanceOpen] = useState(false)
  const [guidanceSeen, setGuidanceSeen] = useState(false)
  const plain = path.split('?')[0]
  useEffect(() => {
    if (plain !== '/' || guidanceSeen) return undefined
    const timer = window.setTimeout(() => setGuidanceOpen(true), 7000)
    return () => window.clearTimeout(timer)
  }, [plain, guidanceSeen])
  const dismissGuidance = () => { setGuidanceOpen(false); setGuidanceSeen(true) }
  const course = courses.find((c) => plain === `/courses/${c.slug}`)
  const page = course ? <Detail course={course} go={go} /> : plain === '/courses' ? <Courses go={go} /> : plain === '/testimonials' ? <Testimonials go={go} /> : plain === '/about' ? <About go={go} /> : plain === '/faq' ? <FAQ go={go} /> : plain === '/booking' ? <Booking path={path} go={go} /> : plain === '/contact' ? <Contact path={path} /> : <Home go={go} />
  return <main><div className="cursor-glow" aria-hidden="true"><i /><b /></div><PageLoader show={isNavigating || isInitialLoading} /><Header path={path} go={go} /><SocialRail go={go} /><div className="route-view" key={path}>{page}</div><Footer go={go} /><a className="whatsapp-float" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="Chat with Mubsafin on WhatsApp"><FaWhatsapp /><b>WhatsApp</b></a><GuidancePopup open={guidanceOpen} close={dismissGuidance} go={go} /></main>
}
