/**
 * Records — real numbers from FL Lab and FL Academy.
 *
 * Verbatim port. Structure, count-up animation, sticky observer pattern —
 * unchanged. Two changes from reference:
 *   1) LAB_STATS + ACADEMY_STATS swapped to FutureLine numbers.
 *   2) Pole accent hexes swapped from cyan/yellow (reference) to brand teal
 *      (#18A999) / blue (#6B7CC3 — wordmark's blue end). Editorial section,
 *      scene — brand colors apply here.
 */
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';

type Stat = {
  value: number
  display: string
  suffix?: string
  label: string
  blurb: string
}

const LAB_STATS: Stat[] = [
  {
    value: 11,
    display: '11',
    suffix: 'hrs',
    label: 'Hours saved per week',
    blurb: 'Average reclaimed per client team after deployment.',
  },
  {
    value: 5,
    display: '5',
    suffix: 'wks',
    label: 'Average delivery',
    blurb: 'Kickoff to live system, not 12-month enterprise builds.',
  },
  {
    value: 0,
    display: '0',
    label: 'Recurring licence fees',
    blurb: 'Custom systems mean no monthly software tax — ever.',
  },
]

const ACADEMY_STATS: Stat[] = [
  {
    value: 5,
    display: '5',
    suffix: '+',
    label: 'Courses in catalog',
    blurb: 'From AI fundamentals to cloud architecture and cybersecurity.',
  },
  {
    value: 3,
    display: '3',
    label: 'Delivery formats',
    blurb: 'Online, in-person, and hybrid — built around how teams learn.',
  },
  {
    value: 98,
    display: '98',
    suffix: '%',
    label: 'Target satisfaction',
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
          gsap.fromTo(
            el,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          )
          const state = { v: 0 }
          gsap.to(state, {
            v: stat.value,
            duration: 1.4,
            ease: 'power2.out',
            onUpdate: () => {
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
      style={{ borderColor: `${accent}33` }}
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

const LAB_COLOR = '#18A999'
const ACADEMY_COLOR = '#6B7CC3'

export function Records() {
  return (
    <section
      id="records"
      aria-labelledby="records-heading"
      className="relative bg-brand-bg px-6 py-32 md:py-48"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-40 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-brand-accent/[0.05] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <SectionEyebrow>The record</SectionEyebrow>
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

        <div className="relative mt-24 grid grid-cols-1 gap-y-20 md:mt-32 md:grid-cols-2 md:gap-x-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-white/10 md:block"
          />

          <div>
            <div className="mb-12 flex items-baseline gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{
                  background: LAB_COLOR,
                  boxShadow: `0 0 10px 2px ${LAB_COLOR}8c`,
                }}
              />
              <h3 className="font-mono text-xs uppercase tracking-[0.4em] text-white/85">
                FL · Lab
              </h3>
              <span className="text-xs text-white/40">Where we build</span>
            </div>
            <div className="space-y-12">
              {LAB_STATS.map((s) => (
                <StatBlock key={s.label} stat={s} accent={LAB_COLOR} />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-12 flex items-baseline gap-3">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full"
                style={{
                  background: ACADEMY_COLOR,
                  boxShadow: `0 0 10px 2px ${ACADEMY_COLOR}8c`,
                }}
              />
              <h3 className="font-mono text-xs uppercase tracking-[0.4em] text-white/85">
                FL · Academy
              </h3>
              <span className="text-xs text-white/40">Where we teach</span>
            </div>
            <div className="space-y-12">
              {ACADEMY_STATS.map((s) => (
                <StatBlock key={s.label} stat={s} accent={ACADEMY_COLOR} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
