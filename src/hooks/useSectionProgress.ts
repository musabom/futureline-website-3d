/**
 * useSectionProgress — pins a section and reports scroll progress 0→1.
 *
 * Wraps the same ScrollTrigger pin/scrub pattern DualWalkway and
 * NeuralPathway already use, so every pinned section on the page behaves
 * identically. ScrollTrigger is the only correct choice here: src/lib/
 * lenis-gsap.ts drives Lenis from gsap.ticker and calls ScrollTrigger.update
 * on every Lenis tick, so ScrollTrigger is the one scroll consumer that is
 * frame-synchronised with the smooth scroll. Anything sampling window.scrollY
 * on its own clock tears against the sections above it.
 *
 * Progress is exposed as a **ref**, not state — a scrub updates ~60×/s and
 * must never trigger a React render. Read progressRef.current inside a
 * useFrame or a rAF loop. For the coarse, discrete part of a scrub (which
 * caption is active) use onStep, which only fires when the index changes.
 *
 * Under reduced motion no trigger is created at all: the caller renders its
 * static layout and progress stays at 0.
 */
'use client'

import { useEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface Options {
  /** Scroll distance the pin lasts, e.g. '+=300%' (3 extra viewports). */
  end?: string
  /** Pin the section while scrubbing. Default true. */
  pin?: boolean
  /** ScrollTrigger scrub smoothing in seconds. Default 0.9, matching NeuralPathway. */
  scrub?: number
  /** Number of discrete steps; enables onStep. */
  steps?: number
  /** Fires only when the active step index changes. */
  onStep?: (index: number) => void
  /**
   * Fires on every scroll update with progress 0→1.
   *
   * Use this — not a WebGL frame loop — to drive scroll-linked DOM. It fires
   * from ScrollTrigger regardless of whether any canvas is rendering, so
   * copy stays visible when a scene is paused offscreen, in a background
   * tab, or has fallen back because WebGL is unavailable.
   */
  onProgress?: (progress: number) => void
}

export function useSectionProgress(
  ref: RefObject<HTMLElement | null>,
  { end = '+=300%', pin = true, scrub = 0.9, steps, onStep, onProgress }: Options = {},
) {
  const progressRef = useRef(0)
  const stepRef = useRef(-1)
  const reduced = usePrefersReducedMotion()

  // Keep the latest callbacks without re-creating the trigger every render.
  const onStepRef = useRef(onStep)
  onStepRef.current = onStep
  const onProgressRef = useRef(onProgress)
  onProgressRef.current = onProgress

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Reduced motion: no pin, no scrub. The section renders its static
    // layout and progress is meaningless, so leave it at 0.
    if (reduced) {
      progressRef.current = 0
      return
    }

    // Paint once up front so a section that loads mid-scroll isn't blank
    // until the first scroll event.
    onProgressRef.current?.(0)

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end,
      pin,
      anticipatePin: 1,
      scrub,
      onUpdate: (self) => {
        progressRef.current = self.progress
        onProgressRef.current?.(self.progress)
        if (!steps) return
        const idx = Math.min(steps - 1, Math.floor(self.progress * steps))
        if (idx !== stepRef.current) {
          stepRef.current = idx
          onStepRef.current?.(idx)
        }
      },
    })

    return () => {
      trigger.kill()
    }
  }, [ref, reduced, end, pin, scrub, steps])

  return { progressRef, reduced }
}
