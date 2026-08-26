/**
 * AccountMenu — the signed-in replacement for the "Sign In" link.
 *
 * Signed-out headers show a Sign In link; signed-in headers show who you are
 * and tuck account actions behind an avatar. That is the standard pattern in
 * every comparable product, and it keeps the top bar from growing a new bare
 * text link for every account action.
 *
 * Behaviour: click or Enter/Space opens, Escape closes and returns focus to
 * the trigger, a click anywhere outside closes. Destination is role-aware
 * (admin / instructor / customer) and every link is locale-aware, as is the
 * post-sign-out landing — signOut({ callbackUrl: '/' }) would drop an Arabic
 * visitor onto the English home page.
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LayoutDashboard, LogOut } from 'lucide-react';

type SessionUser = {
  role?: string;
  firstName?: string;
  lastName?: string;
  name?: string | null;
  email?: string | null;
};

/** Initials for the avatar; falls back to the email's first character. */
function initialsOf(user: SessionUser) {
  const first = (user.firstName || '').trim();
  const last = (user.lastName || '').trim();
  if (first || last) return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  const fromName = (user.name || '').trim();
  if (fromName) {
    const parts = fromName.split(/\s+/).filter(Boolean);
    return parts.length > 1
      ? `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return (user.email || '?').charAt(0).toUpperCase();
}

export function AccountMenu({ user, dark }: { user: SessionUser; dark?: boolean }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const home =
    user.role === 'ADMIN' ? '/admin' : user.role === 'INSTRUCTOR' ? '/instructor' : '/dashboard';

  const displayName =
    `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.name || user.email || '';

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={displayName ? `${t('account')} — ${displayName}` : t('account')}
        className={`flex h-9 w-9 items-center justify-center rounded-full border font-display text-xs font-bold transition-colors ${
          dark
            ? 'border-white/25 bg-white/10 text-white hover:bg-white/20'
            : 'border-hairline bg-canvas-alt text-navy hover:border-teal/50'
        }`}
        data-cursor="hover"
      >
        {initialsOf(user)}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-card border border-hairline bg-canvas-card fl-elev-2"
        >
          <div className="border-b border-hairline px-4 py-3">
            <p className="truncate font-display text-sm font-semibold text-navy">{displayName}</p>
            {user.email && (
              <p className="truncate text-xs text-ink-muted" dir="ltr">
                {user.email}
              </p>
            )}
          </div>

          <Link
            href={home}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink transition-colors hover:bg-canvas-alt hover:text-navy"
          >
            <LayoutDashboard size={16} className="text-ink-muted" aria-hidden />
            {t('dashboard')}
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: `/${locale}` });
            }}
            className="flex w-full items-center gap-2.5 border-t border-hairline px-4 py-2.5 text-start text-sm text-ink transition-colors hover:bg-canvas-alt hover:text-navy"
          >
            <LogOut size={16} className="text-ink-muted" aria-hidden />
            {t('signOut')}
          </button>
        </div>
      )}
    </div>
  );
}
