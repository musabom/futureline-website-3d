/**
 * Nav — fixed top nav.
 * - Transparent over the hero, solidifies (blur + border) once scrolled past the fold.
 * - Hides on scroll-down, reveals on scroll-up (chrome.com / linear.app pattern).
 * - Native HTML, keyboard-accessible.
 */
'use client'

import { useEffect, useState } from 'react'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = 0
    let raf = 0

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 40)
        // Only auto-hide after the hero (200px past the fold).
        setHidden(y > lastY && y > 200)
        lastY = y
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <nav
      aria-label="Primary"
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-white/5 bg-black/60 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
        hidden ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="/"
          className="flex items-center gap-2 text-brand-fg"
          aria-label="FUTURE LINE home"
        >
          <span className="h-2 w-2 rounded-full bg-brand-accent shadow-[0_0_12px_2px_rgba(125,211,252,0.6)]" />
          <span className="text-sm font-semibold tracking-[0.08em]">
            FUTURE LINE
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {[
            { label: 'Platform', href: '#platform' },
            { label: 'Features', href: '#features' },
            { label: 'Customers', href: '#customers' },
            { label: 'Docs', href: '#docs' },
          ].map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#signin"
            className="hidden px-3 py-2 text-sm text-white/70 transition-colors hover:text-white md:inline-block"
          >
            Sign in
          </a>
          <a
            href="#start"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
          >
            Start free
          </a>
        </div>
      </div>
    </nav>
  )
}
