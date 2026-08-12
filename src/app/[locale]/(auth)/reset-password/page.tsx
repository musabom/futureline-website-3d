'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-hairline bg-canvas-card backdrop-blur-xl p-8">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
          Invalid reset link. The link may be missing or malformed.
        </div>
        <p className="text-center text-sm text-ink-muted">
          <Link href="/forgot-password" className="text-teal-400 hover:text-teal-300 font-semibold">
            Request a new reset link
          </Link>
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to reset password.');
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-hairline bg-canvas-card backdrop-blur-xl p-8">
        <div className="bg-teal-500/10 border border-teal-500/20 text-teal-400 px-4 py-3 rounded-lg mb-6 text-sm">
          Your password has been reset successfully!
        </div>
        <Link
          href="/login"
          className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-navy text-sm font-bold py-3 rounded-lg hover:opacity-90 transition-opacity block text-center"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-hairline bg-canvas-card backdrop-blur-xl p-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-canvas-card border border-hairline rounded-lg px-4 py-2.5 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50 transition-colors"
            placeholder="At least 6 characters"
            required
            minLength={6}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-canvas-card border border-hairline rounded-lg px-4 py-2.5 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50 transition-colors"
            placeholder="Repeat your password"
            required
            minLength={6}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-navy text-sm font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <p className="text-center text-sm text-ink-muted mt-6">
        <Link href="/login" className="text-teal-400 hover:text-teal-300 font-semibold">
          Back to Sign In
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
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
          <h1 className="text-2xl font-black tracking-tight text-navy">Reset Password</h1>
          <p className="text-ink-muted text-sm mt-2">Enter your new password below</p>
        </div>
        <Suspense
          fallback={
            <div className="w-full max-w-md rounded-2xl border border-hairline bg-canvas-card backdrop-blur-xl p-8 text-center text-ink-muted">
              Loading...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
