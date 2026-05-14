import Link from 'next/link';
import { strings } from '@/lib/strings';

interface FooterColProps {
  title: string;
  links: { label: string; href: string }[];
  accent?: 'lab' | 'academy';
}

function FooterCol({ title, links, accent }: FooterColProps) {
  const dotColor =
    accent === 'lab'
      ? 'bg-lab shadow-[0_0_10px_2px_rgba(24,169,153,0.55)]'
      : accent === 'academy'
      ? 'bg-academy shadow-[0_0_10px_2px_rgba(245,166,35,0.55)]'
      : null;

  return (
    <div>
      <h3 className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/45">
        {dotColor && <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />}
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-white/65 transition-colors hover:text-white"
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
  return (
    <footer className="border-t border-white/[0.06] bg-brand-bg px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
          {/* Brand block */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label="FutureLine home"
              data-cursor="hover"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-lab shadow-[0_0_12px_2px_rgba(24,169,153,0.55)]"
              />
              <span className="text-sm font-semibold tracking-[0.08em] text-white">
                FUTURELINE
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
              {strings.brand.tagline}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/45">
              {strings.brand.description}
            </p>
          </div>

          <FooterCol
            title="FL Lab"
            accent="lab"
            links={[
              { label: strings.footer.allServices, href: '/services' },
              { label: 'Digitalisation', href: '/services/digitalisation' },
              { label: 'Custom Software', href: '/services/custom-software' },
              { label: 'Automations', href: '/services/automations' },
              { label: 'Consultation', href: '/services/consultation' },
              { label: 'AI Solutions', href: '/ai' },
            ]}
          />

          <FooterCol
            title="FL Academy"
            accent="academy"
            links={[
              { label: strings.footer.allCourses, href: '/courses' },
              { label: strings.footer.onlineCourses, href: '/courses?type=ONLINE' },
              { label: strings.footer.inPersonTraining, href: '/courses?type=IN_PERSON' },
            ]}
          />

          <FooterCol
            title={strings.footer.company}
            links={[
              { label: strings.footer.signIn, href: '/login' },
              { label: strings.footer.createAccount, href: '/register' },
            ]}
          />
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-8 md:flex-row md:items-center">
          <span className="text-xs text-white/40">
            {strings.brand.copyright(new Date().getFullYear())}
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xs text-white/45 transition-colors hover:text-white"
              data-cursor="hover"
            >
              Privacy
            </Link>
            <Link
              href="/"
              className="text-xs text-white/45 transition-colors hover:text-white"
              data-cursor="hover"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
