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
      <div className="card p-8">
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
          Invalid reset link. The link may be missing or malformed.
        </div>
        <p className="text-center text-sm text-gray-500">
          <Link href="/forgot-password" className="text-teal font-semibold hover:underline">
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
      <div className="card p-8">
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
          Your password has been reset successfully!
        </div>
        <Link href="/login" className="btn-primary w-full block text-center">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="card p-8">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="At least 6 characters"
            required
            minLength={6}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            placeholder="Repeat your password"
            required
            minLength={6}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        <Link href="/login" className="text-teal font-semibold hover:underline">
          Back to Sign In
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-soft px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <img src="/images/logo-light.png" alt="FutureLine" className="h-20 w-auto mx-auto" />
          </Link>
          <h1 className="text-2xl font-bold text-navy">Reset Password</h1>
          <p className="text-gray-500 mt-1">Enter your new password below</p>
        </div>
        <Suspense fallback={<div className="card p-8 text-center text-gray-400">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
