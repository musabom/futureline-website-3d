/**
 * LocaleSwitcher — toggles between Arabic and English on the current route.
 *
 * Renders as a single glass pill: a globe, then "عربي + English", with each
 * language its own button and the "+" as a plain separator. That display
 * format was specified directly; the two labels stay individually clickable
 * so it remains a real switcher rather than a decorative chip.
 *
 * next-intl's usePathname returns the path without the locale prefix, so
 * switching preserves whatever page the visitor is on. Each option carries
 * lang/dir so its label renders in its own script and direction regardless
 * of the page's direction.
 */
'use client'

import { usePathname, useRouter } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { type Locale } from '@/i18n/routing'
import { Globe } from 'lucide-react'

/** Display order is fixed: Arabic first, matching the requested layout. */
const OPTIONS: { loc: Locale; label: string }[] = [
  { loc: 'ar', label: 'عربي' },
  { loc: 'en', label: 'English' },
]

export function LocaleSwitcher({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const pathname = usePathname()
  const router = useRouter()
  const active = useLocale() as Locale

  const light = tone === 'light'

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-pill border px-3 py-1.5 ${
        light ? 'border-hairline bg-canvas-card' : 'border-white/15 bg-white/[0.04]'
      }`}
      role="group"
      aria-label="Language"
    >
      <Globe size={14} aria-hidden className="text-teal" />
      {OPTIONS.map(({ loc, label }, i) => (
        <span key={loc} className="inline-flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden className={light ? 'text-ink-muted/60' : 'text-white/40'}>
              +
            </span>
          )}
          <button
            type="button"
            lang={loc}
            dir={loc === 'ar' ? 'rtl' : 'ltr'}
            aria-current={loc === active ? 'true' : undefined}
            onClick={() => router.replace(pathname, { locale: loc })}
            className={`rounded-pill text-sm font-semibold transition-colors ${
              loc === 'ar' ? 'font-arabic' : 'font-display'
            } ${
              loc === active
                ? light
                  ? 'text-navy'
                  : 'text-white'
                : light
                  ? 'text-ink-muted hover:text-navy'
                  : 'text-white/60 hover:text-white'
            }`}
            data-cursor="hover"
          >
            {label}
          </button>
        </span>
      ))}
    </div>
  )
}
