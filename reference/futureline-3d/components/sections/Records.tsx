/**
 * Records — real numbers from FL Lab and FL Academy.
 * ---------------------------------------------------------------------------
 * Replaces the previous FutureCity Muscat-night stats section.
 *
 * Layout: two-column editorial split.
 *   - Left column: FL Lab stats — products, years, projects (cyan accent).
 *   - Right column: FL Academy stats — operators, reach, completion (amber).
 *   - Top: shared eyebrow + headline.
 *   - Both halves visually separated by a faint vertical hairline on desktop.
 *
 * Each number animates from 0 → target via GSAP when the row enters view.
 * Initial state lives in className (translate-y-8 opacity-0) so a StrictMode
 * re-mount can't undo a completed reveal — same pattern as CaseStudy.
 *
 * Numbers shipped here are placeholder-grade. Swap them for the real figures
 * by editing LAB_STATS / ACADEMY_STATS arrays below.
 * ---------------------------------------------------------------------------
 */
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

type Stat = {
  value: number
  display: string // final rendered text (used after counter completes)
  suffix?: string
  label: string
  blurb: string
}

const LAB_STATS: Stat[] = [
  {
    value: 47,
    display: '47',
    label: 'Products shipped',
    blurb: 'Tools, prototypes, and platform pieces in production today.',
  },
  {
    value: 12,
    display: '12',
    suffix: 'yrs',
    label: 'Years building',
    blurb: 'A decade-plus of R&D feeding into every release.',
  },
  {
    value: 18,
    display: '18',
    label: 'Open-source projects',
    blurb: 'What we learn ships back to the community — by default.',
  },
]

const ACADEMY_STATS: Stat[] = [
  {
    value: 8400,
    display: '8,400',
    suffix: '+',
    label: 'Operators trained',
    blurb: 'Engineers, PMs, and founders who learned with us.',
  },
  {
    value: 126,
    display: '126',
    label: 'Cities reached',
    blurb: 'Cohorts spanning six continents and rising.',
  },
  {
    value: 96,
    display: '96',
    suffix: '%',
    label: 'Completion rate',
    blurb: 'Designed so people finish — not just enroll.',
  },
]

function StatBlock({
  stat,
  accent,
}: {
  stat: Stat
  accent: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    const numEl = numRef.current
    if (!el || !numEl) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      numEl.textContent = stat.display
      el.style.transform = 'translateY(0)'
      el.style.opacity = '1'
      return
    }
    let fired = false
    const observer = new IntersectionObserver(
      (entries) => {
        if (fired) return
        if (entries[0].isIntersecting) {
          fired = true
          // Slide + fade in the block
          gsap.fromTo(
            el,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          )
          // Count the number up
          const state = { v: 0 }
          gsap.to(state, {
            v: stat.value,
            duration: 1.4,
            ease: 'power2.out',
            onUpdate: () => {
              // Match the original formatting (e.g., "8,400")
              numEl.textContent = Math.round(state.v).toLocaleString()
            },
            onComplete: () => {
              numEl.textContent = stat.display
            },
          })
          observer.disconnect()
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [stat])

  return (
    <div
      ref={ref}
      className="translate-y-6 border-t pt-6 opacity-0"
      style={{ borderColor: `${accent}33` /* 20% alpha */ }}
    >
      <p className="flex items-baseline gap-1 text-6xl font-semibold tracking-tight text-white md:text-7xl">
        <span ref={numRef}>0</span>
        {stat.suffix && (
          <span
            className="text-3xl md:text-4xl"
            style={{ color: accent }}
          >
            {stat.suffix}
          </span>
        )}
      </p>
      <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-white/80">
        {stat.label}
      </p>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
        {stat.blurb}
      </p>
    </div>
  )
}

export function Records() {
  return (
    <section
      id="records"
      aria-labelledby="records-heading"
      className="relative bg-brand-bg px-6 py-32 md:py-48"
    >
      {/* Subtle radial glow centered behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-40 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-brand-accent/[0.05] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.4em] text-brand-accent">
          The record
        </p>
        <h2
          id="records-heading"
          className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.02em] md:text-[clamp(3.5rem,8vw,8rem)]"
        >
          Two divisions.
          <br />
          One record of work.
        </h2>
        <p className="mt-10 max-w-md text-lg leading-relaxed text-white/65 md:text-xl">
          What FL Lab builds and what FL Academy teaches — measured the same
          way: in actual outcomes.
        </p>

        {/* Split: Lab on left, Academy on right.
            On mobile they stack; on md+ they sit side by side with a
            hairline divider between. */}
        <div className="relative mt-24 grid grid-cols-1 gap-y-20 md:mt-32 md:grid-cols-2 md:gap-x-16">
          {/* Vertical divider on md+ */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-white/10 md:block"
          />

          {/* ── FL Lab column ─────────────────────────────────────── */}
          <div>
            <div className="mb-12 flex items-baseline gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{
                  background: '#7dd3fc',
                  boxShadow: '0 0 10px 2px rgba(125,211,252,0.55)',
                }}
              />
              <h3 className="font-mono text-xs uppercase tracking-[0.4em] text-white/85">
                FL · Lab
              </h3>
              <span className="text-xs text-white/40">Where we build</span>
            </div>
            <div className="space-y-12">
              {LAB_STATS.map((s) => (
                <StatBlock key={s.label} stat={s} accent="#7dd3fc" />
              ))}
            </div>
          </div>

          {/* ── FL Academy column ────────────────────────────────── */}
          <div>
            <div className="mb-12 flex items-baseline gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{
                  background: '#fbbf24',
                  boxShadow: '0 0 10px 2px rgba(251,191,36,0.55)',
                }}
              />
              <h3 className="font-mono text-xs uppercase tracking-[0.4em] text-white/85">
                FL · Academy
              </h3>
              <span className="text-xs text-white/40">Where we teach</span>
            </div>
            <div className="space-y-12">
              {ACADEMY_STATS.map((s) => (
                <StatBlock key={s.label} stat={s} accent="#fbbf24" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
