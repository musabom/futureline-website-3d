/**
 * SplashIntro — black-screen counter intro with a curtain reveal.
 * Plays at most once per browser session. Click to skip.
 */
'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const STORAGE_KEY = 'futureline_splash_played'

export function SplashIntro() {
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(false)
  const counterRef = useRef<HTMLSpanElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const lockBodyRef = useRef(false)
  const finishedRef = useRef(false)

  useEffect(() => {
    setMounted(true)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const played = sessionStorage.getItem(STORAGE_KEY) === '1'
    if (reduced || played) return
    setActive(true)
    document.body.style.overflow = 'hidden'
    lockBodyRef.current = true
  }, [])

  useEffect(() => {
    if (!active) return
    const counterEl = counterRef.current
    const topEl = topRef.current
    const bottomEl = bottomRef.current
    const markEl = markRef.current
    const labelEl = labelRef.current
    if (!counterEl || !topEl || !bottomEl || !markEl || !labelEl) return

    const tl = gsap.timeline({
      onComplete: () => finish(false),
    })

    tl.fromTo(
      [markEl, labelEl],
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.08 },
      0,
    )

    const num = { v: 0 }
    tl.to(
      num,
      {
        v: 100,
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: () => {
          counterEl.textContent = String(Math.floor(num.v))
        },
      },
      0.15,
    )

    tl.to({}, { duration: 0.18 })

    tl.to(
      [markEl, labelEl, counterEl.parentElement],
      { opacity: 0, duration: 0.25, ease: 'power2.in' },
      '>-0.05',
    )

    tl.to(
      topEl,
      { yPercent: -100, duration: 0.7, ease: 'expo.inOut' },
      '>-0.05',
    )
    tl.to(
      bottomEl,
      { yPercent: 100, duration: 0.7, ease: 'expo.inOut' },
      '<',
    )

    const onClick = () => finish(true)
    window.addEventListener('click', onClick)

    function finish(immediate: boolean) {
      if (finishedRef.current) return
      finishedRef.current = true
      sessionStorage.setItem(STORAGE_KEY, '1')
      window.removeEventListener('click', onClick)
      if (lockBodyRef.current) {
        document.body.style.overflow = ''
        lockBodyRef.current = false
      }
      if (immediate) {
        tl.kill()
        gsap.set(topEl, { yPercent: -100 })
        gsap.set(bottomEl, { yPercent: 100 })
      }
      setTimeout(() => setActive(false), immediate ? 50 : 100)
    }

    return () => {
      window.removeEventListener('click', onClick)
      tl.kill()
      if (lockBodyRef.current) {
        document.body.style.overflow = ''
        lockBodyRef.current = false
      }
    }
  }, [active])

  if (!mounted || !active) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-auto fixed inset-0 z-[10001] select-none"
    >
      <div
        ref={topRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-black"
      />
      <div
        ref={bottomRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-black"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div ref={markRef} className="flex items-center gap-2">
          <span className="block h-2 w-2 rounded-full bg-brand-accent" />
          <span className="font-mono text-sm tracking-[0.25em] text-white/85">
            FUTURELINE
          </span>
        </div>

        <div className="mt-12 flex items-baseline gap-2 font-mono">
          <span
            ref={counterRef}
            className="text-7xl font-semibold tracking-tight text-white tabular-nums md:text-9xl"
          >
            0
          </span>
          <span className="text-2xl text-white/40 md:text-3xl">%</span>
        </div>

        <div
          ref={labelRef}
          className="mt-16 text-[10px] uppercase tracking-[0.4em] text-white/35"
        >
          Systems built for scale
        </div>
      </div>
    </div>
  )
}
