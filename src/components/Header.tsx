'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { strings } from '@/lib/strings';

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Transparent over hero, glass + hairline once scrolled past the fold.
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 32));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Nav exposes our 4 services directly + the Academy catalogue. The
  // aggregator "/services" page and the marketing "/ai" page are
  // intentionally not in the top nav — direct routes for what you can
  // actually buy.
  const navLinks = [
    { href: '/services/digitalisation', label: 'Digitalisation' },
    { href: '/services/custom-software', label: 'Custom Software' },
    { href: '/services/automations', label: 'Automations' },
    { href: '/services/consultation', label: 'Consultation' },
    { href: '/courses', label: strings.nav.courses },
  ];

  const headerClass = [
    'sticky top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500',
    scrolled || mobileOpen
      ? 'bg-black/65 backdrop-blur-md border-b border-white/[0.06]'
      : 'bg-transparent border-b border-transparent',
  ].join(' ');

  const linkClass =
    'text-[13px] font-medium text-white/70 transition-colors hover:text-white';

  return (
    <header className={headerClass} aria-label="Primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label="FutureLine home"
            data-cursor="hover"
          >
            <span
              aria-hidden="true"
              className="block h-2 w-2 rounded-full bg-lab shadow-[0_0_12px_2px_rgba(24,169,153,0.55)] transition-shadow group-hover:shadow-[0_0_16px_3px_rgba(24,169,153,0.75)]"
            />
            <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-lg font-black tracking-tight text-transparent">
              {strings.brand.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:gap-7 md:flex" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass}
                data-cursor="hover"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {session ? (
              <>
                {session.user.role === 'ADMIN' ? (
                  <Link href="/admin" className={linkClass} data-cursor="hover">
                    {strings.nav.admin}
                  </Link>
                ) : session.user.role === 'INSTRUCTOR' ? (
                  <Link href="/instructor" className={linkClass} data-cursor="hover">
                    Dashboard
                  </Link>
                ) : (
                  <Link href="/dashboard" className={linkClass} data-cursor="hover">
                    {strings.nav.dashboard}
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className={linkClass}
                  data-cursor="hover"
                >
                  {strings.nav.signOut}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={linkClass} data-cursor="hover">
                  {strings.nav.signIn}
                </Link>
                <Link
                  href="/register"
                  data-cursor="magnetic"
                  data-cursor-strength="18"
                  className="rounded-full bg-white px-4 py-2 text-[13px] font-medium text-black transition-colors hover:bg-white/90"
                >
                  {strings.nav.getStarted}
                </Link>
              </>
            )}
          </div>

          <button
            className="p-2 text-white/80 transition-colors hover:text-white md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="flex flex-col gap-1 border-t border-white/[0.06] py-3 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.04] hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-white/[0.06]" />
            {session ? (
              <>
                <Link
                  href={
                    session.user.role === 'ADMIN'
                      ? '/admin'
                      : session.user.role === 'INSTRUCTOR'
                      ? '/instructor'
                      : '/dashboard'
                  }
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.04] hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {strings.nav.dashboard}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.04] hover:text-white"
                >
                  {strings.nav.signOut}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.04] hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {strings.nav.signIn}
                </Link>
                <Link
                  href="/register"
                  className="mt-1 rounded-full bg-white px-4 py-2.5 text-center text-sm font-medium text-black transition-colors hover:bg-white/90"
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
