/**
 * LocaleSwitcher — toggles between English and Arabic on the current route.
 *
 * next-intl's usePathname returns the path without the locale prefix, so
 * switching preserves whatever page the visitor is on. Each option carries
 * lang/dir so the label renders in its own script and direction regardless of
 * the page's direction.
 */
'use client'

import { usePathname, useRouter } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { locales, localeNames, type Locale } from '@/i18n/routing'
import { Globe } from 'lucide-react'

export function LocaleSwitcher({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const pathname = usePathname()
  const router = useRouter()
  const active = useLocale() as Locale

  const light = tone === 'light'

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-pill border p-0.5 ${
        light ? 'border-hairline bg-canvas-card' : 'border-white/15 bg-white/[0.04]'
      }`}
    >
      <Globe
        size={14}
        aria-hidden
        className={`ms-2 ${light ? 'text-ink-muted' : 'text-white/50'}`}
      />
      {locales.map((loc) => {
        const isActive = loc === active
        return (
          <button
            key={loc}
            type="button"
            lang={loc}
            dir={loc === 'ar' ? 'rtl' : 'ltr'}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => router.replace(pathname, { locale: loc })}
            className={`rounded-pill px-2.5 py-1 text-xs font-semibold transition-colors ${
              loc === 'ar' ? 'font-arabic' : 'font-display'
            } ${
              isActive
                ? light
                  ? 'bg-navy text-white'
                  : 'bg-white text-black'
                : light
                  ? 'text-ink-muted hover:text-navy'
                  : 'text-white/60 hover:text-white'
            }`}
            data-cursor="hover"
          >
            {localeNames[loc]}
          </button>
        )
      })}
    </div>
  )
}
