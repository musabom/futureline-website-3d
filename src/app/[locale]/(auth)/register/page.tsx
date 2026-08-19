'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError(t('register.errorMismatch'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t('register.errorFailed'));
        setLoading(false);
        return;
      }

      await signIn('credentials', { email, password, redirect: false });
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError(t('register.errorGeneric'));
      setLoading(false);
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
          <h1 className="text-2xl font-black tracking-tight text-navy">{t('register.title')}</h1>
          <p className="text-ink-muted text-sm mt-2">{t('register.subtitle')}</p>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-hairline bg-canvas-card backdrop-blur-xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
                  {t('register.firstNameLabel')}
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-canvas-card border border-hairline rounded-lg px-4 py-2.5 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
                  {t('register.lastNameLabel')}
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-canvas-card border border-hairline rounded-lg px-4 py-2.5 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50 transition-colors"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
                {t('register.emailLabel')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-canvas-card border border-hairline rounded-lg px-4 py-2.5 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
                {t('register.passwordLabel')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-canvas-card border border-hairline rounded-lg px-4 py-2.5 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50 transition-colors"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
                {t('register.confirmPasswordLabel')}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-canvas-card border border-hairline rounded-lg px-4 py-2.5 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50 transition-colors"
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-navy text-sm font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? t('register.submitting') : t('register.submit')}
            </button>
          </form>

          <p className="text-center text-sm text-ink-muted mt-6">
            {t('register.haveAccount')}{' '}
            <Link href="/login" className="text-teal-400 hover:text-teal-300 font-semibold">
              {t('register.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
