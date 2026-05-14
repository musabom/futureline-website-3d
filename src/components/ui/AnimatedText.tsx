/**
 * AnimatedText — masked char-by-char or word-by-word reveals.
 * variant="chars" for short headlines; variant="words" for body copy.
 * Respects prefers-reduced-motion.
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

  const tokens = useMemo(() => {
    if (variant === 'chars') return Array.from(children)
    return children.split(/(\s+)/)
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

    targets.forEach((t, i) => {
      t.style.transition = `transform ${tokenDuration}s cubic-bezier(0.16, 1, 0.3, 1)`
      t.style.transitionDelay = `${delay + i * tokenStagger}s`
    })

    if (reduced) {
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
      return <span key={i}>{tok}</span>
    }
    return (
      <span
        key={i}
        className="inline-block overflow-hidden align-bottom"
        style={{ lineHeight: 'inherit' }}
        aria-hidden="true"
      >
        <span
          data-atxt-inner
          className="inline-block translate-y-full will-change-transform"
        >
          {tok === ' ' ? ' ' : tok}
        </span>
      </span>
    )
  })

  return createElement(
    as,
    {
      ref,
      className,
      'aria-label': children,
    },
    renderedTokens,
  )
}
