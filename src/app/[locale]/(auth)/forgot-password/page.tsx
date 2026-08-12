'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
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
        setError('Too many requests. Please wait a moment and try again.');
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen fl-dark-surface bg-[#030d1a] flex items-center justify-center px-4">
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
          <h1 className="text-2xl font-black tracking-tight text-white">Forgot Password</h1>
          <p className="text-slate-400 text-sm mt-2">
            {submitted
              ? 'Check your email for a reset link'
              : 'Enter your email to receive a reset link'}
          </p>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-white/[0.07] bg-slate-950/60 backdrop-blur-xl p-8">
          {submitted ? (
            <div>
              <div className="bg-teal-500/10 border border-teal-500/20 text-teal-400 px-4 py-3 rounded-lg mb-6 text-sm">
                If an account exists with that email, we have sent a password reset link. Please check your inbox.
              </div>
              <p className="text-center text-sm text-slate-400 mb-4">
                Didn&apos;t receive the email? Check your spam folder or try again.
              </p>
              <button
                onClick={() => { setSubmitted(false); setEmail(''); }}
                className="text-teal-400 hover:text-teal-300 font-semibold text-sm block mx-auto transition-colors"
              >
                Try another email
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
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white text-sm font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-slate-400 mt-6">
            Remember your password?{' '}
            <Link href="/login" className="text-teal-400 hover:text-teal-300 font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
