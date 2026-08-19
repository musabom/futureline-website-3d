/**
 * ConfirmPanel — /get-started/confirm (final step).
 *
 * Request-received confirmation. This is where the visitor lands after
 * signing in (Google or email) at /get-started/signin. It tells them their
 * request is in and we'll be in touch, then clears the stashed request from
 * sessionStorage so a later visit doesn't re-show stale state.
 */
'use client';

import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function ConfirmPanel() {
  const t = useTranslations('getStarted');

  // The request was stashed on the details step to survive the sign-in hop.
  // The journey ends here, so clear it — nothing downstream needs it.
  useEffect(() => {
    try {
      sessionStorage.removeItem('fl.getStarted.request');
    } catch {
      /* sessionStorage unavailable — nothing to clean up */
    }
  }, []);

  return (
    <main className="fl-light relative flex min-h-screen flex-col items-center justify-center bg-canvas px-6 py-20 text-ink">
      <div className="w-full max-w-md rounded-card border border-teal/25 bg-teal/[0.06] p-10 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-teal/30 bg-teal/10">
          <CheckCircle size={28} className="text-teal" />
        </div>
        <h1 className="mb-3 font-display text-3xl font-bold tracking-tight text-navy">
          {t('done.title')}
        </h1>
        <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-ink-muted">
          {t('done.body')}
        </p>
        <Link
          href="/"
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-teal transition-colors hover:text-teal-dark"
          data-cursor="hover"
        >
          {t('done.backHome')}
        </Link>
      </div>
    </main>
  );
}
