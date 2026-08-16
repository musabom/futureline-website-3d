/**
 * Locale routing.
 *
 * localePrefix: 'as-needed' is deliberate. English keeps unprefixed URLs
 * (/courses, /services/...) and Arabic is purely additive at /ar/*.
 * Switching to an always-prefixed scheme would move every existing URL and
 * require a redirect map to avoid losing search rankings and breaking
 * inbound links.
 *
 * Note: bilingual support was removed at one point and then restored by
 * request — see the git history around "remove Arabic/bilingual support"
 * and its revert if any Arabic-specific asset looks unexpectedly missing.
 */
import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
})

/** Text direction per locale — drives <html dir> and RTL-aware layout. */
export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
}

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
}

// Locale-aware replacements for next/link and next/navigation.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
