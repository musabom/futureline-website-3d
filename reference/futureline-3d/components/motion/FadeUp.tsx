/**
 * FadeUp — scroll-triggered fade + translateY reveal.
 *
 * Drop-in around any DOM element. Uses GSAP + ScrollTrigger (already
 * registered globally by SmoothScrollProvider). Honors prefers-reduced-motion
 * by rendering children with no animation at all.
 *
 * Usage:
 *   <FadeUp><h2>...</h2></FadeUp>
 *   <FadeUp delay={0.2} y={40}><p>...</p></FadeUp>
 */
'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface FadeUpProps {
  children: ReactNode
  delay?: number
  y?: number
  duration?: number
  className?: string
  as?: 'div' | 'section' | 'article' | 'header' | 'footer'
}

export function FadeUp({
  children,
  delay = 0,
  y = 24,
  duration = 0.9,
  className,
  as: Tag = 'div',
}: FadeUpProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!ref.current || reduced) return
    const el = ref.current
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [reduced, delay, y, duration])

  return (
    // @ts-expect-error — dynamic tag union
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
