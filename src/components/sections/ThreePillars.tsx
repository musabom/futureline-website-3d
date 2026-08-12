/**
 * ThreePillars — "What we offer", verbatim from the company profile:
 * Consulting, Building Applications, Training & Enablement.
 *
 * This replaces the old four-service taxonomy (Digitalisation / Custom
 * Software / Automations / Consultation) that the live site still shows.
 */
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { MessageSquare, Code2, GraduationCap, ArrowRight } from 'lucide-react';
import { Stagger } from '@/components/motion/Stagger';
import { TiltCard } from '@/components/motion/TiltCard';

const PILLARS = [
  { key: 'consulting', icon: MessageSquare, href: '/#audit' },
  { key: 'applications', icon: Code2, href: '/#audit' },
  { key: 'training', icon: GraduationCap, href: '/courses' },
] as const;

export async function ThreePillars() {
  const t = await getTranslations('pillars');
  return (
    <section id="services" aria-labelledby="pillars-heading" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.3em] text-teal">
            {t('eyebrow')}
          </p>
          <h2
            id="pillars-heading"
            className="mb-4 font-display text-4xl font-bold tracking-tight text-navy md:text-5xl"
          >
            {t('heading')}
          </h2>
          <p className="text-lg text-ink-muted">{t('lede')}</p>
        </div>

        <Stagger className="grid gap-6 [perspective:1200px] md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, key, href }) => (
            <TiltCard key={key}>
              <article className="flex h-full flex-col rounded-card border border-hairline bg-canvas-card p-7 fl-elev-1 transition-shadow duration-300 hover:shadow-[var(--fl-elev-3)]">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal">
                  <Icon size={24} strokeWidth={1.8} aria-hidden />
                </div>
                <h3 className="mb-4 font-display text-xl font-bold text-navy">{t(`${key}.title`)}</h3>
                <ul className="mb-6 space-y-2.5">
                  {t.raw(`${key}.points`).map((point: string) => (
                    <li key={point} className="relative ps-5 text-sm leading-relaxed text-ink-muted">
                      <span
                        aria-hidden
                        className="absolute start-0 top-[0.55em] h-1.5 w-1.5 rounded-full bg-gradient-to-br from-teal to-mint"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={href}
                  className="group mt-auto inline-flex items-center gap-1.5 font-display text-sm font-semibold text-teal transition-colors hover:text-teal-dark"
                  data-cursor="hover"
                >
                  {t(`${key}.cta`)}
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180"
                    aria-hidden
                  />
                </Link>
              </article>
            </TiltCard>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
