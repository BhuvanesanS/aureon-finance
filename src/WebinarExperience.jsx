import { useState } from 'react'
import { FaArrowRight, FaTelegram } from 'react-icons/fa6'

export function AnnouncementTicker({ webinar, telegramUrl = 'https://t.me/mubsafin', register, slides = [], content }) {
  const [paused, setPaused] = useState(false)
  const date = webinar && new Date(webinar.startsAt).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short', timeZone:webinar.timeZone || 'Asia/Kolkata' })
  const announcements = [
    webinar ? `Join our upcoming MARKET DNA: ${webinar.title} · ${date}` : (content?.popupTitle ? `Join our upcoming: ${content.popupTitle}` : 'Join our upcoming MARKET DNA'),
    'Join our OPEN 5% CLUB on Telegram.',
    ...slides.filter(item => item.type !== 'session' && !item.id.startsWith('course-')).map(item => item.title),
  ]
  const openTelegram = () => {
    const url = telegramUrl || 'https://t.me/mubsafin'
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  return (
    <aside className="m-ticker" aria-label="Webinar and Telegram announcements">
      <div className={`m-ticker-window ${paused ? 'paused' : ''}`}>
        <div className="m-ticker-track">
          {[false, true].map(duplicate => (
            <div className="m-ticker-group" key={String(duplicate)} aria-hidden={duplicate || undefined}>
              {announcements.map((text, idx) => (
                <span key={`${text}-${idx}`}>{text}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="m-ticker-actions">
        <button className="m-text" onClick={register}>
          Webinar details <FaArrowRight />
        </button>
        <button className="m-text" onClick={openTelegram}>
          <FaTelegram /> {content?.communityLabel || 'The 5% CLUB'}
        </button>
        <button
          className="m-icon"
          aria-label={paused ? 'Resume scrolling announcements' : 'Pause scrolling announcements'}
          onClick={() => setPaused(!paused)}
        >
          {paused ? '▶' : 'Ⅱ'}
        </button>
      </div>
    </aside>
  )
}

export function WebinarPanel({ webinar, content, children }) {
  return (
    <>
      <p className="m-kicker">MUBSA FIN INSTITUTE · LIVE WEBINAR</p>
      <h2>{webinar?.title || content?.popupTitle || 'Join our upcoming Market DNA'}</h2>
      {webinar ? (
        <>
          <p>{webinar.description}</p>
          <p className="m-gold">
            {new Date(webinar.startsAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: webinar.timeZone || 'Asia/Kolkata' })} · {webinar.timeZone || 'Asia/Kolkata'}
            <br />
            {webinar.durationMinutes} minutes{webinar.speaker && <> · {webinar.speaker}</>}
          </p>
        </>
      ) : (
        <>
          <p className="m-gold">Date and time</p>
          <p>{content?.popupText || 'Enter your details below to register for our upcoming MARKET DNA'}</p>
        </>
      )}
      {children}
      {webinar?.registrationUrl && (
        <a className="m-text" href={webinar.registrationUrl} target="_blank" rel="noreferrer">
          {webinar.ctaLabel || content?.registrationLabel || 'Register'} on the event page <FaArrowRight />
        </a>
      )}
    </>
  )
}
