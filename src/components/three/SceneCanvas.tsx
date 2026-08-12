/**
 * SceneCanvas — house defaults for every R3F canvas in the redesign.
 *
 * The `flat` default is the important one. R3F's <Canvas> defaults to
 * flat={false}, which sets gl.toneMapping = ACESFilmicToneMapping. The
 * designs these scenes come from were built against a raw WebGLRenderer,
 * which uses NoToneMapping — so without `flat` the navy→teal→mint palette
 * renders visibly desaturated and milky, and it is very easy to lose an
 * afternoon hunting that in the material colours instead of the renderer.
 *
 * Pass flat={false} for scenes that genuinely want tone mapping — anything
 * using postprocessing/Bloom, e.g. NeuralPathway.
 */
'use client'

import { Canvas } from '@react-three/fiber'
import type { ReactNode } from 'react'
import { CanvasBoundary } from './CanvasBoundary'

interface Props {
  children: ReactNode
  /** 'demand' holds a static frame while paused — see useInViewFrameloop. */
  frameloop?: 'always' | 'demand' | 'never'
  /** Rendered if WebGL is unavailable or the scene throws. */
  fallback?: ReactNode
  /** Disable tone mapping. Default true; set false when using Bloom. */
  flat?: boolean
  camera?: { position?: [number, number, number]; fov?: number }
  className?: string
}

export function SceneCanvas({
  children,
  frameloop = 'always',
  fallback = null,
  flat = true,
  camera = { position: [0, 0, 5.2], fov: 45 },
  className,
}: Props) {
  return (
    <CanvasBoundary fallback={fallback}>
      <Canvas
        flat={flat}
        frameloop={frameloop}
        // Capped at 1.75 rather than 2: the extra pixels are invisible on
        // these soft, blurred scenes but cost real fill rate on retina.
        dpr={[1, 1.75]}
        camera={camera}
        className={className}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        {children}
      </Canvas>
    </CanvasBoundary>
  )
}
