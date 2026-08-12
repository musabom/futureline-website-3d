/**
 * /v2 — staging route for the light redesign.
 *
 * Noindexed and unlinked. Sections are built and reviewed here while the live
 * home page stays untouched; at cutover this composition moves into
 * (public)/page.tsx and this route is deleted.
 *
 * Composition is now complete; the cutover moves it to (public)/page.tsx.
 */
import type { Metadata } from 'next';
import { AmbientMesh } from '@/components/ui/AmbientMesh';
import { GlobeHero } from '@/components/sections/GlobeHero';
import { ThreeActStory } from '@/components/sections/ThreeActStory';
import { VisionMission } from '@/components/sections/VisionMission';
import { DifferentiatorStrip } from '@/components/sections/DifferentiatorStrip';
import { ThreePillars } from '@/components/sections/ThreePillars';
import { WhoWeServe } from '@/components/sections/WhoWeServe';
import { ReadinessCTA } from '@/components/sections/ReadinessCTA';
import { FaqAccordion } from '@/components/sections/FaqAccordion';

export const metadata: Metadata = {
  title: 'v2 — light redesign staging',
  robots: { index: false, follow: false },
};

export default function V2Page() {
  return (
    <main className="fl-light relative bg-canvas text-ink">
      <AmbientMesh />

      <div className="relative z-10">
        <GlobeHero />
      </div>

      {/* z-10 keeps content above the fixed ambient mesh. */}
      <div className="relative z-10">
        <ThreeActStory />
        <VisionMission />
        <DifferentiatorStrip />
        <ThreePillars />
        <WhoWeServe />
        <ReadinessCTA />
        <FaqAccordion />
      </div>
    </main>
  );
}
