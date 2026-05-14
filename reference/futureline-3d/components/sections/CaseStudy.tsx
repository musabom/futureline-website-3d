/**
 * CaseStudy — sticky split: pinned customer card (left), scrolling proof (right).
 * ---------------------------------------------------------------------------
 * Lusion-style restructure of what used to be the Testimonial section.
 *
 *   Left column (pinned via position:sticky):
 *     - Big editorial customer name + role
 *     - A single oversized metric (the most impressive one)
 *     - Sits centered in the viewport for the entire section duration
 *
 *   Right column (scrolls past the pinned card):
 *     - Stage 1 — eyebrow + the pull quote
 *     - Stage 2 — secondary metrics revealed as you scroll
 *     - Stage 3 — context paragraph
 *
 * Why sticky (not pinned via ScrollTrigger.pin):
 *   - CSS position:sticky is GPU-cheap and doesn't fight the smooth scroll.
 *   - ScrollTrigger only handles the reveals on the right column.
 *
 * Heights:
 *   - Section is min-h-[200vh] so the right column has runway to scroll
 *     past the sticky card. 200vh = roughly two viewports of right-column
 *     content scrolling past a centered left card.
 * ---------------------------------------------------------------------------
 */
'use client'

import { AnimatedText } from '@/components/ui/AnimatedText'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const SECONDARY = [
  { value: '87%', label: 'less time spent in code review' },
  { value: '14×', label: 'more PRs merged per engineer per week' },
  { value: '0', label: 'rollbacks since adopting FUTURE LINE' },
]

function Counter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    // Initial state lives in the JSX className (translate-y-8 opacity-0)
    // so a StrictMode re-mount can't undo a completed animation.
    let fired = false
    const observer = new IntersectionObserver(
      (entries) => {
        if (fired) return
        if (entries[0].isIntersecting) {
          fired = true
          gsap.fromTo(
            el,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
          )
          observer.disconnect()
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className="translate-y-8 border-t border-white/15 pt-6 opacity-0"
    >
      <p className="text-5xl font-semibold tracking-tight text-white md:text-6xl">
        {value}
      </p>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
        {label}
      </p>
    </div>
  )
}

export function CaseStudy() {
  return (
    <section
      aria-label="Customer case study"
      className="relative bg-brand-bg px-6 py-32 md:px-12"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        {/* ─── Pinned column ─────────────────────────────────────────── */}
        <aside className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.4em] text-brand-accent">
              Selected work
            </p>
            <AnimatedText
              as="h2"
              variant="chars"
              className="text-5xl font-semibold leading-[0.95] tracking-[-0.02em] md:text-[clamp(3.5rem,7vw,7rem)]"
            >
              Northstar.
            </AnimatedText>
            <p className="mt-6 text-sm uppercase tracking-[0.25em] text-white/45">
              Robotics · 320 engineers
            </p>

            {/* Hero metric — the one number you remember */}
            <div className="mt-16 border-t border-white/15 pt-8">
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-white/40">
                Headline result
              </p>
              <p className="mt-4 text-7xl font-semibold tracking-tight text-white md:text-[10rem] md:leading-none">
                10×
              </p>
              <p className="mt-4 max-w-xs text-base leading-relaxed text-white/65">
                Quarterly shipping velocity, sustained over four release cycles.
              </p>
            </div>
          </div>
        </aside>

        {/* ─── Scrolling column ──────────────────────────────────────── */}
        <div className="md:col-span-7 md:py-24">
          {/* Pull quote */}
          <div className="md:mt-12">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mb-8 h-10 w-10 text-brand-accent/80"
            >
              <path d="M6 17h3l2-4V7H5v6h3l-2 4Zm8 0h3l2-4V7h-6v6h3l-2 4Z" />
            </svg>
            <AnimatedText
              as="blockquote"
              variant="words"
              className="text-3xl font-medium leading-[1.2] tracking-[-0.01em] text-white md:text-5xl"
            >
              We shipped what would have been a quarter of work in two weeks. FUTURE LINE turned someday into this sprint.
            </AnimatedText>
            <figcaption className="mt-12 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-300 to-cyan-600 ring-1 ring-white/20" />
              <div>
                <p className="text-sm font-medium text-white">Mira Okafor</p>
                <p className="text-xs text-white/55">
                  Head of Engineering, Northstar Robotics
                </p>
              </div>
            </figcaption>
          </div>

          {/* Secondary metrics — staggered reveal */}
          <dl className="mt-32 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {SECONDARY.map((m) => (
              <Counter key={m.label} value={m.value} label={m.label} />
            ))}
          </dl>

          {/* Context paragraph */}
          <div className="mt-32">
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-brand-accent">
              Context
            </p>
            <AnimatedText
              as="p"
              variant="words"
              className="mt-8 max-w-2xl text-xl leading-relaxed text-white/70 md:text-2xl"
            >
              Before FUTURE LINE, Northstar&apos;s 12 platform squads coordinated through three different CI systems and two issue trackers. Today, every team plans, ships, and observes in one continuous surface. Their roadmap stopped being a forecast — and started being a record of what already happened.
            </AnimatedText>
          </div>
        </div>
      </div>
    </section>
  )
}
