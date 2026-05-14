/**
 * AnimatedText — masked char-by-char or line-by-line reveals, GSAP-driven.
 * ---------------------------------------------------------------------------
 * Two variants:
 *
 *   <AnimatedText variant="chars">Headline goes here</AnimatedText>
 *     Each character is wrapped in a <span> with overflow:hidden parent,
 *     then translated from y:100% to y:0 with a staggered timeline.
 *     Best for short headlines.
 *
 *   <AnimatedText variant="words">Paragraph goes here</AnimatedText>
 *     Each WORD is wrapped, same masked reveal. Cheaper than chars for long
 *     copy. Best for body paragraphs / subheads.
 *
 * Behavior:
 *   - Fires once when the element enters the viewport (top at 90% by default).
 *   - prefers-reduced-motion → renders text as-is, no animation.
 *   - You can pass `as="h1"` / `as="h2"` etc. to render the right semantic tag.
 *
 * Why masked translateY:
 *   - It's the lusion/awwwards signature. The text *delivers itself* rather
 *     than fading. Reads as confident and intentional.
 *
 * Cost: tiny — N spans + one GSAP timeline with a stagger. No re-renders.
 * ---------------------------------------------------------------------------
 */
'use client'

import {
  ElementType,
  ReactNode,
  createElement,
  useEffect,
  useMemo,
  useRef,
} from 'react'

type Variant = 'chars' | 'words'

interface AnimatedTextProps {
  children: string
  variant?: Variant
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
  duration?: number
  start?: string
}

export function AnimatedText({
  children,
  variant = 'chars',
  as = 'span',
  className = '',
  delay = 0,
  stagger,
  duration,
  start = 'top 88%',
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement>(null)

  // Tokenize once per content change.
  const tokens = useMemo(() => {
    if (variant === 'chars') return Array.from(children)
    return children.split(/(\s+)/) // words + whitespace preserved
  }, [children, variant])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const targets = Array.from(
      el.querySelectorAll<HTMLElement>('[data-atxt-inner]'),
    )
    if (targets.length === 0) return

    const tokenDuration = duration ?? (variant === 'chars' ? 0.9 : 0.7)
    const tokenStagger = stagger ?? (variant === 'chars' ? 0.018 : 0.04)

    // Pre-apply the transition + per-token delay. This way when we flip the
    // transform to translateY(0), the browser animates it natively without
    // any JS frame loop. CSS transitions are immune to React StrictMode
    // re-mounts and to GSAP plugin lifecycle issues — the transform we set
    // sticks because no one else is fighting for the inline-style attribute.
    targets.forEach((t, i) => {
      t.style.transition = `transform ${tokenDuration}s cubic-bezier(0.16, 1, 0.3, 1)`
      t.style.transitionDelay = `${delay + i * tokenStagger}s`
    })

    if (reduced) {
      // Reveal instantly, no transition.
      targets.forEach((t) => {
        t.style.transition = 'none'
        t.style.transform = 'translateY(0)'
      })
      return
    }

    let fired = false
    const reveal = () => {
      if (fired) return
      fired = true
      // requestAnimationFrame so the browser commits the initial
      // translate-y-full state first; otherwise the transition wouldn't
      // play because the from-state and to-state would be set in the same
      // paint frame.
      requestAnimationFrame(() => {
        targets.forEach((t) => {
          t.style.transform = 'translateY(0)'
        })
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          reveal()
          observer.disconnect()
        }
      },
      { threshold: 0, rootMargin: '0px 0px 0px 0px' },
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [variant, delay, stagger, duration, start])

  const renderedTokens: ReactNode[] = tokens.map((tok, i) => {
    if (/^\s+$/.test(tok)) {
      // Preserve whitespace literally (no mask wrapper).
      return <span key={i}>{tok}</span>
    }
    return (
      <span
        key={i}
        // Outer wrapper is the mask. Inline-block + overflow:hidden so the
        // child can slide from y:100% without affecting layout.
        className="inline-block overflow-hidden align-bottom"
        style={{ lineHeight: 'inherit' }}
        aria-hidden="true"
      >
        <span
          data-atxt-inner
          // Initial transform via Tailwind class — NOT inline style.
          // React inline `style` props are re-applied on every render,
          // which would clobber GSAP's animated transform. Class-based
          // transforms stay put; GSAP's inline transform overrides them.
          className="inline-block translate-y-full will-change-transform"
        >
          {tok === ' ' ? '\u00A0' : tok}
        </span>
      </span>
    )
  })

  return createElement(
    as,
    {
      ref,
      className,
      // Keep the original string available to assistive tech.
      'aria-label': children,
    },
    renderedTokens,
  )
}
