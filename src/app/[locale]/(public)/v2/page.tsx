/**
 * /v2 — staging route for the light redesign.
 *
 * Noindexed and unlinked. Sections are built and reviewed here while the live
 * home page stays untouched; at cutover this composition moves into
 * (public)/page.tsx and this route is deleted.
 *
 * Still to come: the WebGL hero (stage 5), the three-act scroll story
 * (stage 6) and Vision & Mission (stage 7), which slot in above the
 * differentiator strip.
 */
import type { Metadata } from 'next';
import { AmbientMesh } from '@/components/ui/AmbientMesh';
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

      {/* Placeholder for the WebGL hero — replaced in stage 5. */}
      <section className="relative z-10 flex min-h-[60vh] items-center justify-center px-6 py-24 text-center">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-pill border border-hairline bg-canvas-card px-4 py-2 font-display text-xs font-semibold uppercase tracking-[0.2em] text-navy fl-elev-1">
            <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse-ring" />
            AI Consulting · Applications · Training
          </p>
          <h1 className="mb-3 font-display text-6xl font-bold tracking-tight md:text-8xl">
            <span className="fl-text-gradient animate-gradient-flow">FutureLine</span>
          </h1>
          <p className="mb-5 font-display text-sm font-semibold uppercase tracking-[0.4em] text-teal">
            Design · Deploy · Evolve
          </p>
          <p className="mx-auto max-w-xl text-lg text-ink-muted">
            An Omani company turning AI from talk into practice — we advise, we build, and we
            train, in Arabic and English side by side.
          </p>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-ink-muted/60">
            WebGL hero lands in stage 5
          </p>
        </div>
      </section>

      {/* z-10 keeps content above the fixed ambient mesh. */}
      <div className="relative z-10">
        <DifferentiatorStrip />
        <ThreePillars />
        <WhoWeServe />
        <ReadinessCTA />
        <FaqAccordion />
      </div>
    </main>
  );
}
