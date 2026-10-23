import { useEffect, useState } from 'react'
import './App.css'

const services = [
  ['01', 'Market education', 'Structured learning paths that turn complex market concepts into a disciplined, repeatable process.'],
  ['02', 'Research perspective', 'Clear, decision-ready market context designed to help you ask better questions.'],
  ['03', 'Risk framework', 'Principles for sizing, planning, and protecting capital before a position is ever opened.'],
]

const insights = [
  { type: 'Perspective', title: 'A calmer way to read market noise', date: 'Featured insight' },
  { type: 'Framework', title: 'Build a trading process before your next decision', date: 'Learning note' },
  { type: 'Guide', title: 'Risk management is a habit, not a headline', date: 'Risk series' },
]
const COPYRIGHT_YEAR = new Date().getFullYear()

function Arrow() { return <span aria-hidden="true" className="arrow">↗</span> }

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeService, setActiveService] = useState(0)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => setNotice(''), 3500)
    return () => window.clearTimeout(timer)
  }, [notice])

  const showNotice = (message) => {
    setNotice(message)
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Aureon Finance home"><span className="brand-mark"><i /><b /></span><span>AUREON<span>°</span></span></a>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation"><span /><span /></button>
        <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Primary navigation">
          <a href="#approach" onClick={() => setMenuOpen(false)}>Approach</a><a href="#solutions" onClick={() => setMenuOpen(false)}>Solutions</a><a href="#insights" onClick={() => setMenuOpen(false)}>Insights</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        </nav>
        <button className="header-cta" type="button" onClick={() => showNotice('Tell us what you want to explore.')}>Start a conversation <Arrow /></button>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" /><div className="aurora aurora-one" aria-hidden="true" /><div className="aurora aurora-two" aria-hidden="true" />
        <div className="hero-copy reveal"><p className="eyebrow"><span /> CLARITY FOR COMPLEX MARKETS</p><h1>Find your <em>edge</em><br />in the signal.</h1><p className="hero-description">Aureon Finance is a modern education and research platform for people who want to approach markets with structure, patience, and perspective.</p><div className="hero-actions"><button className="button primary" type="button" onClick={() => showNotice('Choose the conversation that suits your next step.')}>Explore our approach <Arrow /></button><a className="text-link" href="#solutions">See what we do <span>↓</span></a></div></div>
        <div className="orbital-wrap" aria-label="Animated abstract market-data visual"><div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="orbit orbit-c" /><div className="data-orb"><div className="orb-shine" /><span className="orb-label label-one">DISCIPLINE</span><span className="orb-label label-two">CONTEXT</span><span className="orb-label label-three">RISK</span><div className="orb-core"><small>MARKET</small><strong>01</strong><i>•</i></div></div><div className="live-card"><span className="pulse" /> Live perspective<br /><b>Designed for thoughtful decisions</b></div></div>
        <div className="hero-foot"><span>SCROLL TO EXPLORE</span><i /><span>FINANCE, REFRAMED</span></div>
      </section>

      <section className="statement" id="approach"><p className="eyebrow">01 / OUR POINT OF VIEW</p><div className="statement-layout"><h2>Better decisions start with a better <em>frame.</em></h2><div><p>Markets move quickly. Your process does not have to. We simplify the information landscape into principles you can return to—before, during, and after the market moves.</p><a href="#solutions" className="text-link">Explore the Aureon method <Arrow /></a></div></div></section>

      <section className="solutions" id="solutions"><div className="section-heading"><div><p className="eyebrow">02 / WHAT WE BUILD</p><h2>Built for the<br /><em>long game.</em></h2></div><p>Each area is designed to make financial learning feel more deliberate, more legible, and easier to carry into real decisions.</p></div><div className="service-list">{services.map(([number, title, body], index) => <button className={activeService === index ? 'service active' : 'service'} type="button" onClick={() => setActiveService(index)} key={title}><span className="service-number">{number}</span><span className="service-title">{title}</span><span className="service-body">{body}</span><Arrow /></button>)}</div></section>

      <section className="metric-band" aria-label="Aureon principles"><div><strong>01</strong><span>Focus before frequency</span></div><div><strong>02</strong><span>Process before prediction</span></div><div><strong>03</strong><span>Context before conviction</span></div></section>

      <section className="canvas-section" id="about"><div className="canvas-copy"><p className="eyebrow">03 / A DIFFERENT SIGNAL</p><h2>Progress is not a prediction.<br />It is a <em>practice.</em></h2><p>We are creating a space for grounded financial thinking: less noise, more signal; fewer shortcuts, stronger foundations.</p><button className="button ghost" type="button" onClick={() => showNotice('Our team will help you choose the right starting point.')}>Meet the platform <Arrow /></button></div><div className="chart-scene" aria-hidden="true"><div className="chart-grid" /><svg viewBox="0 0 600 330" role="presentation"><path className="chart-line" d="M0 250 C60 245 65 186 115 205 S175 140 223 168 S290 100 337 125 S405 175 445 96 S533 100 600 35" /><path className="chart-area" d="M0 250 C60 245 65 186 115 205 S175 140 223 168 S290 100 337 125 S405 175 445 96 S533 100 600 35 V330 H0Z" /></svg><span className="chart-tag">AUREON<br /><b>Signal / 24</b></span></div></section>

      <section className="insights" id="insights"><div className="section-heading"><div><p className="eyebrow">04 / FIELD NOTES</p><h2>Ideas worth<br /><em>returning to.</em></h2></div><a className="text-link" href="#contact">View all insights <Arrow /></a></div><div className="insight-grid">{insights.map((item, index) => <article className={`insight insight-${index + 1}`} key={item.title}><div className="insight-art"><span>{String(index + 1).padStart(2, '0')}</span><i /></div><p>{item.type} <span>—</span> {item.date}</p><h3>{item.title}</h3><a href="#contact" aria-label={`Read ${item.title}`}><Arrow /></a></article>)}</div></section>

      <section className="contact" id="contact"><div className="contact-glow" /><div><p className="eyebrow">05 / NEXT STEP</p><h2>Make space for<br />a better <em>question.</em></h2></div><div className="contact-action"><p>Whether you are building your market foundation or looking for a clearer research perspective, we would like to hear what matters to you.</p><a className="button primary" href="mailto:hello@aureonfinance.example?subject=Conversation%20with%20Aureon%20Finance">Start a conversation <Arrow /></a><small>Illustrative website concept — replace this email before launch.</small></div></section>

      <footer><a className="brand" href="#top"><span className="brand-mark"><i /><b /></span><span>AUREON<span>°</span></span></a><p>Original concept for a trading and finance education business. Nothing on this website is investment advice or a promise of results.</p><div><a href="#approach">Approach</a><a href="#solutions">Solutions</a><a href="#insights">Insights</a></div><small>© {COPYRIGHT_YEAR} Aureon Finance. All rights reserved.</small></footer>
      {notice && <div className="toast" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Close">×</button></div>}
    </main>
  )
}

export default App
