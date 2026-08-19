/**
 * HtmlLangSync — keeps <html lang> and <html dir> in step with the active
 * locale after a client-side language switch.
 *
 * The <html> element lives in the ROOT layout (src/app/layout.tsx), above the
 * [locale] segment, so it renders once and does NOT re-render when the locale
 * switches via a soft navigation (next-intl's router.replace in the
 * LocaleSwitcher). Without this, switching EN⇄AR would leave lang/dir — and
 * therefore RTL/LTR — stuck on the previous language. This runs inside the
 * [locale] subtree, which does re-render on a locale change, so the effect
 * re-fires and updates the document direction.
 */
'use client';

import { useEffect } from 'react';
import { localeDirection, type Locale } from '@/i18n/routing';

export function HtmlLangSync({ locale }: { locale: string }) {
  useEffect(() => {
    const dir = localeDirection[locale as Locale] ?? 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  return null;
}
