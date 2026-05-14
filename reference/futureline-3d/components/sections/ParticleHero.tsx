/**
 * ParticleHero — video-backed cinematic hero.
 * ---------------------------------------------------------------------------
 * Composite (deepest → top):
 *
 *   1. <video> — Kling-generated Voyager hull flyby (5s loop, 218 KB).
 *      Autoplay, muted, looped, inline. Hides itself onError so the page
 *      never breaks if /hero.mp4 is missing.
 *   2. Center vignette — keeps the wordmark legible on top of motion.
 *   3. CSS overlay — eyebrow + 'FUTURE LINE' wordmark (with RGB-split
 *      glitch animation) + subhead + CTAs + scroll cue.
 *
 * (The earlier Canvas particle layer has been removed; the video carries
 *  the full visual atmosphere on its own.)
 *
 * Accessibility:
 *   - Video is aria-hidden (decorative).
 *   - Wordmark is a real <h1> with the literal "FUTURE LINE" text.
 *   - prefers-reduced-motion: glitch + entrance animations disabled.
 *     The video continues to play (browsers honor the user's overall
 *     media-autoplay preferences anyway).
 * ---------------------------------------------------------------------------
 */
'use client'

export function ParticleHero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Video backdrop — Kling 'Voyager' hull flyby.
          autoPlay + muted + playsInline are required for mobile autoplay.
          onError hides the element so the page falls back to plain black
          (which then blends with the wordmark) rather than showing a
          broken-media glyph. */}
      <video
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          ;(e.currentTarget as HTMLVideoElement).style.display = 'none'
        }}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Center vignette — keeps the wordmark legible on top of motion */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="hero-eyebrow mb-8 font-mono text-xs uppercase tracking-[0.4em] text-white/55">
          Design · Deploy · Evolve
        </p>
        <h1
          id="hero-heading"
          className="hero-wordmark text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-white md:text-[clamp(4rem,12vw,12rem)]"
        >
          FUTURE LINE
        </h1>
        <p className="hero-sub mt-10 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
          The platform built from a thousand small signals.
        </p>
        <div className="hero-cta mt-12 flex items-center gap-2">
          <a
            href="#start"
            data-cursor="magnetic"
            data-cursor-strength="22"
            className="rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90"
          >
            Start free
          </a>
          <a
            href="#demo"
            data-cursor="hover"
            className="ml-2 px-3 py-3 text-sm text-white/70 transition-colors hover:text-white"
          >
            See it work →
          </a>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="hero-scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-white/40"
      >
        ↓ scroll
      </div>

      <style jsx>{`
        .hero-eyebrow {
          opacity: 0;
          transform: translateY(8px);
          animation: heroIn 800ms cubic-bezier(0.16, 1, 0.3, 1) 300ms forwards;
        }
        /* Wordmark: fade + scale in, then a long-cycle RGB-split glitch */
        .hero-wordmark {
          opacity: 0;
          transform: scale(0.97);
          text-shadow:
            -2px 0 0 rgba(244, 114, 182, 0),
            2px 0 0 rgba(125, 211, 252, 0);
          animation:
            heroWordmark 1500ms cubic-bezier(0.16, 1, 0.3, 1) 800ms forwards,
            heroGlitch 7s infinite 4s;
        }
        .hero-sub {
          opacity: 0;
          transform: translateY(12px);
          animation: heroIn 800ms cubic-bezier(0.16, 1, 0.3, 1) 1900ms forwards;
        }
        .hero-cta {
          opacity: 0;
          transform: translateY(12px);
          animation: heroIn 800ms cubic-bezier(0.16, 1, 0.3, 1) 2200ms forwards;
        }
        .hero-scroll-cue {
          opacity: 0;
          animation: heroIn 800ms cubic-bezier(0.16, 1, 0.3, 1) 2800ms forwards,
            scrollBob 2200ms ease-in-out 3600ms infinite;
        }
        @keyframes heroIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroWordmark {
          to {
            opacity: 0.97;
            transform: scale(1);
            text-shadow:
              -2px 0 0 rgba(244, 114, 182, 0.55),
              2px 0 0 rgba(125, 211, 252, 0.55);
          }
        }
        /* RGB-split glitch: holds clean state most of the cycle, then
           briefly offsets + saturates twice in succession every 7 seconds. */
        @keyframes heroGlitch {
          0%, 88%, 100% {
            transform: translate(0);
            text-shadow:
              -2px 0 0 rgba(244, 114, 182, 0.55),
              2px 0 0 rgba(125, 211, 252, 0.55);
          }
          89% {
            transform: translate(-3px, 0);
            text-shadow:
              -6px 0 0 rgba(244, 114, 182, 0.85),
              6px 0 0 rgba(125, 211, 252, 0.85);
          }
          90.5% {
            transform: translate(2px, -1px);
            text-shadow:
              4px 0 0 rgba(244, 114, 182, 0.9),
              -4px 0 0 rgba(125, 211, 252, 0.8);
          }
          92% {
            transform: translate(-1px, 1px);
            text-shadow:
              -5px 0 0 rgba(244, 114, 182, 0.7),
              5px 0 0 rgba(125, 211, 252, 0.7);
          }
          93.5% {
            transform: translate(0);
          }
        }
        @keyframes scrollBob {
          0%,
          100% {
            transform: translate(-50%, 0);
          }
          50% {
            transform: translate(-50%, 6px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-eyebrow,
          .hero-wordmark,
          .hero-sub,
          .hero-cta,
          .hero-scroll-cue {
            animation: none !important;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </section>
  )
}
