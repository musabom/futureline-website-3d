'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

/**
 * Sign in.
 *
 * Uses the shared brand form primitives (.fl-label / .fl-input / .fl-submit)
 * and surface tokens rather than hand-rolled Tailwind, so it reads as part of
 * the light redesign instead of the generic form it used to be.
 */
export default function LoginPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(t('login.errorInvalid'));
      setLoading(false);
    } else {
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      const role = session?.user?.role;
      // Keep the active locale: with localePrefix 'always' a bare '/admin'
      // redirects to the English route and drops an Arabic user's locale.
      if (role === 'ADMIN') {
        window.location.href = `/${locale}/admin`;
      } else if (role === 'INSTRUCTOR') {
        window.location.href = `/${locale}/instructor`;
      } else {
        window.location.href = `/${locale}/dashboard`;
      }
    }
  };

  return (
    <main className="fl-light relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-6 py-16 text-ink">
      {/* Brand ambience: a soft teal bloom top-left and a navy one bottom-right,
          the same treatment the public pages use to keep the canvas from
          reading as flat white. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(24,169,153,0.16) 0%, rgba(24,169,153,0) 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 h-[26rem] w-[26rem] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(27,44,99,0.14) 0%, rgba(27,44,99,0) 70%)',
        }}
      />

      <div className="relative w-full max-w-[420px]">
        {/* Brand lockup above the card — the pattern every large product uses
            on its sign-in screen (logo mark + wordmark, centred, linking home).
            dir="ltr" keeps the Latin wordmark and mark in the correct order on
            the Arabic (RTL) layout. */}
        <Link
          href="/"
          dir="ltr"
          className="mx-auto mb-8 flex items-center justify-center gap-3"
          aria-label="FutureLine home"
          data-cursor="hover"
        >
          <Image
            src="/images/logo-mark.png"
            alt=""
            width={44}
            height={44}
            className="h-11 w-11"
            priority
          />
          <span className="font-display text-3xl font-bold tracking-tight">
            <span className="text-navy">Future</span>
            <span className="text-teal">Line</span>
          </span>
        </Link>

        <div className="rounded-card border border-hairline bg-canvas-card p-8 fl-elev-2">
          <p className="mb-3 text-center font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-teal">
            {t('login.eyebrow')}
          </p>
          <h1 className="text-center font-display text-3xl font-bold tracking-tight text-navy">
            {t('login.title')}
          </h1>
          <p className="mx-auto mt-2 mb-8 max-w-[280px] text-center text-sm leading-relaxed text-ink-muted">
            {t('login.subtitle')}
          </p>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {/* Google lands on /dashboard, which routes ADMIN → /admin and
              INSTRUCTOR → /instructor, mirroring the credentials flow below.
              signIn() isn't locale-aware, so the prefix is added by hand. */}
          <GoogleSignInButton callbackUrl={`/${locale}/dashboard`} />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="fl-label" htmlFor="login-email">
                {t('login.emailLabel')}
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="fl-input"
                required
              />
            </div>
            <div>
              <label className="fl-label" htmlFor="login-password">
                {t('login.passwordLabel')}
              </label>
              <input
                id="login-password"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="fl-input"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="fl-submit" data-cursor="magnetic">
              {loading ? t('login.submitting') : t('login.submit')}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-teal transition-colors hover:text-teal-dark"
            >
              {t('login.forgotPassword')}
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-ink-muted">
          {t('login.noAccount')}{' '}
          <Link
            href="/register"
            className="font-semibold text-teal transition-colors hover:text-teal-dark"
          >
            {t('login.createOne')}
          </Link>
        </p>
      </div>
    </main>
  );
}
