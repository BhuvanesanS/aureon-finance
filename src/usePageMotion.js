import { useEffect } from 'react'

// Animate on entry without hiding content if JS, observers, or motion are disabled.
export function usePageMotion(path) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches || !('IntersectionObserver' in window)) return
    const animations = new Set()
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        observer.unobserve(entry.target)
        const animation = entry.target.animate([
          { opacity: 0, transform: 'translateY(28px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 650, easing: 'cubic-bezier(.2,.75,.25,1)' })
        animations.add(animation)
        animation.onfinish = () => animations.delete(animation)
      }
    }, { threshold: .08 })
    document.querySelectorAll('.m-heading,.m-intro>div,.m-course-link,.m-topic-tile,.m-team>div,.m-gallery>button').forEach(el => observer.observe(el))
    const cancel = () => { if (reduced.matches) { observer.disconnect(); animations.forEach(a => a.cancel()) } }
    reduced.addEventListener('change', cancel)
    return () => { observer.disconnect(); animations.forEach(a => a.cancel()); reduced.removeEventListener('change', cancel) }
  }, [path])
}

