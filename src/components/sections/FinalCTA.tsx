/**
 * FinalCTA — closing section. Headline + dual CTA + entrance spark burst.
 *
 * Verbatim port. Sparks adapted from cyan/warm to teal/amber to match brand.
 * Subhead + CTA targets are FutureLine routes.
 */
'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FadeUp } from '@/components/motion/FadeUp'
import { BrandedHeading } from '@/components/ui/BrandedHeading'

const SPARK_COUNT = 22

interface SparkSpec {
  dx: number
  dy: number
  delay: number
  duration: number
  hue: number
}

function generateSparks(): SparkSpec[] {
  const out: SparkSpec[] = []
  for (let i = 0; i < SPARK_COUNT; i++) {
    const angle = (i / SPARK_COUNT) * Math.PI * 2 + Math.random() * 0.3
    const dist = 80 + Math.random() * 180
    out.push({
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist * 0.7 - 40,
      delay: Math.random() * 120,
      duration: 700 + Math.random() * 400,
      hue: Math.random(),
    })
  }
  return out
}

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const [burst, setBurst] = useState(false)
  const sparks = useMemo(generateSparks, [])

  useEffect(() => {
    if (!sectionRef.current) return
    const el = sectionRef.current
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setBurst(true)
          obs.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="start"
      className="relative overflow-hidden bg-brand-bg px-6 py-24 md:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/[0.10] blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-brand-accent/40 to-transparent"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <FadeUp>
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-brand-accent">
            05 — Start
          </p>

          <div className="relative inline-block">
            <BrandedHeading as="h2" size="xl" className="relative z-10">
              Ready when you are.
            </BrandedHeading>

            {burst && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 z-0"
              >
                {sparks.map((s, i) => (
                  <span
                    key={i}
                    className="cta-spark"
                    style={
                      {
                        '--dx': `${s.dx}px`,
                        '--dy': `${s.dy}px`,
                        animationDelay: `${s.delay}ms`,
                        animationDuration: `${s.duration}ms`,
                        background:
                          s.hue < 0.6
                            ? 'rgba(94, 218, 200, 0.95)'  // teal — Lab pole
                            : 'rgba(91, 123, 251, 0.95)', // wordmark blue — Academy pole
                      } as React.CSSProperties
                    }
                  />
                ))}
              </div>
            )}
          </div>

          <p className="mx-auto mt-6 max-w-xl text-lg text-white/65">
            A free systems audit. No commitment. Just an honest look at what&apos;s slowing you down — and the smallest fix that moves the needle.
          </p>
          <div className="mt-10 flex items-center justify-center gap-2">
            <Link
              href="/audit"
              data-cursor="magnetic"
              data-cursor-strength="28"
              className="rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition-colors hover:bg-white/90"
            >
              Get a free audit
            </Link>
            <Link
              href="/services"
              data-cursor="hover"
              className="ml-2 px-4 py-4 text-sm text-white/70 transition-colors hover:text-white"
            >
              Browse services →
            </Link>
          </div>
        </FadeUp>
      </div>

      <style jsx>{`
        .cta-spark {
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 4px;
          margin: -2px 0 0 -2px;
          border-radius: 9999px;
          box-shadow: 0 0 8px currentColor;
          opacity: 0;
          animation-name: ctaSpark;
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes ctaSpark {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.4);
          }
          10% {
            opacity: 1;
            transform: translate(calc(var(--dx) * 0.1), calc(var(--dy) * 0.1))
              scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--dx), var(--dy)) scale(0.2);
          }
        }
      `}</style>
    </section>
  )
}
