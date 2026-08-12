/**
 * WhoWeServe — the four audiences from the company profile, from closed
 * government networks down to a single founder with an idea.
 */
import { Landmark, GraduationCap, Building2, Lightbulb } from 'lucide-react';
import { Stagger } from '@/components/motion/Stagger';
import { TiltCard } from '@/components/motion/TiltCard';

const AUDIENCES = [
  {
    icon: Landmark,
    title: 'Government entities',
    body: 'AI inside closed environments, where data cannot leave the premises. Built under the Safe Build Protocol.',
  },
  {
    icon: GraduationCap,
    title: 'Universities & institutes',
    body: 'Real AI capability in students and academic staff — with programmes you can license and run yourselves.',
  },
  {
    icon: Building2,
    title: 'Private sector',
    body: 'Raising team productivity and automating operations, with agents and applications shaped to how you already work.',
  },
  {
    icon: Lightbulb,
    title: 'Individuals & founders',
    body: 'Anyone with an idea and no development team. We take it to a working product, then teach you to evolve it.',
  },
];

export function WhoWeServe() {
  return (
    <section
      id="who-we-serve"
      aria-labelledby="audiences-heading"
      className="relative bg-canvas-alt py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.3em] text-teal">
            Who we serve
          </p>
          <h2
            id="audiences-heading"
            className="mb-4 font-display text-4xl font-bold tracking-tight text-navy md:text-5xl"
          >
            From closed government networks to a founder with an idea
          </h2>
          <p className="text-lg text-ink-muted">
            AI that fits your constraints — your data, your language, your walls.
          </p>
        </div>

        <Stagger className="grid gap-6 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map(({ icon: Icon, title, body }) => (
            <TiltCard key={title}>
              <article className="relative h-full overflow-hidden rounded-card border border-hairline bg-canvas-card p-6 fl-elev-1 transition-shadow duration-300 hover:shadow-[var(--fl-elev-3)]">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-teal via-mint to-transparent"
                />
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-canvas text-navy">
                  <Icon size={18} strokeWidth={1.8} aria-hidden />
                </div>
                <h3 className="mb-2 font-display text-base font-bold text-navy">{title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{body}</p>
              </article>
            </TiltCard>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
