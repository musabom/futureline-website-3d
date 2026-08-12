/**
 * ThreePillars — "What we offer", verbatim from the company profile:
 * Consulting, Building Applications, Training & Enablement.
 *
 * This replaces the old four-service taxonomy (Digitalisation / Custom
 * Software / Automations / Consultation) that the live site still shows.
 */
import Link from 'next/link';
import { MessageSquare, Code2, GraduationCap, ArrowRight } from 'lucide-react';
import { Stagger } from '@/components/motion/Stagger';
import { TiltCard } from '@/components/motion/TiltCard';

const PILLARS = [
  {
    icon: MessageSquare,
    title: 'Consulting',
    href: '/services',
    cta: 'Start here',
    points: [
      'AI readiness assessment for the organisation',
      'Highest-return use cases and opportunities',
      'Adoption roadmap with measures of impact',
      'Safe-use policy and data governance',
    ],
  },
  {
    icon: Code2,
    title: 'Building Applications',
    href: '/services',
    cta: 'Build with us',
    points: [
      'Custom applications and systems for organisations',
      'AI agents and automation for repetitive operations',
      'Working MVPs that prove the case before major investment',
      'Fast, lightweight solutions for individuals and founders',
      'The Safe Build Protocol for closed premises and sensitive data',
    ],
  },
  {
    icon: GraduationCap,
    title: 'Training & Enablement',
    href: '/courses',
    cta: 'Get trained',
    points: [
      'Applied AI training for individuals and teams',
      'Vibe Coding: idea to deployed product, no programming background',
      'Safe and responsible AI workshops',
      'Programme licensing and train-the-trainer',
    ],
  },
];

export function ThreePillars() {
  return (
    <section id="services" aria-labelledby="pillars-heading" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.3em] text-teal">
            What we offer
          </p>
          <h2
            id="pillars-heading"
            className="mb-4 font-display text-4xl font-bold tracking-tight text-navy md:text-5xl"
          >
            Three pillars: we advise, we build, we train
          </h2>
          <p className="text-lg text-ink-muted">
            Start where you need us most — or take the full journey, from the first question
            to leading AI yourselves.
          </p>
        </div>

        <Stagger className="grid gap-6 [perspective:1200px] md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, href, cta, points }) => (
            <TiltCard key={title}>
              <article className="flex h-full flex-col rounded-card border border-hairline bg-canvas-card p-7 fl-elev-1 transition-shadow duration-300 hover:shadow-[var(--fl-elev-3)]">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal">
                  <Icon size={24} strokeWidth={1.8} aria-hidden />
                </div>
                <h3 className="mb-4 font-display text-xl font-bold text-navy">{title}</h3>
                <ul className="mb-6 space-y-2.5">
                  {points.map((point) => (
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
                  {cta}
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
