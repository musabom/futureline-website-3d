/**
 * SplashIntro — black-screen counter intro with a curtain reveal.
 * ---------------------------------------------------------------------------
 * Sequence (≈1.6s total, skippable by click):
 *
 *   0.0s  Black full-screen overlay. Centered: futureline mark + counter "0".
 *         Body has overflow:hidden so nothing scrolls behind.
 *   0.0s→ Counter animates 0 → 100 (GSAP, eased), word marquee crawls in.
 *   1.2s  Counter reads 100. Subtle pause (200ms).
 *   1.4s  Overlay splits — top half slides up, bottom half slides down —
 *         revealing the page. 600ms ease-in-cubic.
 *   2.0s  Component unmounts itself.
 *
 * Behavior:
 *   - Plays at most once per browser session (sessionStorage flag set on
 *     completion). Refreshes during dev still play it; close-tab + reopen
 *     replays it.
 *   - Click anywhere → instant skip (still sets the session flag).
 *   - prefers-reduced-motion → skip entirely, never render.
 *
 * Renders nothing on the server (return null until mounted). This keeps the
 * server-rendered HTML clean and ensures no flash of the overlay on first
 * paint when the user has already seen it this session.
 * ---------------------------------------------------------------------------
 */
'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const STORAGE_KEY = 'futureline_splash_played'

export function SplashIntro() {
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(false)
  const counterRef = useRef<HTMLSpanElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const lockBodyRef = useRef(false)
  const finishedRef = useRef(false)

  // First-mount decision: should we play at all?
  useEffect(() => {
    setMounted(true)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const played = sessionStorage.getItem(STORAGE_KEY) === '1'
    if (reduced || played) return
    setActive(true)
    // Lock scroll while the splash is up
    document.body.style.overflow = 'hidden'
    lockBodyRef.current = true
  }, [])

  // The animation itself — runs only after `active` is true and refs exist.
  useEffect(() => {
    if (!active) return
    const counterEl = counterRef.current
    const topEl = topRef.current
    const bottomEl = bottomRef.current
    const markEl = markRef.current
    const labelEl = labelRef.current
    if (!counterEl || !topEl || !bottomEl || !markEl || !labelEl) return

    const tl = gsap.timeline({
      onComplete: () => finish(false),
    })

    // Entrance: brand mark + label fade in.
    tl.fromTo(
      [markEl, labelEl],
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.08 },
      0,
    )

    // Counter 0 → 100. We update via onUpdate to avoid styling drift.
    const num = { v: 0 }
    tl.to(
      num,
      {
        v: 100,
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: () => {
          counterEl.textContent = String(Math.floor(num.v))
        },
      },
      0.15,
    )

    // Pause at 100.
    tl.to({}, { duration: 0.18 })

    // Pre-reveal: mark and label fade out so the curtain pulls back to a
    // CLEAN page underneath rather than ghost-text mid-split.
    tl.to(
      [markEl, labelEl, counterEl.parentElement],
      { opacity: 0, duration: 0.25, ease: 'power2.in' },
      '>-0.05',
    )

    // Curtain split.
    tl.to(
      topEl,
      { yPercent: -100, duration: 0.7, ease: 'expo.inOut' },
      '>-0.05',
    )
    tl.to(
      bottomEl,
      { yPercent: 100, duration: 0.7, ease: 'expo.inOut' },
      '<',
    )

    // Skip on click.
    const onClick = () => finish(true)
    window.addEventListener('click', onClick)

    function finish(immediate: boolean) {
      if (finishedRef.current) return
      finishedRef.current = true
      sessionStorage.setItem(STORAGE_KEY, '1')
      window.removeEventListener('click', onClick)
      if (lockBodyRef.current) {
        document.body.style.overflow = ''
        lockBodyRef.current = false
      }
      if (immediate) {
        tl.kill()
        // Snap curtain open instantly.
        gsap.set(topEl, { yPercent: -100 })
        gsap.set(bottomEl, { yPercent: 100 })
      }
      // Defer unmount one frame so the curtain layer can finish painting offscreen.
      setTimeout(() => setActive(false), immediate ? 50 : 100)
    }

    return () => {
      window.removeEventListener('click', onClick)
      tl.kill()
      if (lockBodyRef.current) {
        document.body.style.overflow = ''
        lockBodyRef.current = false
      }
    }
  }, [active])

  // SSR / not-needed: render nothing.
  if (!mounted || !active) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-auto fixed inset-0 z-[10001] select-none"
    >
      {/* Top curtain — slides up on completion */}
      <div
        ref={topRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-black"
      />
      {/* Bottom curtain — slides down on completion */}
      <div
        ref={bottomRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-black"
      />

      {/* Content layer — sits above both curtains, fades before split. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Brand mark */}
        <div ref={markRef} className="flex items-center gap-2">
          <span className="block h-2 w-2 rounded-full bg-brand-accent" />
          <span className="font-mono text-sm tracking-[0.25em] text-white/85">
            FUTURE LINE
          </span>
        </div>

        {/* Counter */}
        <div className="mt-12 flex items-baseline gap-2 font-mono">
          <span
            ref={counterRef}
            className="text-7xl font-semibold tracking-tight text-white tabular-nums md:text-9xl"
          >
            0
          </span>
          <span className="text-2xl text-white/40 md:text-3xl">%</span>
        </div>

        {/* Soft label */}
        <div
          ref={labelRef}
          className="mt-16 text-[10px] uppercase tracking-[0.4em] text-white/35"
        >
          Designing the platform
        </div>
      </div>
    </div>
  )
}
