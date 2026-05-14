import { ParticleHero } from '@/components/sections/ParticleHero'
import DualWalkway from '@/components/sections/DualWalkwayLazy'
import { Records } from '@/components/sections/Records'
import { FeaturesGrid } from '@/components/sections/FeaturesGrid'
import { CaseStudy } from '@/components/sections/CaseStudy'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { MarqueeStrip } from '@/components/ui/MarqueeStrip'

export default function Home() {
  return (
    <main className="bg-brand-bg">
      {/* 01 — Canvas-particle hero. AI data streams form the 'futureline'
          wordmark. No WebGL, ~10 KB of code, no asset. */}
      <ParticleHero />

      {/* 01.5 — Twin abstract tunnels: FL Lab (cyan) on the left, FL Academy
          (gold) on the right. Scroll-driven flythrough between them. */}
      <DualWalkway />

      {/* Marquee strip — connective tissue */}
      <MarqueeStrip
        items={[
          'FL Lab',
          'FL Academy',
          'Build',
          'Teach',
          'Ship',
          'Repeat',
        ]}
        speed={32}
      />

      {/* 02 — Why the platform */}
      <FeaturesGrid />

      {/* 03 — Sticky case-study split */}
      <CaseStudy />

      {/* Marquee strip — opposite direction */}
      <MarqueeStrip
        items={[
          'Composable',
          'Resilient',
          'Auditable',
          'Observable',
          'Permissioned',
        ]}
        speed={26}
        direction="right"
      />

      {/* 04 — Real records from FL Lab + FL Academy */}
      <Records />

      {/* 05 — Closing CTA */}
      <FinalCTA />
    </main>
  )
}
