import { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa6'
import './webinar-landing.css'

function Countdown({ startsAt }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])
  const seconds = Math.max(0, Math.floor((Date.parse(startsAt) - now) / 1000))
  if (!Number.isFinite(seconds) || seconds <= 0) return null
  const units = [
    ['Days', Math.floor(seconds / 86400)],
    ['Hours', Math.floor(seconds / 3600) % 24],
    ['Minutes', Math.floor(seconds / 60) % 60],
    ['Seconds', seconds % 60],
  ]
  return (
    <div className="wl-countdown" aria-label="Time until the webinar starts">
      <span>Webinar starts in</span>
      <div aria-hidden="true">
        {units.map(([label, n]) => (
          <span key={label}>
            <strong>{String(n).padStart(2, '0')}</strong>
            <small>{label}</small>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function WebinarLanding({ webinar, register, content }) {
  const date =
    webinar &&
    new Date(webinar.startsAt).toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: webinar.timeZone || 'Asia/Kolkata',
    })
  const ctaLabel = webinar?.ctaLabel || content?.registrationLabel || 'REGISTER TO CLAIM YOUR SLOT'

  return (
    <div className="wl-page">
      <div className="wl-top">
        <a href="/" className="wl-brand">
          <img
            src="/mubsa-logo.jpg"
            alt="Mubsa Fin Institute"
            style={{ height: '34px', width: 'auto', borderRadius: '4px', verticalAlign: 'middle' }}
          />
        </a>
        {webinar ? <Countdown startsAt={webinar.startsAt} /> : <span className="wl-top-note">Your first step on Market DNA</span>}
        <button className="m-btn" onClick={register}>
          YES, I’M IN
        </button>
      </div>

      <section className="wl-hero">
        <p className="wl-intro">For learners ready to understand the markets with more clarity</p>
        <h1>Learn the market. Build a structured approach.</h1>

        <div className="wl-benefits">
          <div>
            <FaCheck />
            <p>
              <strong>Do I need prior trading experience to join?</strong>
              <br />
              Not at all. The session is open to everyone and it’s specially designed for BEGINNERS, we mean it.
            </p>
          </div>
          <div>
            <FaCheck />
            <p>
              <strong>How can I register for the webinar?</strong>
              <br />
              Simply complete the registration form on our website to reserve your place.
            </p>
          </div>
        </div>

        <div className="wl-introduction">
          <div className="wl-mentor">
            <img src="/client-founder.jpg" alt="Mubarak Ahmad, founder of Mubsa Fin Institute" />
            <div>
              <strong>Mubarak Ahmad</strong>
              <span>Founder & Academic Director.</span>
            </div>
          </div>
          <div className="wl-highlights">
            <h2>What you can explore</h2>
            <p>
              Join Mubsa Fin Institute to explore market concepts, chart analysis, and a more considered approach to trading.
            </p>
            <ul>
              <li>Understand market structure and price charts</li>
              <li>Explore the relationship between time and price</li>
              <li>Consider risk before making decisions</li>
              <li>Develop a repeatable learning process</li>
            </ul>
            {webinar ? (
              <p className="wl-date">
                <strong>{date}</strong>
                <br />
                {webinar.timeZone || 'Asia/Kolkata'} · {webinar.durationMinutes} minutes
              </p>
            ) : (
              <p className="wl-date">The next session date will be announced soon. Request an update below.</p>
            )}
            <button className="m-btn wl-cta" onClick={register}>
              {ctaLabel}
            </button>
          </div>
        </div>
      </section>

      <section className="wl-disclaimer">
        <h2>Educational information</h2>
        <p>
          Trading and investing involve risk, including loss of capital. This webinar is for education and does not
          guarantee profits or provide personalised investment advice.
        </p>
      </section>

      <div className="wl-sticky">
        <span>Build your market understanding with Mubsa</span>
        <button className="m-btn" onClick={register}>
          {ctaLabel}
        </button>
      </div>
    </div>
  )
}
