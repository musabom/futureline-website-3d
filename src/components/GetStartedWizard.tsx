/**
 * GetStartedWizard — the 3-pillars entry points (Consulting / Building
 * Applications / Training), reorganized into one coherent 3-step flow
 * instead of 3 separate CTAs pointing at 2 different destinations
 * (Consulting + Applications both used to go to /#audit, Training went
 * straight to /courses with no shared funnel).
 *
 * Step 1 — pick one of the three pillars (same copy as ThreePillars,
 *          read from the shared `pillars.*` i18n namespace).
 * Step 2 — the remaining required details for that pillar.
 * Step 3 — a real NextAuth sign-in/sign-up (not a guest form — the
 *          site's other lead forms are guest/no-account; this flow is
 *          deliberately different), then a review + final submit.
 *
 * Submits to the same POST /api/leads pipeline every other enquiry form
 * on the site uses, tagged with a distinct `source` per pillar so it's
 * distinguishable in /admin/leads — nothing about the backend, /audit,
 * /courses, /login, or /register changes; this is a new, additive
 * front door onto the same lead pipeline and the same auth system.
 */
'use client';

import { Suspense, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import {
  MessageSquare,
  Code2,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Send,
  Check,
} from 'lucide-react';

const PILLARS = [
  { key: 'consulting', icon: MessageSquare },
  { key: 'applications', icon: Code2 },
  { key: 'training', icon: GraduationCap },
] as const;

type PillarKey = (typeof PILLARS)[number]['key'];

const STEP_LABELS = ['Pick an option', 'Your details', 'Confirm'];

function isPillarKey(v: string | null): v is PillarKey {
  return !!v && PILLARS.some((p) => p.key === v);
}

function WizardInner() {
  const t = useTranslations('getStarted');
  const tp = useTranslations('pillars');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status: sessionStatus } = useSession();

  const step = Math.min(3, Math.max(1, Number(searchParams.get('step')) || 1));
  const [pillar, setPillar] = useState<PillarKey | null>(
    isPillarKey(searchParams.get('pillar')) ? (searchParams.get('pillar') as PillarKey) : null
  );

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
  const [authLoading, setAuthLoading] = useState(false);

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  function goToStep(next: number, nextPillar?: PillarKey) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('step', String(next));
    if (nextPillar) params.set('pillar', nextPillar);
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleStep1Continue() {
    if (!pillar) return;
    goToStep(2, pillar);
  }

  function handleStep2Submit(e: React.FormEvent) {
    e.preventDefault();
    goToStep(3, pillar ?? undefined);
  }

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (authMode === 'register') {
        if (authForm.password !== authForm.confirmPassword) {
          setAuthError('Passwords do not match');
          setAuthLoading(false);
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
          setAuthError(data.error || 'Registration failed');
          setAuthLoading(false);
          return;
        }
      }
      const result = await signIn('credentials', {
        email: authForm.email,
        password: authForm.password,
        redirect: false,
      });
      if (result?.error) {
        setAuthError(authMode === 'register' ? 'Account created, but sign-in failed — try signing in below.' : 'Invalid email or password');
      }
    } catch {
      setAuthError('Something went wrong. Please try again.');
    }
    setAuthLoading(false);
  }

  async function handleFinalSubmit() {
    if (!session?.user?.email) return;
    setSubmitStatus('sending');
    const pillarLabel = pillar ? tp(`${pillar}.title`) : 'General';
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: details.firstName || session.user.firstName || 'Customer',
          lastName: details.lastName || session.user.lastName || '',
          email: session.user.email,
          phone: details.phone,
          company: details.company,
          tourType: pillarLabel,
          message: details.message.trim() || `Requested via Get Started — ${pillarLabel}`,
          source: `FL Get Started — ${pillarLabel}`,
        }),
      });
      setSubmitStatus(res.ok ? 'sent' : 'error');
    } catch {
      setSubmitStatus('error');
    }
  }

  return (
    <main className="fl-light relative min-h-screen bg-canvas px-4 py-16 text-ink sm:px-6 md:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Shell header — bilingual, matches ThreePillars' own eyebrow/heading pattern. */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.3em] text-teal">
            {t('eyebrow')}
          </p>
          <h1 className="mb-4 font-display text-4xl font-bold tracking-tight text-navy md:text-5xl">
            {t('heading')}
          </h1>
          <p className="text-lg text-ink-muted">{t('lede')}</p>
        </div>

        {/* Step indicator */}
        <ol className="mb-12 flex items-center justify-center gap-2 sm:gap-4">
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
                {n < 3 && <span aria-hidden className="h-px w-6 bg-hairline sm:w-10" />}
              </li>
            );
          })}
        </ol>

        {/* ── Step 1 — pick a pillar ── */}
        {step === 1 && (
          <div>
            <div className="grid gap-5 sm:grid-cols-3">
              {PILLARS.map(({ key, icon: Icon }) => {
                const selected = pillar === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPillar(key)}
                    className={`flex h-full flex-col rounded-card border p-6 text-start transition-colors ${
                      selected
                        ? 'border-teal bg-teal/[0.06] ring-1 ring-teal'
                        : 'border-hairline bg-canvas-card hover:border-teal/40'
                    }`}
                    data-cursor="hover"
                  >
                    <div
                      className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                        selected ? 'bg-teal text-white' : 'bg-teal/10 text-teal'
                      }`}
                    >
                      <Icon size={20} strokeWidth={1.8} aria-hidden />
                    </div>
                    <h3 className="mb-2 font-display text-base font-bold text-navy">
                      {tp(`${key}.title`)}
                    </h3>
                    <ul className="space-y-1.5">
                      {(tp.raw(`${key}.points`) as string[]).slice(0, 2).map((point) => (
                        <li key={point} className="relative ps-4 text-xs leading-relaxed text-ink-muted">
                          <span
                            aria-hidden
                            className="absolute start-0 top-[0.5em] h-1 w-1 rounded-full bg-teal"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleStep1Continue}
                disabled={!pillar}
                className="fl-submit"
                data-cursor="magnetic"
              >
                {t('continue')}
                <ArrowRight size={15} className="rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2 — remaining required details ── */}
        {step === 2 && pillar && (
          <form onSubmit={handleStep2Submit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="fl-label" htmlFor="gs-firstName">First name *</label>
                <input
                  id="gs-firstName"
                  type="text"
                  required
                  value={details.firstName}
                  onChange={(e) => setDetails({ ...details, firstName: e.target.value })}
                  className="fl-input"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="fl-label" htmlFor="gs-lastName">Last name *</label>
                <input
                  id="gs-lastName"
                  type="text"
                  required
                  value={details.lastName}
                  onChange={(e) => setDetails({ ...details, lastName: e.target.value })}
                  className="fl-input"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="fl-label" htmlFor="gs-company">
                  Company <span className="text-ink-muted/70">(optional)</span>
                </label>
                <input
                  id="gs-company"
                  type="text"
                  value={details.company}
                  onChange={(e) => setDetails({ ...details, company: e.target.value })}
                  className="fl-input"
                  placeholder="Acme Co."
                />
              </div>
              <div>
                <label className="fl-label" htmlFor="gs-phone">
                  Phone <span className="text-ink-muted/70">(optional)</span>
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
                {pillar === 'consulting' && 'What would you like assessed? *'}
                {pillar === 'applications' && 'What are you trying to build? *'}
                {pillar === 'training' && 'Who needs training, and on what? *'}
              </label>
              <textarea
                id="gs-message"
                rows={4}
                required
                value={details.message}
                onChange={(e) => setDetails({ ...details, message: e.target.value })}
                className="fl-textarea"
                placeholder="A few sentences is enough — we'll follow up with the right questions."
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => goToStep(1, pillar)}
                className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-ink-muted transition-colors hover:text-navy"
                data-cursor="hover"
              >
                <ArrowLeft size={15} className="rtl:rotate-180" />
                {t('back')}
              </button>
              <button type="submit" className="fl-submit" data-cursor="magnetic">
                {t('continue')}
                <ArrowRight size={15} className="rtl:rotate-180" />
              </button>
            </div>
          </form>
        )}

        {/* ── Step 3 — sign in / sign up, then confirm ── */}
        {step === 3 && pillar && (
          <div>
            {sessionStatus === 'loading' && (
              <p className="text-center text-sm text-ink-muted">Checking your session…</p>
            )}

            {sessionStatus !== 'loading' && !session && (
              <div className="mx-auto max-w-md rounded-card border border-hairline bg-canvas-card p-8">
                <div className="mb-6 flex justify-center gap-6 border-b border-hairline pb-4">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className={`font-display text-sm font-semibold transition-colors ${
                      authMode === 'signin' ? 'text-teal' : 'text-ink-muted hover:text-navy'
                    }`}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className={`font-display text-sm font-semibold transition-colors ${
                      authMode === 'register' ? 'text-teal' : 'text-ink-muted hover:text-navy'
                    }`}
                  >
                    Create account
                  </button>
                </div>

                {authError && (
                  <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div>
                    <label className="fl-label" htmlFor="gs-auth-email">Email *</label>
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
                    <label className="fl-label" htmlFor="gs-auth-password">Password *</label>
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
                    <div>
                      <label className="fl-label" htmlFor="gs-auth-confirm">Confirm password *</label>
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
                  <button type="submit" disabled={authLoading} className="fl-submit w-full justify-center">
                    {authLoading
                      ? authMode === 'register' ? 'Creating account…' : 'Signing in…'
                      : authMode === 'register' ? 'Create account & continue' : 'Sign in & continue'}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => goToStep(2, pillar)}
                  className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-ink-muted transition-colors hover:text-navy"
                  data-cursor="hover"
                >
                  <ArrowLeft size={15} className="rtl:rotate-180" />
                  {t('back')}
                </button>
              </div>
            )}

            {sessionStatus !== 'loading' && session && submitStatus !== 'sent' && (
              <div className="mx-auto max-w-md">
                <div className="mb-6 rounded-card border border-hairline bg-canvas-card p-6">
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-teal">
                    Review
                  </p>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-muted">Option</dt>
                      <dd className="text-end font-medium text-navy">{tp(`${pillar}.title`)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-muted">Name</dt>
                      <dd className="text-end font-medium text-navy">
                        {details.firstName} {details.lastName}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-muted">Signed in as</dt>
                      <dd className="text-end font-medium text-navy">{session.user?.email}</dd>
                    </div>
                  </dl>
                </div>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={submitStatus === 'sending'}
                  className="fl-submit w-full justify-center"
                  data-cursor="magnetic"
                >
                  <Send size={15} />
                  {submitStatus === 'sending' ? 'Submitting…' : 'Confirm & submit'}
                </button>

                {submitStatus === 'error' && (
                  <p className="pt-3 text-center text-xs text-red-600">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => goToStep(2, pillar)}
                  className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-semibold text-ink-muted transition-colors hover:text-navy"
                  data-cursor="hover"
                >
                  <ArrowLeft size={15} className="rtl:rotate-180" />
                  {t('back')}
                </button>
              </div>
            )}

            {submitStatus === 'sent' && (
              <div className="mx-auto max-w-md rounded-card border border-teal/25 bg-teal/[0.06] p-10 text-center">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-teal/30 bg-teal/10">
                  <CheckCircle size={24} className="text-teal" />
                </div>
                <h3 className="mb-2 font-display text-2xl font-semibold tracking-[-0.01em] text-ink">
                  Request received.
                </h3>
                <p className="mb-8 text-sm leading-relaxed text-ink-muted">
                  We&apos;ll review your details and be in touch within one business day.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function GetStartedWizard() {
  return (
    <Suspense fallback={null}>
      <WizardInner />
    </Suspense>
  );
}
