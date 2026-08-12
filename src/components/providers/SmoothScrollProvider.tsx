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
import { scrollToInitialHash } from '@/lib/scroll'

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) {
      // Native scroll still needs help landing on a cold-load anchor once
      // pinned sections have been measured.
      scrollToInitialHash()
      return
    }

    const lenis = initLenisGsap()
    // Published so same-page anchors can drive Lenis directly. The instance
    // was previously discarded, which left hash links fighting the smooth
    // scroll instead of using it (see src/lib/scroll.ts).
    window.__flLenis = lenis

    scrollToInitialHash()

    return () => {
      delete window.__flLenis
      lenis.destroy()
      destroyAllScrollTriggers()
    }
  }, [reduced])

  return <>{children}</>
}
