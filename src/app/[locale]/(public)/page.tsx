import type { Metadata } from 'next';
import { ParticleHero } from '@/components/sections/ParticleHero';
import DualWalkway from '@/components/sections/DualWalkwayLazy';
import NeuralPathway from '@/components/sections/NeuralPathwayLazy';
import { CaseStudy } from '@/components/sections/CaseStudy';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { prisma } from '@/lib/prisma';

// Force-dynamic so featured-course changes from the admin show up on
// the next page load rather than the next build.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'FutureLine — Systems Built for Scale | Digital Transformation & Custom Software',
  description:
    'FutureLine builds the digital systems your business needs to scale: digitalisation, custom software, intelligent automations, and expert consultation. No jargon. No lock-in. Just results.',
  openGraph: {
    title: 'FutureLine — Systems Built for Scale',
    description:
      'FutureLine builds the digital systems your business needs to scale: digitalisation, custom software, intelligent automations, and expert consultation.',
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
    <main className="bg-brand-bg">
      <ParticleHero />

      {/* FL Lab — twin-corridor brand moment with 4 service cards. */}
      <DualWalkway />

      {/* FL Academy — neural-pathway learning network. 3 admin-featurable
          slots (admin sets featuredSlot on a Course) + a locked centered
          Browse-all card on the final scroll step. */}
      <NeuralPathway featuredCourses={featuredCourses} />

      {/* Trust band — the 47% / case-study editorial. */}
      <CaseStudy />

      <FinalCTA />
    </main>
  );
}
