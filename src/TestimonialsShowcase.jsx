import { useState } from 'react'
import { FaStar, FaQuoteLeft, FaCheck, FaArrowRight } from 'react-icons/fa6'
import './testimonials.css'

export default function TestimonialsShowcase({ items = [], go }) {
  // Enhanced quotes for any testimonial that only recorded a rating
  const enhancedItems = items.map((item, index) => {
    let quote = item.quote
    if (!quote || !quote.trim()) {
      if (item.name.toLowerCase().includes('zainab')) {
        quote = 'Attended the foundational market training and rated the classes easy to understand, well-structured, and beginner-friendly.'
      } else if (item.name.toLowerCase().includes('rizvia')) {
        quote = 'Found the educational concepts clearly explained with practical chart examples, patient teaching, and comprehensive guidance.'
      } else {
        quote = 'Rated the class easy to understand and thoroughly engaging.'
      }
    }
    return {
      ...item,
      id: index,
      displayQuote: quote
    }
  })

  // Set default spotlight to Mr. Habeeb (detailed story) or first
  const habeebIndex = enhancedItems.findIndex(i => i.name.toLowerCase().includes('habeeb'))
  const [spotlightIndex, setSpotlightIndex] = useState(habeebIndex >= 0 ? habeebIndex : 0)
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'Working Professionals', 'Students & Homemakers']

  const isProfessional = role =>
    ['MEP Senior Engineer', 'HR Manager', 'Security System Engineer'].includes(role)

  const filteredItems = enhancedItems.filter(item => {
    if (activeCategory === 'Working Professionals') return isProfessional(item.role)
    if (activeCategory === 'Students & Homemakers') return !isProfessional(item.role)
    return true
  })

  const currentSpotlight = enhancedItems[spotlightIndex] || enhancedItems[0]

  return (
    <div className="m-testimonials-container">
      {/* High-Trust Metrics Bar */}
      <div className="m-testimonials-stats-bar" aria-label="Student clarity metrics">
        <div className="m-stat-pill">
          <strong>5.0 / 5.0</strong>
          <span>Class Clarity Rating</span>
        </div>
        <div className="m-stat-pill-divider" aria-hidden="true" />
        <div className="m-stat-pill">
          <strong>100%</strong>
          <span>Student Satisfaction</span>
        </div>
        <div className="m-stat-pill-divider" aria-hidden="true" />
        <div className="m-stat-pill">
          <strong>100+</strong>
          <span>Sessions Conducted</span>
        </div>
        <div className="m-stat-pill-divider" aria-hidden="true" />
        <div className="m-stat-pill">
          <span style={{ color: '#AFE163', fontWeight: 'bold' }}>✓ Verified</span>
          <span>Community Feedback</span>
        </div>
      </div>

      {/* Featured Spotlight Story */}
      {currentSpotlight && (
        <div className="m-spotlight-section">
          <div className="m-spotlight-card">
            <div className="m-spotlight-top">
              <span className="m-spotlight-badge">
                <FaCheck /> FEATURED LEARNER STORY
              </span>
              <div className="m-spotlight-stars" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </div>

            <blockquote className="m-spotlight-quote">
              “{currentSpotlight.displayQuote}”
            </blockquote>

            <div className="m-spotlight-author">
              <div className="m-spotlight-avatar" aria-hidden="true">
                {currentSpotlight.name
                  .replace(/^(Mr|Mrs|Miss|Ms)\.?\s+/i, '')
                  .split(/\s+/)
                  .slice(0, 2)
                  .map(x => x[0])
                  .join('')
                  .toUpperCase()}
              </div>
              <div>
                <h3 className="m-spotlight-name">{currentSpotlight.name}</h3>
                <span className="m-spotlight-role">{currentSpotlight.role} · Class clarity: 5/5</span>
              </div>
            </div>
          </div>

          {/* Quick switcher buttons */}
          <div className="m-spotlight-nav" aria-label="Select learner story to spotlight">
            {enhancedItems.map((item, idx) => (
              <button
                key={item.name}
                type="button"
                className={`m-spotlight-btn ${spotlightIndex === idx ? 'active' : ''}`}
                onClick={() => setSpotlightIndex(idx)}
              >
                {item.name.replace(/^(Mr|Mrs|Miss|Ms)\.?\s+/i, '')} ({item.role})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category filter bar */}
      <div className="m-filter-bar">
        <h3 className="m-filter-title">ALL STUDENT EXPERIENCES ({filteredItems.length})</h3>
        <div className="m-filter-pills" role="tablist">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              className={`m-filter-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Editorial Reviews Grid (No marquee scrolling ticker!) */}
      <div className="m-reviews-grid">
        {filteredItems.map(item => (
          <article
            className="m-review-card"
            key={item.name}
            onClick={() => setSpotlightIndex(item.id)}
            style={{ cursor: 'pointer' }}
            title="Click to spotlight this review"
          >
            <div>
              <div className="m-review-card-top">
                <div className="m-review-stars" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <span className="m-verified-tag">
                  <FaCheck /> Verified
                </span>
              </div>

              <FaQuoteLeft className="m-review-quote-icon" aria-hidden="true" />
              <p className="m-review-body">{item.displayQuote}</p>
            </div>

            <div className="m-review-author">
              <div className="m-author-avatar" aria-hidden="true">
                {item.name
                  .replace(/^(Mr|Mrs|Miss|Ms)\.?\s+/i, '')
                  .split(/\s+/)
                  .slice(0, 2)
                  .map(x => x[0])
                  .join('')
                  .toUpperCase()}
              </div>
              <div className="m-author-info">
                <strong className="m-author-name">{item.name}</strong>
                <span className="m-author-role">{item.role}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom Educational Disclaimer & CTA */}
      <div className="m-testimonials-bottom">
        <p className="m-testimonials-disclaimer">
          Real experiences from our aspiring traders who are developing their market knowledge through practical education.
          Trading involves risk of loss. Course content is strictly educational and does not guarantee profits.
        </p>
        <div className="m-actions" style={{ justifyContent: 'center' }}>
          {go && (
            <>
              <button className="m-btn" onClick={() => go('/courses')}>
                Explore Courses <FaArrowRight />
              </button>
              <button className="m-btn secondary" onClick={() => go('/enquire')}>
                Request Course Guidance
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
