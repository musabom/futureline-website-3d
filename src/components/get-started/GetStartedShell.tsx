/**
 * GetStartedShell — shared header + step indicator for the 3 /get-started
 * routes (picker, details, confirm). Each is a REAL separate page/route
 * (not step state on one page, by explicit request) — this shell exists
 * only to avoid triplicating the eyebrow/heading/lede and progress-dots
 * markup across 3 files; it renders no navigation logic itself.
 *
 * `step` is purely presentational — which of the 3 /get-started pages is
 * currently active. Page 1 of the overall journey is the home page's own
 * hero (untouched, a different route/design entirely) and isn't counted
 * here.
 */
'use client';

import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';

const STEP_LABELS = ['Pick an option', 'Your details', 'Confirm'];

export function GetStartedShell({
  step,
  children,
}: {
  step: 1 | 2 | 3;
  children: React.ReactNode;
}) {
  const t = useTranslations('getStarted');

  return (
    <main className="fl-light relative min-h-screen bg-canvas px-4 py-16 text-ink sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.3em] text-teal">
            {t('eyebrow')}
          </p>
          <h1 className="mb-4 font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
            {t('heading')}
          </h1>
          <p className="text-lg text-ink-muted">{t('lede')}</p>
        </div>

        <ol className="mb-12 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
              <li key={label} className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold transition-colors ${
                      done
                        ? 'bg-teal text-white'
                        : active
                          ? 'border-2 border-teal text-teal'
                          : 'border border-hairline text-ink-muted'
                    }`}
                  >
                    {done ? <Check size={13} /> : n}
                  </span>
                  <span
                    className={`hidden font-display text-sm font-medium sm:inline ${
                      active ? 'text-navy' : 'text-ink-muted'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {n < STEP_LABELS.length && (
                  <span aria-hidden className="h-px w-6 bg-hairline sm:w-10" />
                )}
              </li>
            );
          })}
        </ol>

        {children}
      </div>
    </main>
  );
}
