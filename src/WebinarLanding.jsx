import { useEffect, useState } from 'react'
import { FaCheck, FaChartLine, FaClock, FaCompass, FaShieldHalved, FaBookOpen, FaUsers } from 'react-icons/fa6'
import './webinar-landing.css'

function Countdown({ startsAt }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer) }, [])
  const seconds = Math.max(0, Math.floor((Date.parse(startsAt) - now) / 1000))
  if (!Number.isFinite(seconds) || seconds <= 0) return null
  const units = [['Days', Math.floor(seconds / 86400)], ['Hours', Math.floor(seconds / 3600) % 24], ['Minutes', Math.floor(seconds / 60) % 60], ['Seconds', seconds % 60]]
  return <div className="wl-countdown" aria-label="Time until the webinar starts"><span>Webinar starts in</span><div aria-hidden="true">{units.map(([label,n]) => <span key={label}><strong>{String(n).padStart(2,'0')}</strong><small>{label}</small></span>)}</div></div>
}

export default function WebinarLanding({ webinar, content, register }) {
  const date = webinar && new Date(webinar.startsAt).toLocaleString('en-IN', { dateStyle:'full', timeStyle:'short', timeZone:webinar.timeZone || 'Asia/Kolkata' })
  const topics = [
    [FaChartLine,'Reading price charts','Explore market structure, chart levels, and price behaviour.'],
    [FaClock,'Time and market cycles','Study how time and recurring intervals can be used in analysis.'],
    [FaCompass,'Building a process','Organise your observations and develop a plan before acting.'],
    [FaShieldHalved,'Risk awareness','Consider position size, invalidation, and potential loss.'],
    [FaBookOpen,'Learning with context','Connect foundational concepts with practical chart examples.'],
    [FaUsers,'Learning together','Bring your questions and discover your next learning step.'],
  ]
  return <div className="wl-page">
    <div className="wl-top"><a href="/" className="wl-brand">M <span>MUBSA<small>FIN INSTITUTE</small></span></a>{webinar ? <Countdown startsAt={webinar.startsAt} /> : <span className="wl-top-note">Next webinar date to be announced</span>}<button className="m-btn" onClick={register}>{webinar ? (webinar.ctaLabel || content.registrationLabel || 'Register now') : 'Request an update'}</button></div>
    <section className="wl-hero"><p className="wl-eyebrow">FREE LIVE WEBINAR</p><p className="wl-intro">For learners ready to understand the markets with more clarity</p><h1>{webinar?.title || 'Learn to study markets with a structured approach'}</h1><p className="wl-subtitle">Understand charts, time, and risk <span>·</span> Build your own process</p><div className="wl-benefits"><div><FaCheck /><p><strong>Explore different markets</strong><br />Learn concepts that can be studied across instruments.</p></div><div><FaCheck /><p><strong>Designed for your learning journey</strong><br />Build knowledge from the fundamentals onward.</p></div></div>
      <div className="wl-introduction"><div className="wl-mentor"><img src="/client-founder.jpg" alt="Mubarak Ahmad, founder of Mubsa Fin Institute" /><div><small>YOUR MENTOR</small><strong>{webinar?.speaker || 'Mubarak Ahmad'}</strong><span>Mubsa Fin Institute</span></div></div><div className="wl-highlights"><h2>{webinar ? 'About this live session' : 'What you can explore'}</h2><p>{webinar?.description || 'Join Mubsa Fin Institute to explore market concepts, chart analysis, and a more considered approach to trading.'}</p><ul><li>Understand market structure and price charts</li><li>Explore the relationship between time and price</li><li>Consider risk before making decisions</li><li>Develop a repeatable learning process</li></ul>{webinar ? <p className="wl-date"><strong>{date}</strong><br />{webinar.timeZone || 'Asia/Kolkata'} · {webinar.durationMinutes} minutes</p> : <p className="wl-date">The next session date will be announced soon. Request an update below.</p>}<button className="m-btn wl-cta" onClick={register}>{webinar ? (webinar.ctaLabel || content.registrationLabel) : 'Request webinar updates'} <small>{webinar ? 'Reserve your place' : 'Be notified about the next session'}</small></button></div></div>
    </section>
    <section className="wl-section wl-tone"><p className="wl-eyebrow">YOUR LEARNING JOURNEY</p><h2>Does this feel familiar?</h2><p>Markets can be difficult to follow when charts, timeframes, and terminology are unfamiliar. A structured approach gives you a place to begin.</p><div className="wl-situations">{['You want a clearer way to read charts','You are unsure how time and price relate','You want to develop a plan before a trade','You want to understand risk and review your decisions'].map(item=><div key={item}><FaCheck />{item}</div>)}</div><button className="m-btn wl-cta" onClick={register}>{webinar ? 'Reserve my place' : 'Request an update'}</button></section>
    <section className="wl-section"><p className="wl-eyebrow">WHAT YOU CAN LEARN</p><h2>Inside the live webinar</h2><div className="wl-topics">{topics.map(([Icon,title,description])=><article key={title}><Icon /><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <section className="wl-section wl-tone wl-coach"><img src="/client-portrait.jpg" alt="Mubarak Ahmad" loading="lazy" /><div><p className="wl-eyebrow">MEET YOUR MENTOR</p><h2>Mubarak Ahmad</h2><p>Founder & Academic Director, Mubsa Fin Institute</p><p>A share-market educator based in Dubai, Mubarak emphasises preparation, patience, and risk awareness. His mission is to help learners build a stronger understanding of markets through structured education and consistent practice.</p><button className="m-btn" onClick={register}>{webinar ? 'Register for the webinar' : 'Request webinar updates'}</button></div></section>
    {content.testimonials.length > 0 && <section className="wl-section"><p className="wl-eyebrow">LEARNER VOICES</p><h2>What our learners say</h2><div className="wl-topics">{content.testimonials.map((item,i)=><article key={i}><p>“{item.quote}”</p><strong>{item.name}</strong>{item.role && <p>{item.role}</p>}</article>)}</div></section>}
    <section className="wl-section wl-faq"><p className="wl-eyebrow">HELP CENTER</p><h2>Frequently asked questions</h2>{content.faqs.map((faq,i)=><details key={i}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}<button className="m-btn wl-cta" onClick={register}>{webinar ? 'Register for the webinar' : 'Request webinar updates'}</button></section>
    <section className="wl-disclaimer"><h2>Educational information</h2><p>Trading and investing involve risk, including loss of capital. This webinar is for education and does not guarantee profits or provide personalised investment advice.</p></section>
    <div className="wl-sticky"><span>Build your market understanding with Mubsa</span><button className="m-btn" onClick={register}>{webinar ? (webinar.ctaLabel || content.registrationLabel) : 'Request an update'}</button></div>
  </div>
}
