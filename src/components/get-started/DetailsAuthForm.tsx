/**
 * DetailsAuthForm — /get-started/details (page 3).
 *
 * Stripped down by request to a single field — the pillar-specific question
 * ("Where do you want AI to help first?" etc.) — plus a Submit button. The
 * name / email / company / phone inputs were removed.
 *
 * Submit no longer writes a lead here. Instead it stashes the request in
 * sessionStorage and forwards to /get-started/signin, where the visitor
 * identifies themselves (Google or email) — so the request can be tied to
 * a real person and followed up. This also sidesteps the old failure where
 * posting to /api/leads errored when no database was configured.
 */
'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { GetStartedShell } from './GetStartedShell';

// 'readiness' is the AI Readiness Assessment option — not one of the 3
// company pillars, so its copy comes from getStarted.* rather than
// pillars.*. Kept in the same list so it flows through this page and into
// the same lead pipeline as the others.
const PILLAR_KEYS = ['consulting', 'applications', 'training', 'readiness'] as const;
type PillarKey = (typeof PILLAR_KEYS)[number];

function isPillarKey(v: string | null): v is PillarKey {
  return !!v && PILLAR_KEYS.includes(v as PillarKey);
}

function DetailsInner() {
  const t = useTranslations('getStarted');
  const router = useRouter();
  const searchParams = useSearchParams();

  const pillarParam = searchParams.get('pillar');
  const pillar = isPillarKey(pillarParam) ? pillarParam : null;

  const [message, setMessage] = useState('');

  // No valid pillar in the URL — e.g. someone bookmarked/typed this route
  // directly without going through the picker. Send them there instead of
  // rendering a broken form with no pillar-specific copy.
  if (!pillar) {
    return (
      <GetStartedShell step={3}>
        <div className="mx-auto max-w-md text-center">
          <p className="mb-6 text-sm text-ink-muted">{t('form.pickFirst')}</p>
          <Link href="/get-started" className="fl-submit" data-cursor="magnetic">
            {t('form.chooseOption')}
          </Link>
        </div>
      </GetStartedShell>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Carry the request across to the sign-in step so it isn't lost on the
    // hop and can be persisted once the visitor authenticates.
    try {
      sessionStorage.setItem(
        'fl.getStarted.request',
        JSON.stringify({ pillar, message: message.trim() }),
      );
    } catch {
      /* sessionStorage unavailable (e.g. private mode) — proceed anyway */
    }
    router.push(`/get-started/signin?pillar=${pillar}`);
  }

  return (
    <GetStartedShell step={3} pillar={pillar}>
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
        <div>
          <label className="fl-label" htmlFor="gs-message">
            {t(`questions.${pillar}`)} *
          </label>
          <textarea
            id="gs-message"
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="fl-textarea"
            placeholder={t('form.messagePlaceholder')}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <Link
            href={`/get-started?pillar=${pillar}`}
            className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-ink-muted transition-colors hover:text-navy"
            data-cursor="hover"
          >
            <ArrowLeft size={15} className="rtl:rotate-180" />
            {t('back')}
          </Link>
          <button type="submit" className="fl-submit !w-auto px-8" data-cursor="magnetic">
            {t('form.submit')}
            <ArrowRight size={15} className="rtl:rotate-180" />
          </button>
        </div>
      </form>
    </GetStartedShell>
  );
}

export function DetailsAuthForm() {
  return (
    <Suspense fallback={null}>
      <DetailsInner />
    </Suspense>
  );
}
