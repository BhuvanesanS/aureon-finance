import { useState } from 'react'
import { FaArrowRight, FaTelegram, FaWhatsapp } from 'react-icons/fa6'

export function AnnouncementTicker({ webinar, telegramUrl, community, register, slides }) {
  const [paused, setPaused] = useState(false)
  const date = webinar && new Date(webinar.startsAt).toLocaleString('en-IN', { dateStyle:'medium', timeStyle:'short', timeZone:webinar.timeZone || 'Asia/Kolkata' })
  const announcements = [
    webinar ? `Upcoming webinar: ${webinar.title} · ${date} · ${webinar.timeZone || 'Asia/Kolkata'}` : 'Upcoming webinar: new date to be announced. Request an update from our team.',
    'Join our free Telegram channel for webinar announcements and market learning updates.',
    ...slides.filter(item => item.type !== 'session' && !item.id.startsWith('course-')).map(item => item.title),
  ]
  return <aside className="m-ticker" aria-label="Webinar and Telegram announcements"><div className={`m-ticker-window ${paused ? 'paused' : ''}`}><div className="m-ticker-track">{[false,true].map(duplicate => <div className="m-ticker-group" key={String(duplicate)} aria-hidden={duplicate || undefined}>{announcements.map(text => <span key={text}>{text}</span>)}</div>)}</div></div><div className="m-ticker-actions"><button className="m-text" onClick={register}>{webinar?.ctaLabel || 'Webinar details'} <FaArrowRight /></button>{telegramUrl ? <a className="m-text" href={telegramUrl} target="_blank" rel="noreferrer"><FaTelegram /> Free Telegram channel</a> : <button className="m-text" onClick={community}><FaTelegram /> Free Telegram channel</button>}<button className="m-icon" aria-label={paused ? 'Resume scrolling announcements' : 'Pause scrolling announcements'} onClick={() => setPaused(!paused)}>{paused ? '▶' : 'Ⅱ'}</button></div></aside>
}

export function WebinarPanel({ webinar, content, whatsappUrl, children }) {
  return <><p className="m-kicker">MUBSA FIN INSTITUTE · LIVE WEBINAR</p><h2>{webinar?.title || content.popupTitle}</h2>{webinar ? <><p>{webinar.description}</p><p className="m-gold">{new Date(webinar.startsAt).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short',timeZone:webinar.timeZone || 'Asia/Kolkata'})} · {webinar.timeZone || 'Asia/Kolkata'}<br />{webinar.durationMinutes} minutes{webinar.speaker && <> · {webinar.speaker}</>}</p></> : <p>{content.popupText}<br /><br />No webinar date is published yet. Leave your details to request an update; the team will confirm the next session.</p>}{children}{webinar?.registrationUrl && <a className="m-text" href={webinar.registrationUrl} target="_blank" rel="noreferrer">{webinar.ctaLabel || content.registrationLabel} on the event page <FaArrowRight /></a>}{whatsappUrl && <a className="m-text" href={whatsappUrl} target="_blank" rel="noreferrer"><FaWhatsapp /> WhatsApp us</a>}</>
}

