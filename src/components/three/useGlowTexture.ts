/**
 * useGlowTexture — soft radial sprite so Points render as glowing orbs.
 *
 * Two non-obvious requirements come with it:
 *
 * 1. colorSpace must be SRGBColorSpace. Since three r152 a CanvasTexture used
 *    as a colour map is treated as linear unless told otherwise, which leaves
 *    the glow looking slightly washed out.
 *
 * 2. The geometry it is applied to must have no `uv` attribute. If a Points
 *    geometry carries UVs, three samples the map per-vertex instead of per
 *    fragment via gl_PointCoord, and every point renders as a hard square
 *    rather than a soft circle. Call geometry.deleteAttribute('uv').
 */
'use client'

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

export function useGlowTexture(size = 64) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    const half = size / 2
    const grad = ctx.createRadialGradient(half, half, 0, half, half, half)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.4, 'rgba(255,255,255,0.8)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [size])

  // A route change unmounts the canvas — the prototype never had to care
  // because its page never went away.
  useEffect(() => () => texture.dispose(), [texture])

  return texture
}
