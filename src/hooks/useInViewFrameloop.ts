/**
 * useInViewFrameloop — an R3F <Canvas frameloop> value that renders only when
 * the scene is actually on screen and the tab is visible.
 *
 * R3F's frameloop prop is reactive: flipping it to 'never' stops the render
 * loop entirely, useFrame callbacks included. That makes this the idiomatic
 * replacement for hand-rolled IntersectionObserver + visibilitychange gating
 * around a raw rAF loop.
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
): 'always' | 'never' {
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

  return onScreen && tabVisible ? 'always' : 'never'
}
