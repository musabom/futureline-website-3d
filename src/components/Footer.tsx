import Link from 'next/link';
import { strings } from '@/lib/strings';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest text-on-surface border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">{strings.brand.name}</span>
            </div>
            <p className="text-outline text-sm leading-relaxed">
              {strings.brand.tagline}
            </p>
            <p className="text-outline text-sm mt-2 leading-relaxed">
              {strings.brand.description}
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-wide">FL Academy</h4>
            <ul className="space-y-3 text-sm text-outline">
              <li><Link href="/courses" className="hover:text-primary transition-colors">{strings.footer.allCourses}</Link></li>
              <li><Link href="/courses?type=ONLINE" className="hover:text-primary transition-colors">{strings.footer.onlineCourses}</Link></li>
              <li><Link href="/courses?type=IN_PERSON" className="hover:text-primary transition-colors">{strings.footer.inPersonTraining}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-wide">FL Lab</h4>
            <ul className="space-y-3 text-sm text-outline">
              <li><Link href="/services" className="hover:text-primary transition-colors">{strings.footer.allServices}</Link></li>
              <li><Link href="/services/digitalisation" className="hover:text-primary transition-colors">Digitalisation</Link></li>
              <li><Link href="/ai" className="hover:text-primary transition-colors">AI Solutions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-5 tracking-wide">{strings.footer.company}</h4>
            <ul className="space-y-3 text-sm text-outline">
              <li><Link href="/login" className="hover:text-primary transition-colors">{strings.footer.signIn}</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">{strings.footer.createAccount}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-outline">
          <span>{strings.brand.copyright(new Date().getFullYear())}</span>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
