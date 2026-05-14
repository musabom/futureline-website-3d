import type { Metadata } from 'next';
import { ParticleHero } from '@/components/sections/ParticleHero';
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

      {/* Twin abstract corridor — FL Lab (cyan) left, FL Academy (gold) right.
          3D scene ported verbatim from futureline-3d. */}
      <DualWalkway />

      <MarqueeStrip
        items={['FL Lab', 'FL Academy', 'Build', 'Teach', 'Ship', 'Repeat']}
        speed={32}
      />

      <FeaturesGrid />

      <CaseStudy />

      <MarqueeStrip
        items={[
          'Digitalisation',
          'Custom Software',
          'Automations',
          'Consultation',
          'Systems Built for Scale',
        ]}
        speed={26}
        direction="right"
      />

      <Records />

      <FinalCTA />
    </main>
  );
}
