'use client';

import dynamic from 'next/dynamic';

// Lazy-load the canvas so it doesn't ship in the SSR bundle and never
// blocks LCP on the host page. Mirrors the DualWalkwayLazy pattern.
const HeroRibbon3D = dynamic(() => import('./HeroRibbon3D'), {
  ssr: false,
});

export default HeroRibbon3D;
