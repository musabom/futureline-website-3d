/**
 * Client-only wrapper for the hero's WebGL scene.
 *
 * Only the <Canvas> is behind ssr:false — never the surrounding copy. The
 * headline, tagline and sub-copy live in GlobeHero.tsx and are server
 * rendered, so they are in the HTML for crawlers and are the LCP element.
 * (NeuralPathwayLazy wraps its entire section this way, which is why that
 * section's headings are missing from the server HTML — not repeated here.)
 */
'use client'

import dynamic from 'next/dynamic'

export default dynamic(
  () => import('./GlobeHeroScene').then((m) => m.GlobeHeroScene),
  { ssr: false },
)
