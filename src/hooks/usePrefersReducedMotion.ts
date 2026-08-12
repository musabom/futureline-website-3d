/**
 * usePrefersReducedMotion — listens to the OS-level setting in real time.
 * WCAG 2.3.3 + vestibular safety. Required for every animated section.
 */
'use client'

import { useEffect, useState } from 'react'

export function usePrefersReducedMotion(): boolean {
  // Lazy initialiser rather than useState(false): on the client the correct
  // value is known before first paint, so a section that renders a static
  // layout under reduced motion does so immediately instead of showing one
  // animated frame first. Still returns false during SSR, so server and
  // client markup match.
  const [prefers, setPrefers] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefers(mq.matches)

    const handler = (e: MediaQueryListEvent) => setPrefers(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return prefers
}
