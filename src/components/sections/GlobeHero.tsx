/**
 * GlobeHero — the hero section.
 *
 * Server rendered on purpose: the headline, tagline and sub-copy are in the
 * HTML, so they are the LCP element and are visible to crawlers. Only the
 * <Canvas> underneath is client-only.
 *
 * Layers, back to front: aurora glow → WebGL globe → perspective grid floor →
 * floating chips → copy.
 */
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight, MessageSquare, Code2, GraduationCap, Globe } from 'lucide-react';
import GlobeHeroScene from './GlobeHeroCanvasLazy';
import { DecodeText } from '@/components/ui/DecodeText';

const CHIPS = [
  { key: 'consulting', icon: MessageSquare, pos: 'left-[6%] top-[26%]', delay: '0s', arabic: false },
  { key: 'apps', icon: Code2, pos: 'right-[7%] top-[22%]', delay: '1.2s', arabic: false },
  { key: 'training', icon: GraduationCap, pos: 'right-[9%] bottom-[24%]', delay: '0.6s', arabic: false },
  { key: 'bilingual', icon: Globe, pos: 'left-[8%] bottom-[26%]', delay: '1.8s', arabic: true },
] as const;

export async function GlobeHero() {
  const t = await getTranslations('hero');
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-6 py-24"
    >
      {/* Aurora behind the globe */}
      <div
        aria-hidden
        className="fl-aurora pointer-events-none absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full motion-safe:animate-orbit-spin"
      />

      {/* WebGL globe — client only, never mounts under reduced motion */}
      <GlobeHeroScene />

      {/* Perspective grid floor */}
      <div
        aria-hidden
        className="fl-grid-floor pointer-events-none absolute inset-x-[-22%] bottom-0 h-[44%]"
      />

      {/* Floating chips. Hidden below lg — they collide with the copy on
          narrow screens, and they're decorative reinforcement, not content. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        {CHIPS.map(({ icon: Icon, key, pos, delay, arabic }) => (
          <span
            key={key}
            className={`fl-glass-strong absolute ${pos} inline-flex items-center gap-2 rounded-md px-4 py-2.5 font-display text-sm font-semibold text-ink fl-elev-2 motion-safe:animate-chip-bob`}
            style={{ animationDelay: delay }}
          >
            <Icon size={17} strokeWidth={1.8} className="text-teal" />
            {arabic ? (
              <>
                <span dir="rtl" lang="ar" className="font-arabic">
                  عربي
                </span>
                <span>{t('chips.bilingual')}</span>
              </>
            ) : (
              t(`chips.${key}`)
            )}
          </span>
        ))}
      </div>

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
          <span className="fl-text-gradient motion-safe:animate-gradient-flow">FutureLine</span>
        </h1>

        <DecodeText
          text={t('tagline')}
          className="mb-6 font-display text-[clamp(0.9rem,2vw,1.25rem)] font-semibold tracking-[0.4em] text-teal"
        />

        <p className="mb-9 max-w-xl text-lg leading-relaxed text-ink-muted">{t('lede')}</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="#audit"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-pill bg-gradient-to-r from-navy via-teal to-mint px-7 py-3.5 font-display text-base font-semibold text-white shadow-[0_10px_24px_-8px_rgba(24,169,153,0.5)] transition-transform duration-300 hover:-translate-y-0.5"
            data-cursor="magnetic"
          >
            {t('primaryCta')}
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
          <Link
            href="#services"
            className="fl-glass-strong inline-flex items-center justify-center rounded-pill px-7 py-3.5 font-display text-base font-semibold text-ink transition-transform duration-300 hover:-translate-y-0.5 fl-elev-1"
            data-cursor="hover"
          >
            {t('secondaryCta')}
          </Link>
        </div>
      </div>

      {/* Scroll cue */}
      <Link
        href="#services"
        aria-label="Scroll to what we offer"
        className="absolute bottom-6 left-1/2 z-10 flex h-10 w-6 -translate-x-1/2 justify-center rounded-pill border-[1.6px] border-navy/25"
      >
        <span
          aria-hidden
          className="mt-1.5 h-2 w-1 rounded-pill bg-teal motion-safe:animate-cue-drop"
        />
      </Link>
    </section>
  );
}
