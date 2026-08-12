/**
 * GlobeHeroScene — canvas host for the hero globe.
 *
 * Owns the three things the scene itself shouldn't care about: pausing when
 * offscreen, tracking the cursor, and falling back when WebGL is unavailable.
 */
'use client'

import { useRef } from 'react'
import { SceneCanvas } from '@/components/three/SceneCanvas'
import { useInViewFrameloop } from '@/hooks/useInViewFrameloop'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { GlobeHeroCanvas } from './GlobeHeroCanvas'
import { ConstellationFallback } from './ConstellationFallback'

export function GlobeHeroScene() {
  const hostRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const frameloop = useInViewFrameloop(hostRef)
  const reduced = usePrefersReducedMotion()

  // Under reduced motion the scene never mounts at all — a static aurora
  // wash is already provided by the section behind this layer.
  if (reduced) return null

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    pointerRef.current.x = (e.clientX - rect.left) / rect.width - 0.5
    pointerRef.current.y = (e.clientY - rect.top) / rect.height - 0.5
  }

  const resetPointer = () => {
    pointerRef.current.x = 0
    pointerRef.current.y = 0
  }

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="absolute inset-0"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <SceneCanvas frameloop={frameloop} fallback={<ConstellationFallback />}>
        <GlobeHeroCanvas pointerRef={pointerRef} />
      </SceneCanvas>
    </div>
  )
}
