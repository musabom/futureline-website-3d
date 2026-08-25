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
import { usePathname } from 'next/navigation'
import { initLenisGsap, destroyAllScrollTriggers } from '@/lib/lenis-gsap'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { scrollToInitialHash, scrollToHashWhenReady } from '@/lib/scroll'

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()
  const pathname = usePathname()

  // Arriving at /#section from ANOTHER page is a client-side navigation, so
  // this provider never remounts and the mount effect below doesn't re-run —
  // which left header links like "Who we serve" dropping the visitor part-way
  // down the home page instead of on the section. Re-run the anchor scroll
  // whenever the route changes and a hash is present.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.location.hash) return
    scrollToHashWhenReady(window.location.hash)
  }, [pathname])

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
