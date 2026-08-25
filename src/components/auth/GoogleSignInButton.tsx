/**
 * GoogleSignInButton — "Continue with Google" for the auth pages.
 *
 * Extracted so /login and the get-started sign-in step behave identically:
 * the button only works once GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are set
 * in the environment, so we ask NextAuth which providers are actually
 * registered and show a friendly message instead of bouncing the visitor to
 * an error page when Google isn't configured.
 *
 * `callbackUrl` must be locale-aware and built by the caller — next-auth's
 * signIn() is not locale-aware, and with localePrefix 'always' every route
 * carries an /en or /ar prefix.
 */
'use client';

import { useEffect, useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09a6.6 6.6 0 0 1-.34-2.09c0-.73.13-1.43.34-2.09V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

export function GoogleSignInButton({ callbackUrl }: { callbackUrl: string }) {
  const t = useTranslations('getStarted');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // null = still checking; true/false = whether Google OAuth is configured.
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    getProviders()
      .then((providers) => {
        if (active) setEnabled(!!providers?.google);
      })
      .catch(() => {
        if (active) setEnabled(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function handleClick() {
    setError('');
    if (enabled === false) {
      setError(t('signin.googleUnavailable'));
      return;
    }
    setLoading(true);
    signIn('google', { callbackUrl });
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-hairline bg-canvas-card px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-teal/50 hover:bg-canvas-alt disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin text-ink-muted" />
        ) : (
          <GoogleIcon />
        )}
        {loading ? t('signin.redirecting') : t('signin.google')}
      </button>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-hairline" />
        <span className="text-xs uppercase tracking-widest text-ink-muted">
          {t('signin.or')}
        </span>
        <span className="h-px flex-1 bg-hairline" />
      </div>
    </div>
  );
}
