/**
 * DetailsAuthForm — /get-started/details (page 3).
 *
 * Stripped down by request to a single field — the pillar-specific question
 * ("Where do you want AI to help first?" etc.) — plus a Submit button. The
 * name / email / company / phone inputs and the sign-in/create-account
 * (login) block were all removed.
 *
 * Consequence, accepted on the record: with no email or name collected,
 * submissions can't carry contact details. The lead pipeline (/api/leads)
 * still requires a name + email, so we send placeholder identity values so
 * the button works and the message + which service still reach /admin/leads
 * — but there is no way to reply to whoever submits. Restore the fields if
 * contactable leads are needed again (see git history for the full form).
 *
 * On success, navigates to the real /get-started/confirm route.
 */
'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Send } from 'lucide-react';
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
  const tp = useTranslations('pillars');
  const router = useRouter();
  const searchParams = useSearchParams();

  const pillarParam = searchParams.get('pillar');
  const pillar = isPillarKey(pillarParam) ? pillarParam : null;

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Readiness copy lives under getStarted.*, the 3 pillars under pillars.*
    const pillarLabel = pillar === 'readiness' ? t('readiness.title') : tp(`${pillar}.title`);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Placeholder identity — the name/email/phone/company fields were
          // removed from this form, but /api/leads still requires a name and
          // a valid email. These make the lead land in /admin/leads (tagged
          // by service via `source`) even though it carries no real contact.
          firstName: 'Anonymous',
          lastName: '(Get Started)',
          email: 'anonymous@futureline.ai',
          tourType: pillarLabel,
          message: message.trim() || `Requested via Get Started — ${pillarLabel}`,
          source: `FL Get Started — ${pillarLabel}`,
        }),
      });
      if (!res.ok) throw new Error('lead submit failed');
      router.push('/get-started/confirm');
    } catch {
      setError(t('form.submitError'));
      setSubmitting(false);
    }
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

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Link
            href={`/get-started?pillar=${pillar}`}
            className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-ink-muted transition-colors hover:text-navy"
            data-cursor="hover"
          >
            <ArrowLeft size={15} className="rtl:rotate-180" />
            {t('back')}
          </Link>
          <button type="submit" disabled={submitting} className="fl-submit" data-cursor="magnetic">
            <Send size={15} />
            {submitting ? t('form.submitting') : t('form.submit')}
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
