/**
 * Locale routing.
 *
 * English-only — the site previously also served Arabic at /ar/*, but that
 * was removed by request. This file keeps the next-intl plumbing (the
 * `[locale]` App Router segment, `getTranslations`/`useTranslations`
 * throughout the codebase) rather than ripping it out everywhere, since a
 * single-locale `routing.locales` array degrades cleanly: no /ar routes are
 * generated, no locale prefix ever appears (`as-needed` with one locale is
 * always unprefixed), and every page keeps working unmodified.
 */
import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const locales = ['en'] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
})

/** Text direction per locale — drives <html dir>. English-only now, always ltr. */
export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
}

export const localeNames: Record<Locale, string> = {
  en: 'English',
}

// Locale-aware replacements for next/link and next/navigation.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
