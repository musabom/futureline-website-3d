/**
 * Stagger — animates direct children in sequence on scroll.
 *
 * Place children directly inside <Stagger>; each child fades+translates in,
 * offset by the `stagger` value (seconds). Reduced-motion users see the
 * static final state.
 *
 * Usage:
 *   <Stagger className="grid grid-cols-3 gap-4">
 *     <Card /> <Card /> <Card />
 *   </Stagger>
 */
'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface StaggerProps {
  children: ReactNode
  stagger?: number
  y?: number
  duration?: number
  className?: string
}

export function Stagger({
  children,
  stagger = 0.08,
  y = 24,
  duration = 0.9,
  className,
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!ref.current || reduced) return
    const el = ref.current
    const targets = Array.from(el.children) as HTMLElement[]
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          ease: 'power3.out',
          stagger,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [reduced, stagger, y, duration])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
