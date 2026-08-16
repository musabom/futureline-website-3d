/**
 * Header — light glass navigation for the redesigned public site.
 *
 * Nav now follows the company profile's three pillars rather than the old
 * four-service taxonomy. Same-page anchors are routed through scrollToHash so
 * they drive Lenis instead of fighting it, and they are written absolute
 * ("/#services") so they still work from /courses or /login.
 *
 * Links use the locale-aware Link from @/i18n/routing: with localePrefix
 * 'as-needed' a plain next/link would drop an Arabic visitor back into
 * English on every navigation.
 */
'use client';

import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { scrollToHash } from '@/lib/scroll';

export default function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations('nav');

  // Transparent over the hero, glass + hairline once past the fold.
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

  // Anchors point at home-page sections; absolute so they work from any route.
  // '/get-started' and '/faq' are real routes (no anchor field), not
  // same-page anchors — the 3 options and the FAQ live off the home page.
  //
  // No "Vision" entry: removed by request. The vision now surfaces as a
  // labelled cluster in the story scene rather than as its own nav
  // destination. The nav.vision i18n key is left in messages/en.json,
  // unused, in case it comes back.
  const navLinks = [
    { href: '/get-started', label: t('whatWeOffer') },
    { href: '/#who-we-serve', label: t('whoWeServe'), anchor: '#who-we-serve' },
    { href: '/courses', label: t('courses') },
    { href: '/faq', label: t('faq') },
  ];

  const headerClass = [
    'sticky top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500',
    scrolled || mobileOpen
      ? 'fl-glass-strong border-b border-hairline'
      : 'bg-transparent border-b border-transparent',
  ].join(' ');

  const linkClass =
    'font-display text-[13px] font-medium text-ink-muted transition-colors hover:text-navy';

  /** Same-page anchors: drive Lenis rather than letting the browser jump. */
  const onAnchorClick = (e: React.MouseEvent, anchor?: string) => {
    if (!anchor) return;
    if (window.location.pathname.replace(/^\/(en|ar)(?=\/|$)/, '') !== '') return;
    e.preventDefault();
    setMobileOpen(false);
    scrollToHash(anchor);
  };

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
            <Image
              src="/images/logo-mark.png"
              alt=""
              width={30}
              height={30}
              className="h-[30px] w-[30px] drop-shadow-[0_4px_8px_rgba(24,169,153,0.35)]"
              priority
            />
            <span className="font-display text-lg font-bold tracking-tight text-navy">
              FutureLine
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex lg:gap-7" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass}
                onClick={(e) => onAnchorClick(e, link.anchor)}
                data-cursor="hover"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
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
                  className={linkClass}
                  data-cursor="hover"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className={linkClass}
                  data-cursor="hover"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={linkClass} data-cursor="hover">
                  {t('signIn')}
                </Link>
                <Link
                  href="/#audit"
                  onClick={(e) => onAnchorClick(e, '#audit')}
                  data-cursor="magnetic"
                  data-cursor-strength="18"
                  className="rounded-pill bg-gradient-to-r from-navy via-teal to-mint px-4 py-2 font-display text-[13px] font-semibold text-white transition-opacity hover:opacity-95"
                >
                  {t('readinessAssessment')}
                </Link>
              </>
            )}
          </div>

          <button
            className="p-2 text-ink-muted transition-colors hover:text-navy md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="flex flex-col gap-1 border-t border-hairline py-3 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2.5 font-display text-sm font-medium text-ink-muted transition-colors hover:bg-canvas-alt hover:text-navy"
                onClick={(e) => {
                  onAnchorClick(e, link.anchor);
                  setMobileOpen(false);
                }}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-hairline" />
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
                  className="rounded-md px-3 py-2.5 font-display text-sm font-medium text-ink-muted transition-colors hover:bg-canvas-alt hover:text-navy"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="rounded-md px-3 py-2.5 text-start font-display text-sm font-medium text-ink-muted transition-colors hover:bg-canvas-alt hover:text-navy"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-3 py-2.5 font-display text-sm font-medium text-ink-muted transition-colors hover:bg-canvas-alt hover:text-navy"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('signIn')}
                </Link>
                <Link
                  href="/#audit"
                  className="mt-1 rounded-pill bg-gradient-to-r from-navy via-teal to-mint px-4 py-2.5 text-center font-display text-sm font-semibold text-white"
                  onClick={(e) => {
                    onAnchorClick(e, '#audit');
                    setMobileOpen(false);
                  }}
                >
                  {t('readinessAssessment')}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
