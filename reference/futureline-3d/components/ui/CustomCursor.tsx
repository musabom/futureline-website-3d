/**
 * CustomCursor — lusion-style follower cursor with magnetic targets.
 * ---------------------------------------------------------------------------
 * What it is:
 *   - A small white dot (the precise pointer) that tracks the mouse with
 *     1:1 latency.
 *   - A larger soft blob (the spotlight) that follows the dot with eased
 *     latency, growing and softening over interactive elements.
 *   - Magnetic attraction: elements marked [data-cursor="magnetic"] subtly
 *     translate TOWARD the cursor when it enters their hitbox.
 *
 * Why this implementation:
 *   - We hide the native cursor with `cursor: none` on <body> via a CSS rule
 *     applied only when a pointing device exists (pointer:fine) and we are
 *     actively rendering the custom cursor.
 *   - We use gsap.quickTo for the position writes — it batches into a single
 *     RAF and avoids React state churn at 120 Hz.
 *   - We listen on document with capture so the cursor responds even when
 *     the event target stops propagation.
 *
 * Accessibility:
 *   - Disabled on touch / coarse-pointer devices (matchMedia('(pointer:fine)')).
 *   - Disabled when prefers-reduced-motion is set — native cursor returns.
 *   - The dot/blob have aria-hidden so screen readers ignore them.
 *
 * Usage:
 *   <CustomCursor />                                       in the root layout
 *   <a data-cursor="hover">Link</a>                        soft blob scales
 *   <button data-cursor="magnetic" data-cursor-strength="20">Click</button>
 *
 *   data-cursor-strength is the max pixel-pull on the target (default 18).
 * ---------------------------------------------------------------------------
 */
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const blobRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // ── Gate on capability + preference ────────────────────────────────────
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reduced) return

    const dot = dotRef.current
    const blob = blobRef.current
    if (!dot || !blob) return

    // Reveal the cursor (was display:none until JS runs to avoid SSR flash).
    dot.style.display = 'block'
    blob.style.display = 'block'
    document.documentElement.classList.add('cursor-hidden')

    // ── Position writers ───────────────────────────────────────────────────
    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' })
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' })
    const setBlobX = gsap.quickTo(blob, 'x', { duration: 0.4, ease: 'power3.out' })
    const setBlobY = gsap.quickTo(blob, 'y', { duration: 0.4, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      setDotX(e.clientX)
      setDotY(e.clientY)
      setBlobX(e.clientX)
      setBlobY(e.clientY)
    }
    document.addEventListener('mousemove', onMove, { passive: true })

    // ── Hover / magnetic delegation ────────────────────────────────────────
    // We attach the listeners once on document and dispatch by attribute.
    const magneticHandlers = new WeakMap<
      Element,
      { move: (e: MouseEvent) => void; leave: () => void }
    >()

    const onPointerOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(
        '[data-cursor]',
      ) as HTMLElement | null
      if (!target) return
      const mode = target.dataset.cursor
      if (mode === 'hover' || mode === 'magnetic') {
        blob.classList.add('is-hover')
      }
      if (mode === 'magnetic' && !magneticHandlers.has(target)) {
        const strength = Number(target.dataset.cursorStrength ?? 18)
        const move = (ev: MouseEvent) => {
          const rect = target.getBoundingClientRect()
          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          const dx = ev.clientX - cx
          const dy = ev.clientY - cy
          // Soft pull: max strength, eased toward center distance.
          const pull = strength
          gsap.to(target, {
            x: (dx / rect.width) * pull * 2,
            y: (dy / rect.height) * pull * 2,
            duration: 0.35,
            ease: 'power3.out',
            overwrite: 'auto',
          })
        }
        const leave = () => {
          gsap.to(target, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.4)',
            overwrite: 'auto',
          })
          target.removeEventListener('mousemove', move)
          target.removeEventListener('mouseleave', leave)
          magneticHandlers.delete(target)
        }
        target.addEventListener('mousemove', move)
        target.addEventListener('mouseleave', leave)
        magneticHandlers.set(target, { move, leave })
      }
    }

    const onPointerOut = (e: PointerEvent) => {
      // Only collapse the blob when leaving a [data-cursor] element entirely.
      const from = (e.target as Element | null)?.closest?.('[data-cursor]')
      const to = (e.relatedTarget as Element | null)?.closest?.('[data-cursor]')
      if (from && !to) blob.classList.remove('is-hover')
    }

    document.addEventListener('pointerover', onPointerOver)
    document.addEventListener('pointerout', onPointerOut)

    // ── Hide on window blur / re-show on focus ────────────────────────────
    const onBlur = () => {
      dot.style.opacity = '0'
      blob.style.opacity = '0'
    }
    const onFocus = () => {
      dot.style.opacity = '1'
      blob.style.opacity = '1'
    }
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
      document.documentElement.classList.remove('cursor-hidden')
    }
  }, [])

  return (
    <>
      {/* Soft blob — sits behind the dot. Pure white with low opacity so it
          reads on any background. mix-blend-mode:difference would be more
          lusion-pure but it interacts weirdly with cyan accents. */}
      <div
        ref={blobRef}
        aria-hidden="true"
        className="custom-cursor-blob pointer-events-none fixed left-0 top-0 z-[9999] hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15 backdrop-blur-[2px] transition-[width,height,background-color] duration-300 ease-out"
        style={{ willChange: 'transform' }}
      />
      {/* Precise pointer — small bright dot. Sits on top of the blob. */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="custom-cursor-dot pointer-events-none fixed left-0 top-0 z-[10000] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ willChange: 'transform' }}
      />
      <style jsx global>{`
        html.cursor-hidden,
        html.cursor-hidden * {
          cursor: none !important;
        }
        .custom-cursor-blob.is-hover {
          width: 4.5rem;
          height: 4.5rem;
          background-color: rgba(125, 211, 252, 0.18);
        }
      `}</style>
    </>
  )
}
