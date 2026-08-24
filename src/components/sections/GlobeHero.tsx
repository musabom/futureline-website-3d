/**
 * GlobeHero — the hero section.
 *
 * Server rendered on purpose: the headline, tagline and sub-copy are in the
 * HTML, so they are the LCP element and are visible to crawlers. Only the
 * <Canvas> underneath is client-only.
 *
 * Layers, back to front: aurora glow → WebGL globe → perspective grid floor →
 * copy. The 3 "what we do" chips that used to float here (absolutely
 * positioned, overlapping the globe) moved to their own ServiceHighlights
 * section right after this one, by request — the hero now carries only the
 * headline/CTAs, no card content layered on top of it.
 */
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import GlobeHeroScene from './GlobeHeroCanvasLazy';
import { HeroNetwork } from './HeroNetwork';
import { DecodeText } from '@/components/ui/DecodeText';

export async function GlobeHero() {
  const t = await getTranslations('hero');
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative -mt-16 flex min-h-screen items-center justify-center overflow-hidden px-6 pb-24 pt-40"
    >
      {/* Dark cinematic base — sits behind everything so the hero reads dark
          and the video's highlights glow. Only this first section is dark;
          the rest of the page keeps the light canvas. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 12%, #071528 0%, #030b16 48%, #010305 100%)',
        }}
      />

      {/* Aurora behind the globe */}
      <div
        aria-hidden
        className="fl-aurora pointer-events-none absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full motion-safe:animate-orbit-spin"
      />

      {/* WebGL globe hologram — client only, never mounts under reduced
          motion. Wrapped in the same centre-fade mask as the plexus so it
          fades out behind the robot's column and reads as sitting behind the
          figure (visible around the edges), not over it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          // Brighter, more saturated, with a soft neon-blue glow around the
          // hologram's lines/nodes (drop-shadow follows their alpha).
          filter:
            'brightness(1.5) saturate(1.35) drop-shadow(0 0 6px rgba(66,140,255,0.85))',
          // Fade the hologram out over the robot's centre column so it reads
          // as sitting BEHIND the figure (visible around the edges), not over.
          maskImage:
            'radial-gradient(ellipse 38% 78% at 50% 45%, transparent 30%, rgba(0,0,0,0.55) 60%, #000 82%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 38% 78% at 50% 45%, transparent 30%, rgba(0,0,0,0.55) 60%, #000 82%)',
        }}
      >
        <GlobeHeroScene />
      </div>

      {/* Glowing cyan/blue network plexus — animated canvas, sits BEHIND the
          video (no z, so under the z-[1] video) so it reads around and behind
          the robot. A real continuous animation, not an image. */}
      <HeroNetwork />

      {/* TEST: cinematic hero video — the robot in the foreground.
          mix-blend-lighten composites it over the network below: the robot
          and its bright edges stay solid and clearly visible, while the
          video's dark background drops out so the AI network (the globe
          canvas above) shows through around and behind the figure. Full-bleed
          object-cover keeps it centred with the headline; z-[1] sits above
          the network/aurora, and the copy (z-10) stays on top. */}
      <video
        aria-hidden
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover mix-blend-lighten brightness-[0.62]"
      >
        <source src="/hero-cinematic.mp4" type="video/mp4" />
      </video>

      {/* Perspective grid floor */}
      <div
        aria-hidden
        className="fl-grid-floor pointer-events-none absolute inset-x-[-22%] bottom-0 h-[44%]"
      />

      {/* Copy */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="fl-glass-strong mb-7 inline-flex items-center gap-2.5 rounded-pill px-4 py-2 font-display text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-navy fl-elev-1">
          <span className="h-1.5 w-1.5 rounded-full bg-teal motion-safe:animate-pulse-ring" />
          {t('eyebrow')}
        </p>

        <h1
          id="hero-heading"
          className="mb-3 font-display text-[clamp(3.5rem,12vw,8.5rem)] font-bold leading-[0.95] tracking-[-0.04em]"
        >
          <span className="fl-text-sweep drop-shadow-[0_0_26px_rgba(45,212,191,0.35)]">
            FutureLine
          </span>
        </h1>

        <DecodeText
          text={t('tagline')}
          className="mb-6 font-display text-[clamp(0.9rem,2vw,1.25rem)] font-semibold tracking-[0.4em] text-teal"
        />

        <p className="mb-9 max-w-xl text-lg leading-relaxed text-white/75">{t('lede')}</p>

        {/* The "Get an AI readiness assessment" primary CTA used to sit
            here, linking to the #audit section. Moved to /get-started by
            request — the readiness assessment is offered there now, and
            this hero keeps a single CTA into that flow. The #audit
            section itself still exists at the bottom of this page and is
            still reachable (header CTA, footer link, /audit route). */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/get-started"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-pill bg-gradient-to-r from-navy via-teal to-mint px-7 py-3.5 font-display text-base font-semibold text-white shadow-[0_10px_24px_-8px_rgba(24,169,153,0.5)] transition-transform duration-300 hover:-translate-y-0.5"
            data-cursor="magnetic"
          >
            {t('secondaryCta')}
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180"
              aria-hidden
            />
            <span
              aria-hidden
              className="absolute inset-y-0 left-[-70%] w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent motion-safe:animate-sheen"
            />
          </Link>
        </div>
      </div>

      {/* Scroll cue — used to scroll to the #services section on this page;
          that section (ThreePillars) moved to /get-started, so this is now
          a real link there instead of an in-page anchor. */}
      <Link
        href="/get-started"
        aria-label="See what we offer"
        className="absolute bottom-6 left-1/2 z-10 flex h-10 w-6 -translate-x-1/2 justify-center rounded-pill border-[1.6px] border-white/30"
      >
        <span
          aria-hidden
          className="mt-1.5 h-2 w-1 rounded-pill bg-teal motion-safe:animate-cue-drop"
        />
      </Link>
    </section>
  );
}
