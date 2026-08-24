/**
 * Scroll helpers for same-page anchors.
 *
 * Native anchor jumps are unreliable here for three reasons: Lenis owns the
 * scroll position, globals.css sets `scroll-behavior: auto !important` while
 * Lenis is active, and ScrollTrigger pins shift document offsets so an anchor
 * resolved before a refresh lands in the wrong place.
 *
 * The Lenis instance is published by SmoothScrollProvider so callers can drive
 * it directly instead of fighting it.
 */
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type LenisLike = {
  scrollTo: (target: string | number | HTMLElement, opts?: Record<string, unknown>) => void
}

declare global {
  interface Window {
    __flLenis?: LenisLike
  }
}

/** Height of the sticky header — anchors must clear it. */
export const HEADER_OFFSET = -64

export function scrollToHash(hash: string, { offset = HEADER_OFFSET } = {}) {
  if (typeof window === 'undefined') return
  const id = hash.startsWith('#') ? hash.slice(1) : hash
  const el = document.getElementById(id)
  if (!el) return

  // Pins change offsets; make sure measurements are current before jumping.
  ScrollTrigger.refresh()

  const lenis = window.__flLenis
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.1 })
    return
  }
  // Reduced motion (Lenis never initialised) or a failure — native fallback.
  const top = el.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top, behavior: 'auto' })
}

/** Handles a cold load of /#section, once layout has settled. */
export function scrollToInitialHash() {
  if (typeof window === 'undefined' || !window.location.hash) return
  const hash = window.location.hash
  // Two frames: one for layout, one for ScrollTrigger's pin spacers.
  requestAnimationFrame(() => requestAnimationFrame(() => scrollToHash(hash)))
}
