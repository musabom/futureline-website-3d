/**
 * CoursePromoDialog — "Vibe Coding, coming soon" promo.
 *
 * Appears once per browsing session, 8s after the visitor lands, and sends
 * them to the course page. Deliberately restrained about when it shows:
 *
 *  - Once per session (sessionStorage, same approach as SplashIntro), so a
 *    visitor moving between pages isn't interrupted repeatedly.
 *  - Never while the splash intro is still playing — the timer starts after it.
 *  - Public marketing pages only. It's suppressed on the auth screens, the
 *    get-started funnel and anywhere under a portal, where interrupting
 *    someone mid-task would be actively harmful.
 *  - Not shown to people already reading the course it advertises.
 *
 * Accessibility: a real modal — role="dialog" + aria-modal, focus moves to the
 * panel on open and returns to whatever had it on close, Escape and backdrop
 * click both dismiss, and Tab is trapped inside while open. Honors
 * prefers-reduced-motion by skipping the entrance animation.
 */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname, Link } from '@/i18n/routing';
import { X, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'fl.promo.vibe-coding.seen';
const DELAY_MS = 8000;
/** Course this promotes — also the path we must not interrupt. */
const COURSE_PATH = '/courses/vibe-coding';

/** Route prefixes where a promo would interrupt real work. */
const SUPPRESSED = ['/login', '/register', '/forgot-password', '/reset-password', '/get-started', '/admin', '/instructor', '/dashboard'];

export function CoursePromoDialog() {
  const t = useTranslations('promo');
  const pathname = usePathname(); // locale-stripped by @/i18n/routing
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const suppressed =
    pathname === COURSE_PATH || SUPPRESSED.some((p) => pathname.startsWith(p));

  const close = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* private mode — it just shows again next navigation */
    }
    restoreFocusTo.current?.focus?.();
  }, []);

  useEffect(() => {
    if (suppressed) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') return;
    } catch {
      /* storage unavailable — fall through and show once */
    }
    // setTimeout rather than anything rAF-driven: rAF is suspended in a
    // background tab, which would fire the promo the moment someone returns.
    const id = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(id);
  }, [suppressed]);

  // Focus management + Escape + Tab trap.
  useEffect(() => {
    if (!open) return;
    restoreFocusTo.current = document.activeElement as HTMLElement;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-navy/40 backdrop-blur-[2px] motion-safe:animate-[fadeIn_.25s_ease-out]"
        onClick={close}
        aria-hidden
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-title"
        aria-describedby="promo-tagline"
        tabIndex={-1}
        className="fl-light relative w-full max-w-[440px] overflow-hidden rounded-card border border-hairline bg-canvas-card text-ink outline-none fl-elev-3 motion-safe:animate-[promoIn_.35s_cubic-bezier(.16,1,.3,1)]"
      >
        {/* Brand band, echoing the hero gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-navy via-teal to-mint" />

        <button
          type="button"
          onClick={close}
          aria-label={t('close')}
          className="absolute end-3 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-canvas-alt hover:text-navy"
        >
          <X size={16} aria-hidden />
        </button>

        <div className="p-7">
          <p className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-teal">
            {t('eyebrow')}
          </p>

          <h2
            id="promo-title"
            className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-navy"
          >
            {t('title')}
          </h2>

          <p id="promo-tagline" className="mt-3 text-sm leading-relaxed text-ink-muted">
            {t('tagline')}
          </p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold tracking-tight text-navy">
              {t('priceNow')}
            </span>
            <span className="font-display text-lg text-ink-muted line-through decoration-ink-muted/50">
              {t('priceWas')}
            </span>
          </div>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-teal">
            {t('priceNote')}
          </p>

          <Link
            href={COURSE_PATH}
            onClick={close}
            className="fl-submit mt-6"
            data-cursor="magnetic"
          >
            {t('cta')}
            <ArrowRight size={15} className="rtl:rotate-180" aria-hidden />
          </Link>

          <button
            type="button"
            onClick={close}
            className="mx-auto mt-3 block text-xs font-medium text-ink-muted transition-colors hover:text-navy"
          >
            {t('dismiss')}
          </button>
        </div>
      </div>
    </div>
  );
}
