import { useEffect, useRef, useState } from 'react'
import { FaWhatsapp, FaTelegram, FaInstagram, FaFacebookF, FaYoutube, FaLinkedinIn, FaXTwitter, FaLink, FaXmark, FaArrowUp, FaPaperPlane, FaClock, FaBorderAll, FaCompassDrafting, FaBullseye, FaCircleNotch } from 'react-icons/fa6'

const networks = { instagram: FaInstagram, facebook: FaFacebookF, youtube: FaYoutube, linkedin: FaLinkedinIn, telegram: FaTelegram, x: FaXTwitter, twitter: FaXTwitter }
export function SocialDock({ links, telegramUrl }) {
  const items = [...(telegramUrl ? [{ label: 'Telegram', url: telegramUrl }] : []), ...links]
  if (!items.length) return null
  return <aside className="m-social-dock" aria-label="Follow Mubsa">{items.map(({label,url}) => {
    const key = Object.keys(networks).find(k => label.toLowerCase() === k || (k.length > 1 && label.toLowerCase().includes(k)))
    const Icon = networks[key] || FaLink
    return <a key={label+url} href={url} target="_blank" rel="noreferrer" aria-label={label} title={label}><Icon aria-hidden="true" /></a>
  })}</aside>
}

export function WhatsAppPanel({ url }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const trigger = useRef(null)
  const field = useRef(null)
  const close = () => { setOpen(false); trigger.current?.focus() }
  useEffect(() => { if (open) field.current?.focus() }, [open])
  if (!url) return null
  const destination = new URL(url)
  if (message.trim()) destination.searchParams.set('text', message.trim())
  return <>
    {open && <section className="m-chat" role="dialog" aria-label="Chat with Mubsa on WhatsApp" onKeyDown={e => { if (e.key === 'Escape') close() }}>
      <header><FaWhatsapp /><div><strong>Mubsa Fin Institute</strong><small>Continue the conversation on WhatsApp</small></div><button onClick={close} aria-label="Close WhatsApp chat"><FaXmark /></button></header>
      <div className="m-chat-body"><p>Hello! How can we help you?</p><span>Ask about courses, webinars, or your registration.</span></div>
      <div className="m-chat-compose"><label htmlFor="whatsapp-message">Your message</label><textarea ref={field} id="whatsapp-message" value={message} onChange={e => setMessage(e.target.value)} maxLength={2000} rows={3} placeholder="Type your question…" /><a href={destination.href} target="_blank" rel="noreferrer" className="m-btn">Continue on WhatsApp <FaPaperPlane /></a></div>
    </section>}
    <button ref={trigger} className="m-whatsapp" onClick={() => open ? close() : setOpen(true)} aria-label={open ? 'Close WhatsApp chat' : 'Chat on WhatsApp'} aria-expanded={open}>{open ? <FaXmark /> : <FaWhatsapp />}</button>
  </>
}

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const update = () => setVisible(window.scrollY > 450); update(); window.addEventListener('scroll', update, { passive:true }); return () => window.removeEventListener('scroll', update) }, [])
  return visible && <button className="m-top" aria-label="Back to top" onClick={() => window.scrollTo({top:0, behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'})}><FaArrowUp /></button>
}

const topicAssets = ['time-cycles','square-of-9','natural-ratios','gann-angles']
const topicIcons = [FaClock, FaBorderAll, FaCircleNotch, FaCompassDrafting, FaBullseye]
export function TopicTiles({ topics, open }) {
  return <div className="m-topic-grid">{topics.map(([title,text],i) => {
    const Icon = topicIcons[i]
    return <button className={`m-topic-tile topic-${i}`} key={title} onClick={() => open({type:'topic',title,text})}>
      {topicAssets[i] && <img src={`/reference/${topicAssets[i]}.webp`} alt="" loading="lazy" />}
      <div><h3><Icon aria-hidden="true" />{title}</h3><p>{text}</p></div>
    </button>
  })}</div>
}

export function FeedbackCards({ items }) {
  const [paused,setPaused] = useState(false)
  if (!items.length) return <p className="m-empty">Learner stories will be published with permission. No trading results are guaranteed.</p>
  const rows = items.length > 3 ? [items.filter((_,i)=>i%2===0),items.filter((_,i)=>i%2===1)] : [items]
  return <div className={`m-feedback-stream ${paused ? 'paused' : ''}`}>
    {rows.map((row,index) => <div className={`m-feedback-window ${row.length < 2 ? 'static' : ''}`} key={index}><div className="m-feedback-track">{[0,1].map(copy => <div className="m-feedback-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{row.map((item,i)=><article className="m-feedback-card" key={i}><blockquote>“{item.quote}”</blockquote><div><span className="m-avatar" aria-hidden="true">{item.name.slice(0,1)}</span><p><strong>{item.name}</strong>{item.role && <small>{item.role}</small>}</p></div></article>)}</div>)}</div></div>)}
    {items.length > 1 && <button className="m-text" onClick={()=>setPaused(!paused)}>{paused ? 'Play' : 'Pause'} learner stories</button>}
  </div>
}
