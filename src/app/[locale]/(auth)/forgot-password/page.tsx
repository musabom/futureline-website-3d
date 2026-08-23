'use client';
import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.status === 429) {
        setError(t('forgot.errorTooManyRequests'));
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError(t('forgot.errorGeneric'));
    } finally {
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
          <h1 className="text-2xl font-black tracking-tight text-navy">{t('forgot.title')}</h1>
          <p className="text-ink-muted text-sm mt-2">
            {submitted
              ? t('forgot.subtitleSent')
              : t('forgot.subtitleDefault')}
          </p>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-hairline bg-canvas-card backdrop-blur-xl p-8">
          {submitted ? (
            <div>
              <div className="bg-teal-500/10 border border-teal-500/20 text-teal-400 px-4 py-3 rounded-lg mb-6 text-sm">
                {t('forgot.successMessage')}
              </div>
              <p className="text-center text-sm text-ink-muted mb-4">
                {t('forgot.spamHint')}
              </p>
              <button
                onClick={() => { setSubmitted(false); setEmail(''); }}
                className="text-teal-400 hover:text-teal-300 font-semibold text-sm block mx-auto transition-colors"
              >
                {t('forgot.tryAnother')}
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
                    {t('forgot.emailLabel')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-canvas-card border border-hairline rounded-lg px-4 py-2.5 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50 transition-colors"
                    placeholder={t('forgot.emailPlaceholder')}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-navy text-sm font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? t('forgot.submitting') : t('forgot.submit')}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-ink-muted mt-6">
            {t('forgot.rememberPassword')}{' '}
            <Link href="/login" className="text-teal-400 hover:text-teal-300 font-semibold">
              {t('forgot.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
