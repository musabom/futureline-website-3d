import type { Metadata } from 'next';
import NeuralPathway from '@/components/sections/NeuralPathwayLazy';
import { prisma } from '@/lib/prisma';
import { AmbientMesh } from '@/components/ui/AmbientMesh';
import { GlobeHero } from '@/components/sections/GlobeHero';
import { ThreeActStory } from '@/components/sections/ThreeActStory';
import { VisionMission } from '@/components/sections/VisionMission';
import { DifferentiatorStrip } from '@/components/sections/DifferentiatorStrip';
import { ThreePillars } from '@/components/sections/ThreePillars';
import { WhoWeServe } from '@/components/sections/WhoWeServe';
import { ReadinessCTA } from '@/components/sections/ReadinessCTA';
import { FaqAccordion } from '@/components/sections/FaqAccordion';

// Force-dynamic so featured-course changes from the admin show up on
// the next page load rather than the next build.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'FutureLine.ai — AI Consulting · Applications · Training',
  description:
    'An Omani company turning AI from talk into practice — we advise, we build, and we train, in Arabic and English. AI consulting, custom applications and AI agents, and applied training including the Vibe Coding programme. Muscat, Sultanate of Oman.',
  openGraph: {
    title: 'FutureLine.ai — Making everyone a leader in AI',
    description:
      'AI consulting, applications and training, in Arabic and English. Muscat, Sultanate of Oman.',
    type: 'website',
    url: '/',
  },
};

export default async function Home() {
  // Server-fetch the up-to-3 admin-featured courses. Each course holds a
  // unique slot (1/2/3) — these get merged into the NeuralPathway scene
  // as the labels/descriptions/links for its first 3 active topics. The
  // 4th topic is the locked Browse-all CTA card (not featurable).
  const featuredCourseRows = await prisma.course.findMany({
    where: {
      featuredSlot: { not: null },
      status: 'PUBLISHED',
      approvalStatus: 'APPROVED',
    },
    select: {
      featuredSlot: true,
      title: true,
      shortDescription: true,
      slug: true,
      highlightStatValue: true,
      highlightStatLabel: true,
      highlightBullets: true,
    },
  });
  const featuredCourses = featuredCourseRows
    .filter((c): c is typeof c & { featuredSlot: number } => c.featuredSlot !== null)
    .map((c) => ({
      slot: c.featuredSlot,
      title: c.title,
      shortDescription: c.shortDescription,
      slug: c.slug,
      // Highlight overrides — pass undefined when the admin left them
      // blank, so the NeuralPathway slot-default falls through cleanly.
      highlightStatValue: c.highlightStatValue || undefined,
      highlightStatLabel: c.highlightStatLabel || undefined,
      highlightBullets: c.highlightBullets.length > 0 ? c.highlightBullets : undefined,
    }));

  return (
    <main className="fl-light relative bg-canvas text-ink">
      <AmbientMesh />

      <div className="relative z-10">
        <GlobeHero />
      </div>

      <div className="relative z-10">
        {/* The three pillars as one continuous scroll movement. */}
        <ThreeActStory />
        <VisionMission />
        <DifferentiatorStrip />
        <ThreePillars />
        <WhoWeServe />

        {/* FL Academy — kept from the previous home. The admin's
            featuredSlot control writes into this scene, so removing it
            would silently orphan a shipped admin feature. */}
        <NeuralPathway featuredCourses={featuredCourses} />

        <ReadinessCTA />
        <FaqAccordion />
      </div>
    </main>
  );
}
