/**
 * DetailsAuthForm — /get-started/details (page 3). The remaining required
 * details for the picked pillar, plus a real NextAuth sign-in/sign-up
 * (this flow is deliberately not a guest form like the site's other lead
 * forms), submitted together in one action.
 *
 * On success, navigates to the real /get-started/confirm route.
 */
'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useSession, signIn } from 'next-auth/react';
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
  const { data: session, status: sessionStatus } = useSession();

  const pillarParam = searchParams.get('pillar');
  const pillar = isPillarKey(pillarParam) ? pillarParam : null;

  const [details, setDetails] = useState({
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    message: '',
  });

  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [authForm, setAuthForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [authError, setAuthError] = useState('');
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
    setAuthError('');
    setSubmitting(true);

    let email = session?.user?.email ?? null;

    if (!email) {
      try {
        if (authMode === 'register') {
          if (authForm.password !== authForm.confirmPassword) {
            setAuthError(t('form.passwordMismatch'));
            setSubmitting(false);
            return;
          }
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firstName: details.firstName,
              lastName: details.lastName,
              email: authForm.email,
              password: authForm.password,
              confirmPassword: authForm.confirmPassword,
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            setAuthError(data.error || t('form.registrationFailed'));
            setSubmitting(false);
            return;
          }
        }
        const result = await signIn('credentials', {
          email: authForm.email,
          password: authForm.password,
          redirect: false,
        });
        if (result?.error) {
          setAuthError(
            authMode === 'register'
              ? t('form.createdButSignInFailed')
              : t('form.invalidCredentials')
          );
          setSubmitting(false);
          return;
        }
        email = authForm.email;
      } catch {
        setAuthError(t('form.genericError'));
        setSubmitting(false);
        return;
      }
    }

    // Readiness copy lives under getStarted.*, the 3 pillars under pillars.*
    const pillarLabel = pillar === 'readiness' ? t('readiness.title') : tp(`${pillar}.title`);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: details.firstName || session?.user?.firstName || 'Customer',
          lastName: details.lastName || session?.user?.lastName || '',
          email,
          phone: details.phone,
          company: details.company,
          tourType: pillarLabel,
          message: details.message.trim() || `Requested via Get Started — ${pillarLabel}`,
          source: `FL Get Started — ${pillarLabel}`,
        }),
      });
      if (!res.ok) throw new Error('lead submit failed');
      router.push('/get-started/confirm');
    } catch {
      setAuthError(t('form.submitError'));
      setSubmitting(false);
    }
  }

  return (
    <GetStartedShell step={3} pillar={pillar}>
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="fl-label" htmlFor="gs-firstName">{t('form.firstName')} *</label>
            <input
              id="gs-firstName"
              type="text"
              required
              value={details.firstName}
              onChange={(e) => setDetails({ ...details, firstName: e.target.value })}
              className="fl-input"
              placeholder={t('form.firstNamePlaceholder')}
            />
          </div>
          <div>
            <label className="fl-label" htmlFor="gs-lastName">{t('form.lastName')} *</label>
            <input
              id="gs-lastName"
              type="text"
              required
              value={details.lastName}
              onChange={(e) => setDetails({ ...details, lastName: e.target.value })}
              className="fl-input"
              placeholder={t('form.lastNamePlaceholder')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="fl-label" htmlFor="gs-company">
              {t('form.company')} <span className="text-ink-muted/70">{t('form.optional')}</span>
            </label>
            <input
              id="gs-company"
              type="text"
              value={details.company}
              onChange={(e) => setDetails({ ...details, company: e.target.value })}
              className="fl-input"
              placeholder={t('form.companyPlaceholder')}
            />
          </div>
          <div>
            <label className="fl-label" htmlFor="gs-phone">
              {t('form.phone')} <span className="text-ink-muted/70">{t('form.optional')}</span>
            </label>
            <input
              id="gs-phone"
              type="tel"
              value={details.phone}
              onChange={(e) => setDetails({ ...details, phone: e.target.value })}
              className="fl-input"
              placeholder="+968 9765 3461"
            />
          </div>
        </div>

        <div>
          <label className="fl-label" htmlFor="gs-message">
            {t(`questions.${pillar}`)} *
          </label>
          <textarea
            id="gs-message"
            rows={3}
            required
            value={details.message}
            onChange={(e) => setDetails({ ...details, message: e.target.value })}
            className="fl-textarea"
            placeholder={t('form.messagePlaceholder')}
          />
        </div>

        {sessionStatus === 'loading' && (
          <p className="text-center text-sm text-ink-muted">{t('form.checkingSession')}</p>
        )}

        {sessionStatus !== 'loading' && session && (
          <p className="rounded-lg border border-teal/25 bg-teal/[0.06] px-4 py-3 text-sm text-ink">
            {t('form.signedInAs')} <strong>{session.user?.email}</strong>
          </p>
        )}

        {sessionStatus !== 'loading' && !session && (
          <div className="border-t border-hairline pt-5">
            <div className="mb-5 flex justify-center gap-6">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`font-display text-sm font-semibold transition-colors ${
                  authMode === 'signin' ? 'text-teal' : 'text-ink-muted hover:text-navy'
                }`}
              >
                {t('form.signIn')}
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`font-display text-sm font-semibold transition-colors ${
                  authMode === 'register' ? 'text-teal' : 'text-ink-muted hover:text-navy'
                }`}
              >
                {t('form.createAccount')}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="fl-label" htmlFor="gs-auth-email">{t('form.email')} *</label>
                <input
                  id="gs-auth-email"
                  type="email"
                  required
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="fl-input"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="fl-label" htmlFor="gs-auth-password">{t('form.password')} *</label>
                <input
                  id="gs-auth-password"
                  type="password"
                  required
                  minLength={6}
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="fl-input"
                />
              </div>
              {authMode === 'register' && (
                <div className="sm:col-span-2">
                  <label className="fl-label" htmlFor="gs-auth-confirm">{t('form.confirmPassword')} *</label>
                  <input
                    id="gs-auth-confirm"
                    type="password"
                    required
                    minLength={6}
                    value={authForm.confirmPassword}
                    onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                    className="fl-input"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {authError && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
            {authError}
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
            {submitting
              ? t('form.submitting')
              : session
                ? t('form.confirmSubmit')
                : authMode === 'register'
                  ? t('form.createAndSubmit')
                  : t('form.signInAndSubmit')}
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
