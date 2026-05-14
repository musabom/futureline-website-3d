'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { strings } from '@/lib/strings';

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/courses', label: strings.nav.courses },
    { href: '/services', label: 'Solutions' },
    { href: '/#divisions', label: 'Divisions' },
    { href: '/ai', label: 'AI' },
  ];

  return (
    <header className="bg-surface/80 backdrop-blur-md border-b border-white/[0.08] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">{strings.brand.name}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-on-surface-variant hover:text-white text-sm font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-4">
                {session.user.role === 'ADMIN' ? (
                  <Link href="/admin" className="text-on-surface-variant hover:text-white text-sm font-medium transition-colors">
                    {strings.nav.admin}
                  </Link>
                ) : session.user.role === 'INSTRUCTOR' ? (
                  <Link href="/instructor" className="text-on-surface-variant hover:text-white text-sm font-medium transition-colors">
                    Dashboard
                  </Link>
                ) : (
                  <Link href="/dashboard" className="text-on-surface-variant hover:text-white text-sm font-medium transition-colors">
                    {strings.nav.dashboard}
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm text-on-surface-variant hover:text-white font-medium transition-colors"
                >
                  {strings.nav.signOut}
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-on-surface-variant hover:text-white text-sm font-medium transition-colors">
                  {strings.nav.signIn}
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 rounded-lg bg-primary-container text-[#003731] text-sm font-semibold hover:bg-primary hover:shadow-lg hover:shadow-teal/20 transition-all duration-300"
                >
                  {strings.nav.getStarted}
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/[0.08] mt-2 pt-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-on-surface-variant hover:text-white text-sm font-medium px-2 py-1 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link
                  href={session.user.role === 'ADMIN' ? '/admin' : session.user.role === 'INSTRUCTOR' ? '/instructor' : '/dashboard'}
                  className="text-on-surface-variant hover:text-white text-sm font-medium px-2 py-1"
                  onClick={() => setMobileOpen(false)}
                >
                  {strings.nav.dashboard}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-left text-on-surface-variant hover:text-white text-sm font-medium px-2 py-1"
                >
                  {strings.nav.signOut}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-on-surface-variant hover:text-white text-sm font-medium px-2 py-1" onClick={() => setMobileOpen(false)}>
                  {strings.nav.signIn}
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-lg bg-primary-container text-[#003731] text-sm font-semibold text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  {strings.nav.getStarted}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
