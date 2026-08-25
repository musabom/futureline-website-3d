'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';


export default function LoginPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
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
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span
              className="text-2xl font-black tracking-tight"
              style={{
                background: 'linear-gradient(to right, #2dd4bf, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              FutureLine
            </span>
          </Link>
          <h1 className="text-2xl font-black tracking-tight text-navy">{t('login.title')}</h1>
          <p className="text-ink-muted text-sm mt-2">{t('login.subtitle')}</p>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-hairline bg-canvas-card backdrop-blur-xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Google lands on /dashboard, which routes ADMIN → /admin and
              INSTRUCTOR → /instructor, mirroring the credentials flow below.
              signIn() isn't locale-aware, so the prefix is added by hand. */}
          <GoogleSignInButton callbackUrl={`/${locale}/dashboard`} />

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
                {t('login.emailLabel')}
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-canvas-card border border-hairline rounded-lg px-4 py-2.5 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
                {t('login.passwordLabel')}
              </label>
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-canvas-card border border-hairline rounded-lg px-4 py-2.5 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50 transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-navy text-sm font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? t('login.submitting') : t('login.submit')}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link
              href="/forgot-password"
              className="text-sm text-teal-400 hover:text-teal-300 font-semibold transition-colors"
            >
              {t('login.forgotPassword')}
            </Link>
          </div>

          <p className="text-center text-sm text-ink-muted mt-6">
            {t('login.noAccount')}{' '}
            <Link href="/register" className="text-teal-400 hover:text-teal-300 font-semibold">
              {t('login.createOne')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
