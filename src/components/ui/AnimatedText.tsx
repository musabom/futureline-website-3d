/**
 * AnimatedText — masked reveals on scroll.
 *
 * variant="chars" — each character animates independently, BUT chars
 * are grouped by word so the browser never breaks a word mid-letter.
 * Each word is an inline-block atom; chars inside each word get the
 * masked translateY reveal with staggered transition delays.
 *
 * variant="words" — each word is its own masked block, animating as a
 * whole. Cheaper for body copy; never has the word-break risk.
 *
 * Respects prefers-reduced-motion (instant reveal, no transition).
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

    // Safety net: if for any reason the observer never fires (JS slow,
    // element off-screen on load + the user never scrolls to it, browser
    // quirks), reveal the text after 2.5s so content is NEVER permanently
    // invisible. Real users scrolling normally hit the observer well
    // before this timeout.
    const safety = window.setTimeout(reveal, 2500)

    return () => {
      observer.disconnect()
      window.clearTimeout(safety)
    }
  }, [variant, delay, stagger, duration, start])

  // Build the render tree. Both variants tokenise to WORDS first so the
  // browser only breaks lines at whitespace — never inside a word.
  const words = useMemo(() => children.split(/(\s+)/), [children])

  const charMask = (key: string | number, char: string) => (
    <span
      key={key}
      className="inline-block overflow-hidden align-bottom"
      style={{ lineHeight: 'inherit' }}
      aria-hidden="true"
    >
      <span
        data-atxt-inner
        className="inline-block translate-y-full will-change-transform"
      >
        {char}
      </span>
    </span>
  )

  const wordMask = (key: string | number, word: string) => (
    <span
      key={key}
      className="inline-block overflow-hidden align-bottom"
      style={{ lineHeight: 'inherit' }}
      aria-hidden="true"
    >
      <span
        data-atxt-inner
        className="inline-block translate-y-full will-change-transform"
      >
        {word}
      </span>
    </span>
  )

  const renderedTokens: ReactNode[] = words.map((w, i) => {
    // Whitespace passes through literally so line-breaking still works.
    if (/^\s+$/.test(w)) return <span key={i}>{w}</span>

    if (variant === 'chars') {
      // Wrap each WORD as an inline-block atom that cannot break
      // mid-word, then individually mask each character inside it.
      return (
        <span
          key={i}
          className="inline-block whitespace-nowrap"
          style={{ lineHeight: 'inherit' }}
        >
          {Array.from(w).map((char, ci) => charMask(`${i}-${ci}`, char))}
        </span>
      )
    }

    // variant === 'words' — one mask per word
    return wordMask(i, w)
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
