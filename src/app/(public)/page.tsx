import type { Metadata } from 'next';
import { ParticleHero } from '@/components/sections/ParticleHero';
import { ServiceCards } from '@/components/sections/ServiceCards';
import DualWalkway from '@/components/sections/DualWalkwayLazy';
import { FeaturesGrid } from '@/components/sections/FeaturesGrid';
import { CaseStudy } from '@/components/sections/CaseStudy';
import { Records } from '@/components/sections/Records';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { MarqueeStrip } from '@/components/ui/MarqueeStrip';

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

export default function Home() {
  return (
    <main className="bg-brand-bg">
      <ParticleHero />

      {/* What we offer — quick-scan marketing cards directly after the hero. */}
      <ServiceCards />

      <MarqueeStrip
        items={[
          'Digitalisation',
          'Custom Software',
          'Automations',
          'Consultation',
          'Systems Built for Scale',
        ]}
        speed={30}
      />

      {/* Deeper editorial dive into each service. */}
      <FeaturesGrid />

      <CaseStudy />

      {/* Brand experience moment — the 3D corridor, mid-page rather than
          being the first thing on scroll. */}
      <DualWalkway />

      <MarqueeStrip
        items={['FL Lab', 'FL Academy', 'Build', 'Teach', 'Ship', 'Repeat']}
        speed={28}
        direction="right"
      />

      <Records />

      <FinalCTA />
    </main>
  );
}
