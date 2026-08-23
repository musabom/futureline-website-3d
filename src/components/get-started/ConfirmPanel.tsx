/**
 * ConfirmPanel — /get-started/confirm (final step).
 *
 * Request-received confirmation. This is where the visitor lands after
 * signing in (Google or email) at /get-started/signin. The request they typed
 * on the details step was stashed in sessionStorage to survive the sign-in
 * hop; here — now that we have an authenticated identity — we finally persist
 * it as a lead (POST /api/leads) and then clear the stash.
 *
 * Previously this component only *deleted* the stashed request, so every
 * get-started submission was silently lost. Now it saves it.
 */
'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function ConfirmPanel() {
  const t = useTranslations('getStarted');
  const { data: session, status } = useSession();
  const submitted = useRef(false);

  useEffect(() => {
    // Wait until we actually have an authenticated identity to attach the lead
    // to. Guard against double-submit (effect re-runs, StrictMode).
    if (status === 'loading' || submitted.current) return;
    submitted.current = true;

    let request: { pillar?: string; message?: string } | null = null;
    try {
      const raw = sessionStorage.getItem('fl.getStarted.request');
      if (raw) request = JSON.parse(raw);
    } catch {
      /* sessionStorage unavailable */
    }

    const clear = () => {
      try {
        sessionStorage.removeItem('fl.getStarted.request');
      } catch {
        /* ignore */
      }
    };

    const user = session?.user as
      | { firstName?: string; lastName?: string; name?: string; email?: string }
      | undefined;

    // Only persist when we have both a stashed request and an authenticated
    // user with an email (the lead needs a real contact).
    if (status === 'authenticated' && user?.email && request) {
      const nameParts = (user.name ?? '').trim().split(/\s+/).filter(Boolean);
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: user.firstName || nameParts[0] || 'Customer',
          lastName: user.lastName || nameParts.slice(1).join(' ') || '—',
          email: user.email,
          message: request.message?.trim() || 'Get Started request',
          tourType: request.pillar || 'General Enquiry',
          source: 'Get Started',
        }),
      })
        .catch(() => {
          /* best-effort; the confirmation still shows */
        })
        .finally(clear);
    } else {
      clear();
    }
  }, [status, session]);

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
