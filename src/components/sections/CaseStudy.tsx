/**
 * CaseStudy — sticky split: pinned anchor metric (left), scrolling proof (right).
 *
 * Verbatim port of structure + animation. Content is synthesized from
 * FutureLine's real positioning rather than a named client — anchor metric is
 * the industry failure rate, secondary metrics are our delivery numbers.
 */
'use client'

import { AnimatedText } from '@/components/ui/AnimatedText'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow'
import { BrandedHeading } from '@/components/ui/BrandedHeading'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const SECONDARY = [
  { value: '5 wks', label: 'Average delivery — kickoff to live system.' },
  { value: '11 hrs', label: 'Saved per week, per active client team.' },
  { value: '$0', label: 'Recurring licence fees. Custom systems have none.' },
]

function Counter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
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
      aria-label="By the numbers"
      className="relative bg-brand-bg px-6 py-20 md:px-12 md:py-24"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        <aside className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <SectionEyebrow>By the numbers</SectionEyebrow>
            <BrandedHeading as="h2" size="xl">
              47% fail.
            </BrandedHeading>
            <p className="mt-6 text-sm uppercase tracking-[0.25em] text-white/45">
              Industry rate · Your project won&apos;t
            </p>

            <div className="mt-16 border-t border-white/15 pt-8">
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-white/40">
                The cost of getting it wrong
              </p>
              <p className="mt-4 text-7xl font-semibold tracking-tight text-white md:text-[10rem] md:leading-none">
                $47k
              </p>
              <p className="mt-4 max-w-xs text-base leading-relaxed text-white/65">
                Average spend on a failed digital transformation. Time, licences, and rework — gone.
              </p>
            </div>
          </div>
        </aside>

        <div className="md:col-span-7 md:py-24">
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
              47% of digital transformation projects fail. Yours won&apos;t — because we build systems your team will actually use.
            </AnimatedText>
            <figcaption className="mt-12 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 ring-1 ring-white/20" />
              <div>
                <p className="text-sm font-medium text-white">FutureLine</p>
                <p className="text-xs text-white/55">
                  The operator&apos;s approach to systems
                </p>
              </div>
            </figcaption>
          </div>

          <dl className="mt-32 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {SECONDARY.map((m) => (
              <Counter key={m.label} value={m.value} label={m.label} />
            ))}
          </dl>

          <div className="mt-32">
            <SectionEyebrow className="mb-0">Why this works</SectionEyebrow>
            <AnimatedText
              as="p"
              variant="words"
              className="mt-8 max-w-2xl text-xl leading-relaxed text-white/70 md:text-2xl"
            >
              Most transformations fail because they ship software, not systems people use. We start with the day-to-day — what your team actually does, what slows them down, where the data lives — then build the smallest thing that moves the needle. Live in weeks. Iterate from there.
            </AnimatedText>
          </div>
        </div>
      </div>
    </section>
  )
}
