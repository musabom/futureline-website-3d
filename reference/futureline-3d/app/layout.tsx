import './globals.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { SmoothScrollProvider } from './providers/SmoothScrollProvider'
import { Nav } from '@/components/nav/Nav'
import { Footer } from '@/components/footer/Footer'
import { CustomCursor } from '@/components/ui/CustomCursor'
import { SplashIntro } from '@/components/ui/SplashIntro'

export const metadata: Metadata = {
  title: 'FUTURE LINE — Design. Deploy. Evolve.',
  description:
    'The platform for teams who design, ship, and grow their product — all in one continuous motion.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="bg-brand-bg font-sans text-brand-fg antialiased">
        {/* SplashIntro renders nothing unless this is a fresh session AND
            reduced-motion is off. Plays once, sets a sessionStorage flag. */}
        <SplashIntro />
        {/* CustomCursor renders nothing on touch / coarse-pointer devices
            and respects prefers-reduced-motion. */}
        <CustomCursor />
        <SmoothScrollProvider>
          <Nav />
          {children}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
