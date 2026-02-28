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
    <div className="min-h-screen flex items-center justify-center bg-gray-soft px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <img src="/images/logo-light.png" alt="FutureLine" className="h-20 w-auto mx-auto" />
          </Link>
          <h1 className="text-2xl font-bold text-navy">Forgot Password</h1>
          <p className="text-gray-500 mt-1">
            {submitted
              ? 'Check your email for a reset link'
              : 'Enter your email to receive a reset link'}
          </p>
        </div>

        <div className="card p-8">
          {submitted ? (
            <div>
              <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
                If an account exists with that email, we have sent a password reset link. Please check your inbox.
              </div>
              <p className="text-center text-sm text-gray-500 mb-4">
                Didn&apos;t receive the email? Check your spam folder or try again.
              </p>
              <button
                onClick={() => { setSubmitted(false); setEmail(''); }}
                className="text-teal font-semibold text-sm hover:underline block mx-auto"
              >
                Try another email
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Remember your password?{' '}
            <Link href="/login" className="text-teal font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
