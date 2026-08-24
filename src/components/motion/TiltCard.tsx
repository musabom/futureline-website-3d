/**
 * TiltCard — subtle 3D tilt toward the cursor.
 *
 * The rotation is written straight to the element with gsap.quickTo rather
 * than through React state: pointermove fires far faster than a render loop
 * should, and the prototype's version created a fresh tween on every single
 * move event. quickTo reuses one tween, so this stays cheap even with a
 * gridful of cards.
 *
 * The parent grid must supply the perspective (e.g. `[perspective:1200px]`).
 * No-ops entirely under reduced motion and on coarse pointers, where there
 * is no cursor to follow.
 */
'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface Props {
  children: ReactNode
  className?: string
  /** Max rotation in degrees at the card's edge. */
  strength?: number
}

export function TiltCard({ children, className, strength = 10 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const rotX = gsap.quickTo(el, 'rotationX', { duration: 0.4, ease: 'power3.out' })
    const rotY = gsap.quickTo(el, 'rotationY', { duration: 0.4, ease: 'power3.out' })

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      rotX(-py * strength)
      rotY(px * strength)
    }
    const onLeave = () => {
      rotX(0)
      rotY(0)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(el)
    }
  }, [reduced, strength])

  return (
    <div ref={ref} className={`fl-tilt ${className ?? ''}`}>
      {children}
    </div>
  )
}
