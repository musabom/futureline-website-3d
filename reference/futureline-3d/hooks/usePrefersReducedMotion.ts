/**
 * usePrefersReducedMotion — listens to the OS-level setting in real time.
 * WCAG 2.3.3 + vestibular safety. Required for every animated section.
 */
'use client'

import { useEffect, useState } from 'react'

export function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState<boolean>(false)

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
