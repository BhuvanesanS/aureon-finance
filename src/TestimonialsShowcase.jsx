import { FaCircleCheck, FaQuoteLeft, FaStar } from 'react-icons/fa6'
import './testimonials.css'

const avatarTones = ['amber', 'violet', 'pink', 'blue', 'teal', 'orange']

function initials(name) {
  return name
    .replace(/^(Mr|Mrs|Miss|Ms)\.?\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

function TestimonialCard({ story, index }) {
  const rating = Math.min(Math.max(Number(story.rating) || 5, 0), 5)

  return (
    <article className="m-testimonial-card" aria-label={`Learner story from ${story.name}`}>
      <FaQuoteLeft className="m-testimonial-quote" aria-hidden="true" />
      <div className="m-testimonial-rating" aria-label={`${rating} out of 5 for class clarity`}>
        {Array.from({ length: 5 }, (_, star) => <FaStar key={star} aria-hidden="true" className={star < rating ? 'filled' : ''} />)}
      </div>
      <blockquote>“{story.quote}”</blockquote>
      <footer>
        <span className={`m-testimonial-avatar tone-${avatarTones[index % avatarTones.length]}`} aria-hidden="true">
          {initials(story.name)}
          <FaCircleCheck />
        </span>
        <span className="m-testimonial-person">
          <strong>{story.name}</strong>
          {story.role && <small>{story.role}</small>}
        </span>
        <span className="m-testimonial-badge">Course attendee</span>
      </footer>
    </article>
  )
}

export default function TestimonialsShowcase({ items = [] }) {
  const stories = items.map((item, index) => ({
    ...item,
    id: `${item.name}-${index}`,
    quote: item.quote?.trim() || 'Rated the class easy to understand and thoughtfully structured.'
  }))
  if (!stories.length) return <p className="m-empty">Learner stories will be published with permission. No trading results are guaranteed.</p>

  const rows = stories.length > 3
    ? [stories.filter((_, index) => index % 2 === 0), stories.filter((_, index) => index % 2 === 1)]
    : [stories]

  return (
    <section className="m-testimonials-carousel" aria-roledescription="carousel" aria-label="Learner stories">
      <div className="m-testimonial-marquees">
        {rows.map((row, rowIndex) => (
          <div className={`m-testimonial-window ${row.length < 2 ? 'is-static' : ''}`} key={rowIndex}>
            <div className={`m-testimonial-track ${rowIndex % 2 ? 'is-reversed' : ''}`}>
              {[0, 1].map(copy => (
                <div className="m-testimonial-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
                  {row.map((story, index) => <TestimonialCard key={`${story.id}-${copy}`} story={story} index={index + rowIndex * 3} />)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <aside className="m-testimonials-disclaimer" role="note" aria-label="Educational notice">
        <strong>Educational notice</strong>
        <ul>
          <li>Real experiences from our aspiring traders who are developing their market knowledge through practical education.</li>
          <li>Trading involves risk of loss.</li>
          <li>Course content is strictly educational and does not guarantee profits.</li>
        </ul>
      </aside>
    </section>
  )
}
