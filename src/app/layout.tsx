import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Noto_Sans_Arabic } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

// Display face for headings and the wordmark treatment.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

// Arabic face. Non-optional: neither Inter nor Space Grotesk carries Arabic
// glyphs, so the bilingual copy would render as tofu without it.
// next/font self-hosts these at build time — required here, because the app's
// CSP sets font-src 'self' data:, which blocks the Google Fonts CDN outright.
const notoArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FutureLine — Systems Built for Scale',
  description: 'AI-driven solutions, professional training, and intelligent digital services.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${notoArabic.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
