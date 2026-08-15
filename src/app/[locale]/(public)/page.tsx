import type { Metadata } from 'next';
import { AmbientMesh } from '@/components/ui/AmbientMesh';
import { GlobeHero } from '@/components/sections/GlobeHero';
import { DifferentiatorStrip } from '@/components/sections/DifferentiatorStrip';
import { WhoWeServe } from '@/components/sections/WhoWeServe';
import { ReadinessCTA } from '@/components/sections/ReadinessCTA';

// Note: this page used to be force-dynamic solely because NeuralPathway's
// featured-course Prisma read lived here. NeuralPathway (+ that query) has
// moved to /courses — see that page for the admin `featuredSlot` wiring.
// Home can now render statically/cached again.
//
// ThreePillars (the 3 pillar cards) was removed from here by request — the
// options live on /get-started (page 2 of that flow) instead. Header,
// Footer, and the hero's "What we offer" CTA all point there instead of
// the old #services in-page anchor.
//
// ServiceHighlights (the 3 hero chips — AI Consulting / Apps & AI agents /
// Training & Vibe Coding, briefly given their own section here) was removed
// from home too, by the same request extended further: don't duplicate the
// service cards on the home page at all — /get-started already shows the
// same 3 categories, in more detail, vertically. ServiceHighlights.tsx is
// left in place (unused component, no functional risk) in case it's wanted
// again.

export const metadata: Metadata = {
  title: 'FutureLine.ai — AI Consulting · Applications · Training',
  description:
    'An Omani company turning AI from talk into practice — we advise, we build, and we train. AI consulting, custom applications and AI agents, and applied training including the Vibe Coding programme. Muscat, Sultanate of Oman.',
  openGraph: {
    title: 'FutureLine.ai — Making everyone a leader in AI',
    description:
      'AI consulting, applications and training. Muscat, Sultanate of Oman.',
    type: 'website',
    url: '/',
  },
};

export default function Home() {
  return (
    <main className="fl-light relative bg-canvas text-ink">
      <AmbientMesh />

      <div className="relative z-10">
        <GlobeHero />
      </div>

      <div className="relative z-10">
        <DifferentiatorStrip />
        <WhoWeServe />
        <ReadinessCTA />
      </div>
    </main>
  );
}
