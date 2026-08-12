/**
 * DifferentiatorStrip — "What makes us different", straight from the company
 * profile. Deliberately text rather than invented statistics: the profile
 * makes qualitative claims ("we build and we teach", "days, not months") and
 * inventing percentages to fill a metrics row would be fabricating proof.
 */
import { Stagger } from '@/components/motion/Stagger';

const POINTS = [
  {
    title: 'We build and we teach',
    body: 'A working solution, and a team able to carry it forward.',
  },
  {
    title: 'Days, not months',
    body: 'We take an idea to a working prototype fast, then prove the case.',
  },
  {
    title: 'Arabic + English',
    body: 'AI knowledge in the language your team actually thinks in.',
    arabic: 'عربي',
  },
  {
    title: 'Inside your walls',
    body: 'The Safe Build Protocol, for closed premises and sensitive data.',
  },
];

export function DifferentiatorStrip() {
  return (
    <section aria-labelledby="differentiators-heading" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="differentiators-heading"
          className="mb-12 text-center font-display text-sm font-semibold uppercase tracking-[0.3em] text-teal"
        >
          What makes us different
        </h2>

        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map((point) => (
            <div
              key={point.title}
              className="fl-glass fl-elev-1 rounded-card p-6 transition-shadow duration-300 hover:shadow-[var(--fl-elev-2)]"
            >
              <div className="mb-2 font-display text-lg font-bold text-navy">
                {point.arabic ? (
                  <>
                    <span dir="rtl" lang="ar" className="font-arabic">
                      {point.arabic}
                    </span>
                    <span> + English</span>
                  </>
                ) : (
                  point.title
                )}
              </div>
              <p className="text-sm leading-relaxed text-ink-muted">{point.body}</p>
            </div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
