/**
 * useGpuTier — classify the device GPU on mount.
 *
 * Tier 0 / 1: low — render static poster (or pre-rendered video).
 * Tier 2:     medium — render scene with reduced postprocessing.
 * Tier 3:     high — full-quality scene + postprocess.
 *
 * Returns null until the async detection resolves so callers can render a
 * neutral placeholder (no layout shift, no flash of canvas).
 */
'use client'

import { useEffect, useState } from 'react'
import { getGPUTier } from 'detect-gpu'

export type GpuTier = 0 | 1 | 2 | 3

export function useGpuTier(): GpuTier | null {
  const [tier, setTier] = useState<GpuTier | null>(null)

  useEffect(() => {
    let mounted = true
    getGPUTier().then((result) => {
      if (mounted) setTier((result.tier ?? 1) as GpuTier)
    })
    return () => {
      mounted = false
    }
  }, [])

  return tier
}
