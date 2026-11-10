import { useEffect, useRef, useState } from 'react'
import { FaCompass, FaChartLine, FaClock, FaArrowRight } from 'react-icons/fa6'

const icons = [FaCompass, FaChartLine, FaClock]

export default function CourseBranches({ courses, go }) {
  const section = useRef(null)
  const [visible, setVisible] = useState(() => !('IntersectionObserver' in window))
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { threshold: 0.12 })
    observer.observe(section.current)
    return () => observer.disconnect()
  }, [])
  return <div ref={section} className={`m-branches ${visible ? 'is-visible' : ''}`}>
    {Array.from({length: Math.ceil(courses.length / 2)}, (_, row) => <div className="m-branch-row" key={row}>
      <div className="m-branch-lines" aria-hidden="true"><span /></div>
      <div className="m-branch-pair">{courses.slice(row * 2, row * 2 + 2).map((course, index) => {
        const Icon = icons[(row * 2 + index) % icons.length]
        const href = `/courses/${course.slug}`
        return <a className="m-branch-card" href={href} key={course.slug} style={{'--branch-delay': `${row * 180 + index * 120}ms`}} onClick={e => { if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); go(href) } }}>
          <span className="m-branch-icon"><Icon aria-hidden="true" /></span><span className="m-branch-copy"><strong>{course.name}</strong><span>{course.description}</span></span><span className="m-branch-arrow"><FaArrowRight aria-hidden="true" /></span>
        </a>
      })}</div>
    </div>)}
  </div>
}
