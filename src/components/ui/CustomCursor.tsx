/**
 * CustomCursor — lusion-style follower cursor with magnetic targets +
 *                periodic brand-burst (cursor morphs into a marketing phrase).
 * ---------------------------------------------------------------------------
 * What it is:
 *   - A small white dot (the precise pointer) that tracks the mouse 1:1.
 *   - A larger soft blob (the spotlight) that follows with eased latency
 *     and grows over interactive elements.
 *   - Magnetic attraction: [data-cursor="magnetic"] elements translate
 *     toward the cursor when it enters their hitbox.
 *   - Brand burst: every so often the dot morphs into a small marketing
 *     pill ("FutureLine — your Digitalisation partner", etc.) that
 *     tracks the cursor for ~2.8s, then collapses back to the dot.
 *
 * Burst cadence (hybrid):
 *   - Fires when the cursor has been still for ≥ 2s, OR
 *   - Force-fires after 20s if the user has been moving continuously.
 *   - Suppressed while hovering an interactive element (so it never
 *     interferes with intent to click).
 *
 * Phrase pool: 20 short brand lines, drawn from a shuffled deck so the
 * same phrase never repeats until the full deck has been seen.
 *
 * Accessibility:
 *   - Disabled on touch / coarse-pointer devices.
 *   - Disabled when prefers-reduced-motion is set.
 *   - All elements aria-hidden so screen readers ignore them.
 */
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const BRAND_PHRASES = [
  'FutureLine — your digitalisation partner',
  'Built for operators, not theory',
  'Software that fits your team',
  'Live in weeks. Not years.',
  'Custom systems. No licence tax.',
  'Robots do the boring.',
  'Paper out. Systems in.',
  'Built around your day-to-day',
  'Systems that earn their keep',
  'Useful, not magic',
  'Turn AI into income',
  'Learn AI. Build leverage.',
  'From scroll to skill',
  'AI that pays for itself',
  'Skills the market actually pays for',
  "47% fail. Yours won't.",
  'Plain-English, evidence-based',
  'Start with a free audit',
  'We ship systems people use',
  "The operator's approach",
] as const

// Fisher–Yates shuffle so the deck is randomized per session.
function shuffled<T>(arr: readonly T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const blobRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const phraseRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reduced) return

    const dot = dotRef.current
    const blob = blobRef.current
    const label = labelRef.current
    const phraseEl = phraseRef.current
    if (!dot || !blob || !label || !phraseEl) return

    dot.style.display = 'block'
    blob.style.display = 'block'
    label.style.display = 'flex'
    document.documentElement.classList.add('cursor-hidden')

    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' })
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' })
    const setBlobX = gsap.quickTo(blob, 'x', { duration: 0.4, ease: 'power3.out' })
    const setBlobY = gsap.quickTo(blob, 'y', { duration: 0.4, ease: 'power3.out' })
    // Label trails the cursor with a small lag so it's readable while tracking.
    const setLabelX = gsap.quickTo(label, 'x', { duration: 0.22, ease: 'power3.out' })
    const setLabelY = gsap.quickTo(label, 'y', { duration: 0.22, ease: 'power3.out' })

    // Hybrid trigger state.
    let deck = shuffled(BRAND_PHRASES)
    let deckIndex = 0
    let lastMoveAt = performance.now()
    let lastBurstAt = performance.now()
    let burstActive = false
    let hovering = false
    const IDLE_MS = 2000
    const MAX_GAP_MS = 20000
    const BURST_HOLD_MS = 3400

    const fireBurst = () => {
      if (burstActive) return
      // Pull next phrase from the deck; reshuffle when exhausted.
      if (deckIndex >= deck.length) {
        deck = shuffled(BRAND_PHRASES)
        deckIndex = 0
      }
      const phrase = deck[deckIndex++]
      phraseEl.textContent = phrase
      burstActive = true
      lastBurstAt = performance.now()

      // Hide the dot/blob during the burst — the phrase IS the cursor now.
      gsap.to(dot, { opacity: 0, scale: 0.2, duration: 0.25, ease: 'power3.out' })
      gsap.to(blob, { opacity: 0, scale: 0.6, duration: 0.25, ease: 'power3.out' })
      gsap.fromTo(
        label,
        { opacity: 0, scale: 0.7, y: '+=8' },
        { opacity: 1, scale: 1, y: '-=8', duration: 0.42, ease: 'back.out(1.6)' },
      )

      window.setTimeout(() => {
        gsap.to(label, {
          opacity: 0,
          scale: 0.9,
          duration: 0.35,
          ease: 'power3.in',
        })
        gsap.to(dot, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power3.out',
          delay: 0.15,
        })
        gsap.to(blob, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'power3.out',
          delay: 0.15,
        })
        window.setTimeout(() => {
          burstActive = false
          lastMoveAt = performance.now()
        }, 450)
      }, BURST_HOLD_MS)
    }

    const tickIntervalId = window.setInterval(() => {
      if (burstActive || hovering) return
      const now = performance.now()
      const idleFor = now - lastMoveAt
      const sinceLast = now - lastBurstAt
      // Idle-preferred firing, with a hard ceiling so it still fires if
      // the user is moving continuously.
      if (idleFor >= IDLE_MS && sinceLast >= 8000) fireBurst()
      else if (sinceLast >= MAX_GAP_MS) fireBurst()
    }, 400)

    const onMove = (e: MouseEvent) => {
      setDotX(e.clientX)
      setDotY(e.clientY)
      setBlobX(e.clientX)
      setBlobY(e.clientY)
      // Offset the label so it doesn't sit on top of the pointer.
      setLabelX(e.clientX + 26)
      setLabelY(e.clientY + 26)
      lastMoveAt = performance.now()
    }
    document.addEventListener('mousemove', onMove, { passive: true })

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
        hovering = true
      }
      if (mode === 'magnetic' && !magneticHandlers.has(target)) {
        const strength = Number(target.dataset.cursorStrength ?? 18)
        const move = (ev: MouseEvent) => {
          const rect = target.getBoundingClientRect()
          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          const dx = ev.clientX - cx
          const dy = ev.clientY - cy
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
      const from = (e.target as Element | null)?.closest?.('[data-cursor]')
      const to = (e.relatedTarget as Element | null)?.closest?.('[data-cursor]')
      if (from && !to) {
        blob.classList.remove('is-hover')
        hovering = false
      }
    }

    document.addEventListener('pointerover', onPointerOver)
    document.addEventListener('pointerout', onPointerOut)

    const onBlur = () => {
      dot.style.opacity = '0'
      blob.style.opacity = '0'
      label.style.opacity = '0'
    }
    const onFocus = () => {
      dot.style.opacity = '1'
      blob.style.opacity = '1'
    }
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)

    return () => {
      window.clearInterval(tickIntervalId)
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
      <div
        ref={blobRef}
        aria-hidden="true"
        className="custom-cursor-blob pointer-events-none fixed left-0 top-0 z-[9999] hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15 backdrop-blur-[2px] transition-[width,height,background-color] duration-300 ease-out"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="custom-cursor-dot pointer-events-none fixed left-0 top-0 z-[10000] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={labelRef}
        aria-hidden="true"
        className="custom-cursor-label pointer-events-none fixed left-0 top-0 z-[10001] hidden -translate-x-1/2 -translate-y-1/2 items-center gap-4 whitespace-nowrap rounded-full border border-lab/60 bg-black/85 py-3.5 pl-5 pr-7 opacity-0 shadow-[0_0_50px_-2px_rgba(24,169,153,0.55),inset_0_0_0_1px_rgba(24,169,153,0.18)] backdrop-blur-xl"
        style={{ willChange: 'transform, opacity' }}
      >
        <span
          aria-hidden="true"
          className="flex items-center gap-2.5 border-r border-white/15 pr-4 font-mono text-[10px] uppercase tracking-[0.32em] text-lab"
        >
          <span
            aria-hidden="true"
            className="block h-1.5 w-1.5 rounded-full bg-lab"
            style={{ boxShadow: '0 0 10px 2px rgba(24, 169, 153, 0.7)' }}
          />
          FL · Lab
        </span>
        <span
          ref={phraseRef}
          className="text-[15px] font-medium leading-none tracking-[-0.005em] text-white md:text-base"
        >
          &nbsp;
        </span>
      </div>
      <style jsx global>{`
        html.cursor-hidden,
        html.cursor-hidden * {
          cursor: none !important;
        }
        .custom-cursor-blob.is-hover {
          width: 4.5rem;
          height: 4.5rem;
          background-color: rgba(24, 169, 153, 0.18);
        }
      `}</style>
    </>
  )
}
