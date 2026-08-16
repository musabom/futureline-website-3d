/**
 * PillarPicker — /get-started (page 2). Pick one of the 3 pillars, shown
 * as a vertical stacked list. Same copy as ThreePillars (pillars.* i18n
 * namespace). On Continue, navigates to the real /get-started/details
 * route (not a step-state change) with the pick carried as ?pillar=.
 */
'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { MessageSquare, Code2, GraduationCap, ArrowRight } from 'lucide-react';
import { GetStartedShell } from './GetStartedShell';

const PILLARS = [
  { key: 'consulting', icon: MessageSquare },
  { key: 'applications', icon: Code2 },
  { key: 'training', icon: GraduationCap },
] as const;

type PillarKey = (typeof PILLARS)[number]['key'];

function isPillarKey(v: string | null): v is PillarKey {
  return !!v && PILLARS.some((p) => p.key === v);
}

function PickerInner() {
  const t = useTranslations('getStarted');
  const tp = useTranslations('pillars');
  // Reuses hero.primaryCta so the readiness-assessment label stays a single
  // source of truth after moving off the hero.
  const th = useTranslations('hero');
  const router = useRouter();
  const searchParams = useSearchParams();

  const [pillar, setPillar] = useState<PillarKey | null>(
    isPillarKey(searchParams.get('pillar')) ? (searchParams.get('pillar') as PillarKey) : null
  );

  function handleContinue() {
    if (!pillar) return;
    router.push(`/get-started/details?pillar=${pillar}`);
  }

  return (
    <GetStartedShell step={2} pillar={pillar ?? undefined}>
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col gap-4">
          {PILLARS.map(({ key, icon: Icon }) => {
            const selected = pillar === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setPillar(key)}
                className={`flex items-start gap-4 rounded-card border p-6 text-start transition-colors ${
                  selected
                    ? 'border-teal bg-teal/[0.06] ring-1 ring-teal'
                    : 'border-hairline bg-canvas-card hover:border-teal/40'
                }`}
                data-cursor="hover"
              >
                <div
                  className={`inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                    selected ? 'bg-teal text-white' : 'bg-teal/10 text-teal'
                  }`}
                >
                  <Icon size={20} strokeWidth={1.8} aria-hidden />
                </div>
                <div>
                  <h3 className="mb-2 font-display text-base font-bold text-navy">
                    {tp(`${key}.title`)}
                  </h3>
                  <ul className="space-y-1.5">
                    {(tp.raw(`${key}.points`) as string[]).slice(0, 2).map((point) => (
                      <li key={point} className="relative ps-4 text-xs leading-relaxed text-ink-muted">
                        <span aria-hidden className="absolute start-0 top-[0.5em] h-1 w-1 rounded-full bg-teal" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!pillar}
            className="fl-submit"
            data-cursor="magnetic"
          >
            {t('continue')}
            <ArrowRight size={15} className="rtl:rotate-180" />
          </button>
        </div>

        {/* AI readiness assessment — moved here from the home page hero by
            request. Points at the standalone /audit route rather than the
            home page's #audit anchor, since that section is on a different
            page from here. Same form, same lead pipeline, unchanged. */}
        <div className="mt-10 border-t border-hairline pt-8 text-center">
          <p className="mb-4 text-sm text-ink-muted">
            Not sure which one you need?
          </p>
          <Link
            href="/audit"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-pill bg-gradient-to-r from-navy via-teal to-mint px-7 py-3.5 font-display text-base font-semibold text-white shadow-[0_10px_24px_-8px_rgba(24,169,153,0.5)] transition-transform duration-300 hover:-translate-y-0.5"
            data-cursor="magnetic"
          >
            {th('primaryCta')}
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </GetStartedShell>
  );
}

export function PillarPicker() {
  return (
    <Suspense fallback={null}>
      <PickerInner />
    </Suspense>
  );
}
