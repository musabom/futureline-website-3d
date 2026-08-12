/**
 * ThreeActStoryScene — canvas host for the scroll story.
 *
 * Only the particles live here. Caption opacity and the progress rail are
 * painted by the section from ScrollTrigger's own updates, deliberately not
 * from this frame loop: scroll-linked copy must keep working when the canvas
 * is paused offscreen, in a background tab, or absent because WebGL failed.
 */
'use client'

import { useRef } from 'react'
import { SceneCanvas } from '@/components/three/SceneCanvas'
import { useInViewFrameloop } from '@/hooks/useInViewFrameloop'
import { ThreeActStoryCanvas } from './ThreeActStoryCanvas'

interface Props {
  progressRef: React.MutableRefObject<number>
  labelRefs: React.MutableRefObject<(HTMLElement | null)[]>
}

export function ThreeActStoryScene({ progressRef, labelRefs }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const frameloop = useInViewFrameloop(hostRef)

  return (
    <div ref={hostRef} aria-hidden className="absolute inset-0 z-0">
      <SceneCanvas frameloop={frameloop} camera={{ position: [0, 0, 7], fov: 45 }}>
        <ThreeActStoryCanvas progressRef={progressRef} labelRefs={labelRefs} />
      </SceneCanvas>
    </div>
  )
}
