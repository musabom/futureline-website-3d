/**
 * Lenis ↔ GSAP ScrollTrigger sync — the canonical pattern.
 * Initialize once at app root via <SmoothScrollProvider>.
 *
 * Why this pattern:
 *   - Lenis owns the smooth-scroll input loop.
 *   - GSAP's ticker drives both animation frames and Lenis's RAF — one loop,
 *     no double-ticking, no jitter between scrub and ease.
 *   - ScrollTrigger.update is called on every Lenis tick so pinned sections,
 *     scrubs, and snap points stay perfectly in sync with the actual scroll.
 */
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initLenisGsap() {
  const lenis = new Lenis({
    // Sweet-spot duration. > 1.2 starts feeling gummy on keyboard scroll.
    duration: 1.15,
    // Standard easeOutExpo — feels luxurious without being slow.
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2,
  })

  lenis.on('scroll', ScrollTrigger.update)

  // Drive Lenis from GSAP's ticker so animations and scroll stay in sync.
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  // GSAP's lag smoothing fights the smooth-scroll feel — disable.
  gsap.ticker.lagSmoothing(0)

  return lenis
}

export function destroyAllScrollTriggers() {
  ScrollTrigger.getAll().forEach((t) => t.kill())
}
