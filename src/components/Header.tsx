'use client';
import Link from 'next/link';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { strings } from '@/lib/strings';

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/courses', label: strings.nav.courses },
    { href: '/services', label: strings.nav.services },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/logo-icon-light.png" alt={strings.brand.name} className="h-10 w-auto" />
            <span className="text-xl font-bold text-navy">{strings.brand.name}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-navy font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                {session.user.role === 'ADMIN' ? (
                  <Link href="/admin" className="text-gray-600 hover:text-navy font-medium transition-colors">
                    {strings.nav.admin}
                  </Link>
                ) : session.user.role === 'INSTRUCTOR' ? (
                  <Link href="/instructor" className="text-gray-600 hover:text-navy font-medium transition-colors">
                    Dashboard
                  </Link>
                ) : (
                  <Link href="/dashboard" className="text-gray-600 hover:text-navy font-medium transition-colors">
                    {strings.nav.dashboard}
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-gray-500 hover:text-navy font-medium transition-colors"
                >
                  {strings.nav.signOut}
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-navy font-medium transition-colors">
                  {strings.nav.signIn}
                </Link>
                <Link href="/register" className="btn-primary text-sm !px-5 !py-2">
                  {strings.nav.getStarted}
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-2 pt-4">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-navy font-medium px-2 py-1"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {session ? (
                <>
                  {session.user.role === 'ADMIN' ? (
                    <Link href="/admin" className="text-gray-600 hover:text-navy font-medium px-2 py-1" onClick={() => setMobileOpen(false)}>{strings.nav.admin}</Link>
                  ) : session.user.role === 'INSTRUCTOR' ? (
                    <Link href="/instructor" className="text-gray-600 hover:text-navy font-medium px-2 py-1" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  ) : (
                    <Link href="/dashboard" className="text-gray-600 hover:text-navy font-medium px-2 py-1" onClick={() => setMobileOpen(false)}>{strings.nav.dashboard}</Link>
                  )}
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="text-left text-gray-500 hover:text-navy font-medium px-2 py-1">{strings.nav.signOut}</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 hover:text-navy font-medium px-2 py-1" onClick={() => setMobileOpen(false)}>{strings.nav.signIn}</Link>
                  <Link href="/register" className="btn-primary text-sm text-center" onClick={() => setMobileOpen(false)}>{strings.nav.getStarted}</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
