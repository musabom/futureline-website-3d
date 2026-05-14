/**
 * SmoothScrollProvider — mount once at the app root.
 *
 * Wrap children in (public)/layout.tsx:
 *   <SmoothScrollProvider>{children}</SmoothScrollProvider>
 *
 * Honors prefers-reduced-motion: when reduced, Lenis is skipped entirely and
 * native scroll takes over. This preserves keyboard cadence and respects
 * WCAG 2.3.3 without any extra branching downstream.
 */
'use client'

import { useEffect, type ReactNode } from 'react'
import { initLenisGsap, destroyAllScrollTriggers } from '@/lib/lenis-gsap'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = initLenisGsap()

    return () => {
      lenis.destroy()
      destroyAllScrollTriggers()
    }
  }, [reduced])

  return <>{children}</>
}
