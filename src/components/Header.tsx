'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/courses', label: 'Courses' },
    { href: '/services', label: 'Services' },
    { href: '/ai', label: 'AI Solutions' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FL</span>
            </div>
            <span className="text-xl font-bold text-navy">FutureLine</span>
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
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin" className="text-gray-600 hover:text-navy font-medium transition-colors">
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" className="text-gray-600 hover:text-navy font-medium transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-500 hover:text-navy font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-navy font-medium transition-colors">
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary text-sm !px-5 !py-2">
                  Get Started
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
                  {session.user.role === 'ADMIN' && (
                    <Link href="/admin" className="text-gray-600 hover:text-navy font-medium px-2 py-1" onClick={() => setMobileOpen(false)}>Admin</Link>
                  )}
                  <Link href="/dashboard" className="text-gray-600 hover:text-navy font-medium px-2 py-1" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <button onClick={() => signOut()} className="text-left text-gray-500 hover:text-navy font-medium px-2 py-1">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 hover:text-navy font-medium px-2 py-1" onClick={() => setMobileOpen(false)}>Sign In</Link>
                  <Link href="/register" className="btn-primary text-sm text-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
