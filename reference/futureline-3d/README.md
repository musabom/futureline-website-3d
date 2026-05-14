# futureline — Platform Reveal (scroll-driven cinematic section)

Drop-in scaffold for a mid-page, pinned, scroll-scrubbed 3D reveal on the landing page. Built on the canonical futureline stack: Next.js 15 (App Router) + React Three Fiber + drei + GSAP/ScrollTrigger + Lenis.

## File map

```
app/
  providers/SmoothScrollProvider.tsx   # mount once at the root
components/
  sections/PlatformReveal.tsx          # the scroll-driven cinematic section
hooks/
  usePrefersReducedMotion.ts           # WCAG 2.3.3 hook
  useGpuTier.ts                        # detect-gpu fallback gate
lib/
  lenis-gsap.ts                        # Lenis ↔ GSAP ticker sync
next.config.js                         # GLSL webpack rule
```

## Install

```bash
npm i three @react-three/fiber @react-three/drei @react-three/postprocessing \
  gsap lenis detect-gpu
npm i -D @types/three @gltf-transform/cli
```

## Wire it up

```tsx
// app/layout.tsx
import { SmoothScrollProvider } from './providers/SmoothScrollProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  )
}
```

```tsx
// app/page.tsx
import dynamic from 'next/dynamic'

// Lazy-mount the canvas — never let it become the LCP element.
const PlatformReveal = dynamic(
  () => import('@/components/sections/PlatformReveal'),
  { ssr: false }
)

export default function Landing() {
  return (
    <main>
      {/* ...hero with real <h1> and <img> above (these own LCP)... */}
      <PlatformReveal />
      {/* ...rest of landing... */}
    </main>
  )
}
```

## Required public assets

- `public/glb/product.glb` — processed via the gltf-transform recipe below. Target ≤ 2 MB.
- `public/hero/platform-poster.jpg` — single static frame for reduced-motion + low-GPU fallback. 1920×1080, JPEG 80, ≤ 250 KB.

## Editing the choreography

Open `components/sections/PlatformReveal.tsx`. Edit the `CHAPTERS` array:

```ts
const CHAPTERS = [
  { progress: 0.00, cameraPos: [0, 0.2, 6.0], modelRot: [0, -0.4, 0], copyIndex: 0 },
  // add / remove / re-time as needed
]
```

Each chapter is a stable pose. Progress between them scrubs with a smoothstep ease — that's where the cinematic "hold-frames" feel comes from. Keep `progress` ascending.

`COPY[]` controls the eyebrow + heading that swap on chapter change.
