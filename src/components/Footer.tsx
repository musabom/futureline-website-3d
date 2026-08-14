/**
 * Footer — light footer for the redesigned public site.
 *
 * Columns follow the company profile: the three pillars, the company links,
 * and the Muscat location. Uses the locale-aware Link so an Arabic visitor
 * stays in Arabic when navigating.
 */
import Image from 'next/image';
import { Link } from '@/i18n/routing';

interface FooterColProps {
  title: string;
  links: { label: string; href: string }[];
}

function FooterCol({ title, links }: FooterColProps) {
  return (
    <div>
      <h3 className="mb-5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-ink-muted transition-colors hover:text-teal"
              data-cursor="hover"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline bg-canvas-alt px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 inline-flex items-center gap-2.5" aria-label="FutureLine home">
              <Image
                src="/images/logo-mark.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7"
              />
              <span className="font-display text-lg font-bold tracking-tight text-navy">
                FutureLine
              </span>
            </Link>
            <p className="max-w-xs font-display text-base font-semibold text-navy">
              Making everyone a leader in AI.
            </p>
            <p className="mt-5 text-sm text-ink-muted">
              Muscat, Sultanate of Oman
            </p>
          </div>

          <FooterCol
            title="What we offer"
            links={[
              { label: 'Consulting', href: '/get-started?pillar=consulting' },
              { label: 'Building Applications', href: '/get-started?pillar=applications' },
              { label: 'Training & Enablement', href: '/courses' },
            ]}
          />

          <FooterCol
            title="Company"
            links={[
              { label: 'Vision & Mission', href: '/about' },
              { label: 'Who we serve', href: '/#who-we-serve' },
              { label: 'FAQ', href: '/faq' },
              { label: 'Readiness assessment', href: '/#audit' },
            ]}
          />
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-hairline pt-8 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} FutureLine.ai. All rights reserved.</p>
          {/* No privacy/terms routes exist in the app yet — deliberately not
              linked rather than pointing at a 404. */}
          <p>
            <Link href="/courses" className="transition-colors hover:text-teal">
              Courses
            </Link>
            <span aria-hidden className="mx-2">
              ·
            </span>
            <Link href="/audit" className="transition-colors hover:text-teal">
              Systems audit
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
