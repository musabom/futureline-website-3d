'use client';

import dynamic from 'next/dynamic';

// Match the DualWalkway lazy pattern: ssr:false so the canvas never
// ships in SSR, never blocks LCP.
const NeuralPathway = dynamic(() => import('./NeuralPathway'), {
  ssr: false,
});

export default NeuralPathway;
