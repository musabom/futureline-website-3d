'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen fl-dark-surface bg-[#030d1a] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-red-600/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#18a999]/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative text-center max-w-md w-full">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="text-red-400" size={28} />
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight mb-3">Something went wrong</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-10">
          We encountered an unexpected error. Please try again or return to the home page.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white text-sm font-bold hover:opacity-90 transition-opacity uppercase tracking-widest"
          >
            <RotateCcw size={15} />
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white text-sm font-bold hover:bg-white/[0.06] transition-colors uppercase tracking-widest"
          >
            <Home size={15} />
            Go Home
          </a>
        </div>

        {error.digest && (
          <p className="mt-8 text-[10px] text-slate-700 font-mono">Error ID: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
