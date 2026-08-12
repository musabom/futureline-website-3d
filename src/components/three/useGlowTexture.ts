/**
 * useGlowTexture — soft radial sprite so THREE.Points render as round orbs
 * rather than hard squares.
 *
 * Two non-obvious details, both learned the hard way in the prototype:
 *
 * 1. colorSpace must be SRGBColorSpace. Since three r152 a CanvasTexture used
 *    as a colour map is treated as linear unless told otherwise, which leaves
 *    the glow looking slightly grey.
 *
 * 2. The geometry these points are drawn from must have NO uv attribute.
 *    If a Points geometry has uvs, three samples the sprite once per vertex
 *    instead of per fragment (gl_PointCoord) and every point renders as an
 *    opaque square — the texture appears to do nothing at all. Call
 *    geometry.deleteAttribute('uv') on any built-in geometry used with this.
 */
'use client'

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

export function useGlowTexture(size = 64): THREE.CanvasTexture {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    const r = size / 2
    const grad = ctx.createRadialGradient(r, r, 0, r, r, r)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.4, 'rgba(255,255,255,0.8)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)

    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [size])

  // Route changes unmount these scenes, unlike the single-page prototype.
  useEffect(() => () => texture.dispose(), [texture])

  return texture
}
