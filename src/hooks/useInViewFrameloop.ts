/**
 * useInViewFrameloop — an R3F <Canvas frameloop> value that animates only
 * while the scene is on screen and the tab is visible.
 *
 * R3F's frameloop prop is reactive, which makes this the idiomatic
 * replacement for hand-rolled IntersectionObserver + visibilitychange gating
 * around a raw rAF loop.
 *
 * Pauses to 'demand', deliberately not 'never'. With 'never' R3F does not
 * render *at all* — not even an initial frame — so a scene that mounts while
 * paused shows an empty canvas rather than a still image. 'demand' draws once
 * on mount and then only on invalidation, so a paused scene holds a static
 * frame. That matters whenever a canvas mounts in a background tab, and it is
 * also what makes the scene visible immediately on scroll-in instead of one
 * frame late.
 *
 * Worth applying to existing canvases too — a <Canvas> left at
 * frameloop="always" keeps rendering at 60fps while the user reads a section
 * three viewports further down.
 */
'use client'

import { useEffect, useState, type RefObject } from 'react'

export function useInViewFrameloop(
  ref: RefObject<HTMLElement | null>,
  { rootMargin = '200px' }: { rootMargin?: string } = {},
): 'always' | 'demand' {
  const [onScreen, setOnScreen] = useState(false)
  const [tabVisible, setTabVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      // No observer support: fail open so the scene still animates.
      setOnScreen(true)
      return
    }
    // rootMargin starts the loop slightly before the section scrolls in, so
    // the first visible frame is already animated rather than a frozen pose.
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])

  useEffect(() => {
    const onChange = () => setTabVisible(!document.hidden)
    onChange()
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  return onScreen && tabVisible ? 'always' : 'demand'
}
