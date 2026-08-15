/**
 * GetStartedWizard — the 3-pillars entry points (Consulting / Building
 * Applications / Training), reorganized into one coherent flow instead of
 * 3 separate CTAs pointing at 2 different destinations (Consulting +
 * Applications both used to go to /#audit, Training went straight to
 * /courses with no shared funnel).
 *
 * Page 1 of the overall journey is the home page's own hero (untouched,
 * lives in GlobeHero.tsx) — this component starts at what's now "page 2":
 *
 * Step 1 ("page 2") — pick one of the three pillars, as a vertical stacked
 *          list. Copy is the same pillars.* i18n namespace as ThreePillars.
 * Step 2 ("page 3") — everything else in one page: the remaining required
 *          details for that pillar, AND a real NextAuth sign-in/sign-up
 *          (not a guest form — the site's other lead forms are guest/no-
 *          account; this flow is deliberately different), submitted
 *          together as a single action.
 *
 * A standalone intro step used to precede the picker (no options, just
 * copy + a Continue button) — removed: the home page's hero now serves
 * that framing role, so landing straight on the picker when arriving from
 * "What we offer" avoids a redundant extra click.
 *
 * "Page 4" (a further page, styled from a reference image) is not built
 * yet — pending that image from the user.
 *
 * Submits to the same POST /api/leads pipeline every other enquiry form on
 * the site uses, tagged with a distinct `source` per pillar so it's
 * distinguishable in /admin/leads — nothing about the backend, /audit,
 * /courses, /login, or /register changes; this is a new, additive front
 * door onto the same lead pipeline and the same auth system.
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

const STEP_LABELS = ['Pick an option', 'Your details'];
const LAST_STEP = STEP_LABELS.length;

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

  const step = Math.min(LAST_STEP, Math.max(1, Number(searchParams.get('step')) || 1));
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

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');

  function goToStep(next: number, nextPillar?: PillarKey) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('step', String(next));
    if (nextPillar) params.set('pillar', nextPillar);
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleOptionsContinue() {
    if (!pillar) return;
    goToStep(2, pillar);
  }

  async function submitLead(email: string) {
    const pillarLabel = pillar ? tp(`${pillar}.title`) : 'General';
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
  }

  // Combined page: details + (if not already signed in) sign-in/sign-up,
  // then submit the lead — one action instead of a separate review step.
  async function handleCombinedSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    setSubmitStatus('submitting');

    let email = session?.user?.email ?? null;

    if (!email) {
      try {
        if (authMode === 'register') {
          if (authForm.password !== authForm.confirmPassword) {
            setAuthError('Passwords do not match');
            setSubmitStatus('idle');
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
            setSubmitStatus('idle');
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
          setSubmitStatus('idle');
          return;
        }
        email = authForm.email;
      } catch {
        setAuthError('Something went wrong. Please try again.');
        setSubmitStatus('idle');
        return;
      }
    }

    try {
      await submitLead(email);
      setSubmitStatus('sent');
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
                {n < LAST_STEP && <span aria-hidden className="h-px w-6 bg-hairline sm:w-10" />}
              </li>
            );
          })}
        </ol>

        {/* ── Step 1 ("page 2") — pick a pillar, vertical list ── */}
        {step === 1 && (
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
                            <span
                              aria-hidden
                              className="absolute start-0 top-[0.5em] h-1 w-1 rounded-full bg-teal"
                            />
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
                onClick={handleOptionsContinue}
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

        {/* ── Step 2 ("page 3") — details + email/login + submit, one page ── */}
        {step === 2 && pillar && submitStatus !== 'sent' && (
          <form onSubmit={handleCombinedSubmit} className="mx-auto max-w-2xl space-y-5">
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
                rows={3}
                required
                value={details.message}
                onChange={(e) => setDetails({ ...details, message: e.target.value })}
                className="fl-textarea"
                placeholder="A few sentences is enough — we'll follow up with the right questions."
              />
            </div>

            {sessionStatus === 'loading' && (
              <p className="text-center text-sm text-ink-muted">Checking your session…</p>
            )}

            {sessionStatus !== 'loading' && session && (
              <p className="rounded-lg border border-teal/25 bg-teal/[0.06] px-4 py-3 text-sm text-ink">
                Signed in as <strong>{session.user?.email}</strong>
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

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                    <div className="sm:col-span-2">
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
                </div>
              </div>
            )}

            {authError && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
                {authError}
              </div>
            )}

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
              <button
                type="submit"
                disabled={submitStatus === 'submitting'}
                className="fl-submit"
                data-cursor="magnetic"
              >
                <Send size={15} />
                {submitStatus === 'submitting'
                  ? 'Submitting…'
                  : session
                    ? 'Confirm & submit'
                    : authMode === 'register'
                      ? 'Create account & submit'
                      : 'Sign in & submit'}
              </button>
            </div>

            {submitStatus === 'error' && (
              <p className="pt-1 text-center text-xs text-red-600">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}

        {step === 2 && submitStatus === 'sent' && (
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
