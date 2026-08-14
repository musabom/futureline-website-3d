/**
 * Root layout — owns <html>/<body> for the whole app.
 *
 * The html tag lives here rather than in [locale]/layout.tsx because files
 * outside the locale tree (not-found.tsx, global-error.tsx) still need a root
 * layout; without one Next fails the build with "doesn't have a root layout".
 * The locale is read from next-intl's request context. English-only now (the
 * site previously also served Arabic/RTL at /ar/*, removed by request) — the
 * locale/dir plumbing is left in place since it degrades cleanly to en/ltr
 * with a single-locale `routing.locales`, rather than hardcoding here.
 */
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import './globals.css';
import { Providers } from '@/components/Providers';
import { localeDirection, type Locale } from '@/i18n/routing';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

// Display face for headings and the wordmark treatment.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FutureLine — Systems Built for Scale',
  description: 'AI-driven solutions, professional training, and intelligent digital services.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dir = localeDirection[locale as Locale] ?? 'ltr';

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${spaceGrotesk.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
