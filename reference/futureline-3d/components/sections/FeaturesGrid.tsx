/**
 * FeaturesGrid — numbered editorial scroll-reveal rows.
 * ---------------------------------------------------------------------------
 * Lusion-style restructure:
 *   - Three pillars become three full-width rows, each numbered (01 / 02 / 03).
 *   - Each row: an oversized number on the left, a large editorial heading +
 *     description on the right.
 *   - Headings reveal char-by-char via <AnimatedText>; descriptions reveal
 *     word-by-word; numbers count up.
 *   - Pillar separator is a hairline that draws across the viewport as the
 *     row enters view (scaleX 0 → 1, GSAP-driven).
 *
 * Why this shape:
 *   - Lusion + Active Theory case-study pages use the same "01 · big idea"
 *     editorial grid. It's slow, intentional, premium.
 *   - Compared to the previous 3-column tile grid, this rewards scrolling —
 *     you don't see everything in one glance.
 * ---------------------------------------------------------------------------
 */
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { AnimatedText } from '@/components/ui/AnimatedText'

const FEATURES = [
  {
    n: '01',
    title: 'Composable',
    body:
      'Build with primitives. Add your own. Replace anything. Everything is a building block — no black boxes, no lock-in.',
  },
  {
    n: '02',
    title: 'Real-time',
    body:
      'Every change syncs in milliseconds. No reloads, no merge conflicts, no lost work. Your team thinks together, ships together.',
  },
  {
    n: '03',
    title: 'Built for scale',
    body:
      'Roles, permissions, audit logs, SSO, and SOC 2. Everything serious teams need on day one — not bolted on later.',
  },
] as const

function FeatureRow({
  n,
  title,
  body,
  index,
}: {
  n: string
  title: string
  body: string
  index: number
}) {
  const rowRef = useRef<HTMLElement>(null)
  const ruleRef = useRef<HTMLSpanElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const row = rowRef.current
    const rule = ruleRef.current
    const num = numRef.current
    if (!row || !rule || !num) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      gsap.set(rule, { scaleX: 1 })
      gsap.set(num, { opacity: 1, y: 0 })
      return
    }

    // Use gsap.fromTo with explicit start/end states inside the observer
    // callback. This avoids a gsap.set on re-mount (StrictMode) that would
    // clobber an already-completed reveal from the previous mount.
    let fired = false
    const observer = new IntersectionObserver(
      (entries) => {
        if (fired) return
        if (entries[0].isIntersecting) {
          fired = true
          gsap.fromTo(
            rule,
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, duration: 1.1, ease: 'expo.out' },
          )
          gsap.fromTo(
            num,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              delay: 0.05,
              ease: 'power3.out',
            },
          )
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -15% 0px' },
    )
    observer.observe(row)
    return () => observer.disconnect()
  }, [index])

  return (
    <article ref={rowRef} className="relative py-16 md:py-24">
      {/* Hairline that draws across as the row enters view.
          Initial scaleX:0 via Tailwind class so a StrictMode re-mount can't
          undo the reveal animation. */}
      <span
        ref={ruleRef}
        aria-hidden="true"
        className="absolute inset-x-0 top-0 block h-px origin-left scale-x-0 bg-white/15"
      />
      <div className="grid grid-cols-12 gap-6 md:gap-12">
        {/* Number */}
        <div className="col-span-12 md:col-span-3">
          <span
            ref={numRef}
            className="block translate-y-6 font-mono text-sm tracking-[0.3em] text-brand-accent opacity-0 will-change-transform"
          >
            {n}
          </span>
        </div>

        {/* Headline + body */}
        <div className="col-span-12 md:col-span-9">
          <AnimatedText
            as="h3"
            variant="chars"
            className="text-5xl font-semibold leading-[0.95] tracking-[-0.02em] md:text-[clamp(3rem,7vw,7rem)]"
          >
            {title}
          </AnimatedText>
          <AnimatedText
            as="p"
            variant="words"
            className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl"
            delay={0.15}
          >
            {body}
          </AnimatedText>
        </div>
      </div>
    </article>
  )
}

export function FeaturesGrid() {
  return (
    <section
      id="features"
      className="relative bg-brand-bg px-6 py-32 md:px-12 md:py-48"
    >
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.4em] text-brand-accent">
          The Platform
        </p>
        <AnimatedText
          as="h2"
          variant="chars"
          className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.02em] md:text-[clamp(4rem,10vw,9rem)]"
        >
          Designed to scale.
        </AnimatedText>
        <AnimatedText
          as="p"
          variant="words"
          className="mt-10 max-w-xl text-lg leading-relaxed text-white/60 md:text-xl"
          delay={0.2}
        >
          Built from the ground up for teams who care about craft, speed, and shipping every day.
        </AnimatedText>

        <div className="mt-24 md:mt-32">
          {FEATURES.map((f, i) => (
            <FeatureRow key={f.n} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
