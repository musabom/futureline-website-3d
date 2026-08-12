import Link from 'next/link';
import { Home, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen fl-dark-surface bg-[#030d1a] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#18a999]/[0.06] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative text-center max-w-md w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18a999]/10 border border-[#18a999]/20 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#18a999]" />
          <span className="text-xs font-bold text-[#18a999] tracking-widest uppercase">FutureLine</span>
        </div>

        <div
          className="text-[120px] font-black leading-none mb-2 select-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0.03))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight mb-3">Page Not Found</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-10">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white text-sm font-bold hover:opacity-90 transition-opacity uppercase tracking-widest"
          >
            <Home size={15} />
            Back to Home
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white text-sm font-bold hover:bg-white/[0.06] transition-colors uppercase tracking-widest"
          >
            <BookOpen size={15} />
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
