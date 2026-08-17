/**
 * ConfirmPanel — /get-started/confirm (page 4).
 *
 * PLACEHOLDER — the real design for this page is meant to come from a
 * reference image the user is sending; it hasn't arrived yet. This is a
 * plain, working confirmation screen (same copy the flow already used
 * post-submit) so the route exists and the full journey is navigable and
 * testable in the meantime. Replace the content below once the image
 * reference lands — the route itself shouldn't need to change.
 */
'use client';

import { CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { GetStartedShell } from './GetStartedShell';

export function ConfirmPanel() {
  const t = useTranslations('getStarted');

  return (
    <GetStartedShell step={4}>
      <div className="mx-auto max-w-md rounded-card border border-teal/25 bg-teal/[0.06] p-10 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-teal/30 bg-teal/10">
          <CheckCircle size={24} className="text-teal" />
        </div>
        <h2 className="mb-2 font-display text-2xl font-semibold tracking-[-0.01em] text-ink">
          {t('done.title')}
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-ink-muted">{t('done.body')}</p>
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-teal transition-colors hover:text-teal-dark"
          data-cursor="hover"
        >
          {t('done.backHome')}
        </Link>
      </div>
    </GetStartedShell>
  );
}
