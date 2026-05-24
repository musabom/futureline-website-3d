/**
 * FeaturesGrid — numbered editorial scroll-reveal rows.
 *
 * Verbatim port. Structure, animation, layout grid — unchanged. Only the
 * FEATURES array + section headline/eyebrow/subhead are FutureLine content
 * (our four core services).
 */
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { AnimatedText } from '@/components/ui/AnimatedText'
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { BrandedHeading } from '@/components/ui/BrandedHeading';

const FEATURES = [
  {
    n: '01',
    title: 'Digitalisation',
    body:
      'Replace paper trails and siloed spreadsheets with unified digital systems. One source of truth. Zero manual reconciliation.',
  },
  {
    n: '02',
    title: 'Custom software',
    body:
      'Purpose-built platforms that do exactly what your business needs — no bloat, no recurring licence fees, no workarounds.',
  },
  {
    n: '03',
    title: 'Automations',
    body:
      'AI-powered workflows that eliminate manual work, cut errors, and free your team to focus on what actually grows the business.',
  },
  {
    n: '04',
    title: 'Consultation',
    body:
      'A plain-English audit of your current systems — what is slowing you down, what to fix first, and a roadmap that makes sense.',
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
      <span
        ref={ruleRef}
        aria-hidden="true"
        className="absolute inset-x-0 top-0 block h-px origin-left scale-x-0 bg-white/15"
      />
      <div className="grid grid-cols-12 gap-6 md:gap-12">
        <div className="col-span-12 md:col-span-3">
          <span
            ref={numRef}
            className="block translate-y-6 font-mono text-sm tracking-[0.3em] text-brand-accent opacity-0 will-change-transform"
          >
            {n}
          </span>
        </div>

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
      <div className="mx-auto max-w-7xl text-center">
        <SectionEyebrow>Our services</SectionEyebrow>
        <BrandedHeading as="h2" size="xl">
          Systems built for scale.
        </BrandedHeading>
        <p className="mx-auto mt-10 max-w-xl text-lg leading-relaxed text-white/60 md:text-xl">
          Built for businesses outgrowing their tools. Done in weeks, not years.
        </p>

        <div className="mt-24 md:mt-32">
          {FEATURES.map((f, i) => (
            <FeatureRow key={f.n} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
