/**
 * Footer — real multi-column footer.
 * Brand block + 3 columns of links + legal row.
 * Hairline borders, generous spacing, no novelty motion.
 */
import Link from 'next/link'

interface FooterColProps {
  title: string
  links: { label: string; href: string }[]
}

function FooterCol({ title, links }: FooterColProps) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-white/45">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

const SOCIAL_ICONS = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.16c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18.244 2H21.6l-7.66 8.756L23 22h-7.094l-5.56-6.74L3.83 22H.474l8.19-9.36L1 2h7.273l5.027 6.16L18.244 2Zm-1.18 18h1.917L7.06 4H5.014l12.05 16Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M4.98 3.5a2.5 2.5 0 1 1-.001 5.001A2.5 2.5 0 0 1 4.98 3.5ZM2.5 9.5h5v12h-5v-12Zm7 0h4.8v1.7h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 6 3.33 6 7.66V21.5h-5v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.97v5.69h-5v-12Z" />
    </svg>
  ),
} as const

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-brand-bg px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-5">
          {/* Brand block */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2" aria-label="FUTURE LINE home">
              <span className="h-2 w-2 rounded-full bg-brand-accent shadow-[0_0_12px_2px_rgba(125,211,252,0.6)]" />
              <span className="text-sm font-semibold tracking-[0.08em]">
                FUTURE LINE
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              The platform for teams who ship the future, every day.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {(['github', 'x', 'linkedin'] as const).map((id) => (
                <a
                  key={id}
                  href="#"
                  aria-label={id}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-white/30 hover:text-white"
                >
                  {SOCIAL_ICONS[id]}
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Product"
            links={[
              { label: 'Platform', href: '#platform' },
              { label: 'Features', href: '#features' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'Changelog', href: '#changelog' },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { label: 'About', href: '#about' },
              { label: 'Careers', href: '#careers' },
              { label: 'Press', href: '#press' },
              { label: 'Contact', href: '#contact' },
            ]}
          />
          <FooterCol
            title="Resources"
            links={[
              { label: 'Docs', href: '#docs' },
              { label: 'Blog', href: '#blog' },
              { label: 'Community', href: '#community' },
              { label: 'Status', href: '#status' },
            ]}
          />
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-8 md:flex-row md:items-center">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} FUTURE LINE, Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Security'].map((label) => (
              <Link
                key={label}
                href="#"
                className="text-xs text-white/45 transition-colors hover:text-white"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}
