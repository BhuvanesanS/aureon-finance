import { useEffect, useState } from 'react'
import { FaArrowLeft, FaArrowRight, FaPause, FaPlay, FaQuoteLeft, FaStar } from 'react-icons/fa6'
import './testimonials.css'

function initials(name) {
  return name
    .replace(/^(Mr|Mrs|Miss|Ms)\.?\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

export default function TestimonialsShowcase({ items = [] }) {
  const stories = items.map((item, index) => ({
    ...item,
    id: `${item.name}-${index}`,
    quote: item.quote?.trim() || 'Rated the class easy to understand and thoughtfully structured.'
  }))
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = stories.length

  useEffect(() => {
    if (paused || total < 2) return undefined
    const timer = window.setInterval(() => setActive(current => (current + 1) % total), 6000)
    return () => window.clearInterval(timer)
  }, [paused, total])

  if (!total) return <p className="m-empty">Learner stories will be published with permission. No trading results are guaranteed.</p>

  const story = stories[active]
  const show = offset => setActive(current => (current + offset + total) % total)

  return (
    <section className="m-testimonials-carousel" aria-roledescription="carousel" aria-label="Learner stories">
      <div className="m-testimonial-window" aria-live="polite">
        <article className="m-testimonial-slide" key={story.id}>
          <div className="m-testimonial-topline">
            <span>LEARNER STORY</span>
            <div aria-label={`${story.rating || 5} out of 5 for class clarity`}>
              {Array.from({ length: 5 }, (_, index) => <FaStar key={index} aria-hidden="true" className={index < Number(story.rating || 5) ? 'filled' : ''} />)}
            </div>
          </div>
          <FaQuoteLeft className="m-testimonial-quote" aria-hidden="true" />
          <blockquote>“{story.quote}”</blockquote>
          <footer>
            <span className="m-testimonial-avatar" aria-hidden="true">{initials(story.name)}</span>
            <span><strong>{story.name}</strong>{story.role && <small>{story.role}</small>}</span>
          </footer>
        </article>
      </div>

      {total > 1 && (
        <div className="m-testimonial-controls">
          <button type="button" onClick={() => show(-1)} aria-label="Previous learner story"><FaArrowLeft aria-hidden="true" /></button>
          <span>{active + 1} / {total}</span>
          <button type="button" onClick={() => show(1)} aria-label="Next learner story"><FaArrowRight aria-hidden="true" /></button>
          <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play learner stories' : 'Pause learner stories'}>{paused ? <FaPlay aria-hidden="true" /> : <FaPause aria-hidden="true" />}</button>
        </div>
      )}

      <p className="m-testimonials-disclaimer">
        Real experiences from our aspiring traders who are developing their market knowledge through practical education. Trading involves risk of loss. Course content is strictly educational and does not guarantee profits.
      </p>
    </section>
  )
}
