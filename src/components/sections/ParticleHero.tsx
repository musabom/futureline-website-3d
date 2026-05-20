/**
 * ParticleHero — video-backed cinematic hero with FutureLine brand wordmark.
 *
 * The video is the verbatim Kling asset from the reference repo, but tinted
 * heavily with navy + teal so it reads as FutureLine atmosphere rather than
 * borrowed sci-fi. The wordmark uses the original FutureLine brand
 * treatment — "FutureLine" mixed case, teal→blue gradient text — not the
 * reference's all-caps glitching white wordmark.
 */
'use client';

import Link from 'next/link';

export function ParticleHero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Verbatim video asset, kept as the visual base */}
      <video
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          ;(e.currentTarget as HTMLVideoElement).style.display = 'none';
        }}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Brand color-grade — strong navy base + teal wash so the video reads
          as FutureLine atmosphere, not generic sci-fi */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(15, 30, 61, 0.65), rgba(10, 20, 40, 0.78))',
          mixBlendMode: 'multiply',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 70%, rgba(24, 169, 153, 0.28), transparent 55%),' +
            'radial-gradient(ellipse at 70% 30%, rgba(27, 44, 99, 0.5), transparent 60%)',
          mixBlendMode: 'screen',
        }}
      />
      {/* Center vignette — keeps the wordmark legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 30%, rgba(3, 13, 26, 0.75) 100%)',
        }}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1
          id="hero-heading"
          className="hero-wordmark text-5xl font-black leading-[0.95] tracking-[-0.04em] md:text-[clamp(4rem,12vw,12rem)]"
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #20C5B3 0%, #18A999 35%, #5edac8 55%, #93AEFF 80%, #2A3475 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter:
                'drop-shadow(0 0 24px rgba(24, 169, 153, 0.18)) drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4))',
            }}
          >
            FutureLine
          </span>
        </h1>

        {/* Strapline directly under the wordmark — three pillars of what
            FutureLine does. Each word carries the lab-teal gradient so
            it reads as a brand stamp echoing the wordmark above, with
            glowing teal dot separators and a subtle drop-shadow glow. */}
        <p
          className="hero-eyebrow mt-8 flex items-center justify-center gap-4 font-mono text-base font-bold uppercase tracking-[0.32em] md:mt-10 md:gap-7 md:text-2xl"
          style={{ filter: 'drop-shadow(0 0 18px rgba(24, 169, 153, 0.3))' }}
        >
          {/* Each word steps through the FutureLine wordmark's gradient:
              Design (deep teal) → Deploy (mint) → Evolve (blue). Reads
              as the same color journey as the wordmark above. */}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(135deg, #20C5B3 0%, #18A999 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Design
          </span>
          <span
            aria-hidden
            className="block h-2 w-2 rounded-full bg-lab shadow-[0_0_14px_3px_rgba(24,169,153,0.75)]"
          />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(135deg, #5edac8 0%, #20C5B3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Deploy
          </span>
          <span
            aria-hidden
            className="block h-2 w-2 rounded-full bg-lab shadow-[0_0_14px_3px_rgba(24,169,153,0.75)]"
          />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(135deg, #93AEFF 0%, #5b7bfb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Evolve
          </span>
        </p>

        <p className="hero-sub mt-8 max-w-2xl text-base leading-relaxed text-white/75 md:mt-10 md:text-lg">
          We build the systems your team will actually use.
          <br className="hidden md:inline" />
          Live in weeks. Owned forever. No licence tax.
        </p>
        <div className="hero-cta mt-12 flex items-center gap-2">
          <Link
            href="/audit"
            data-cursor="magnetic"
            data-cursor-strength="22"
            className="rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90"
          >
            Get a free systems audit
          </Link>
          <Link
            href="/services"
            data-cursor="hover"
            className="ml-2 px-3 py-3 text-sm text-white/80 transition-colors hover:text-white"
          >
            See our services →
          </Link>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="hero-scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.3em] text-white/45"
      >
        ↓ scroll
      </div>

      <style jsx>{`
        .hero-eyebrow {
          opacity: 0;
          transform: translateY(8px);
          animation: heroIn 800ms cubic-bezier(0.16, 1, 0.3, 1) 300ms forwards;
        }
        .hero-wordmark {
          opacity: 0;
          transform: scale(0.97);
          animation: heroWordmark 1500ms cubic-bezier(0.16, 1, 0.3, 1) 800ms forwards;
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
            opacity: 1;
            transform: scale(1);
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
  );
}
