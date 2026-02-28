import Link from 'next/link';
import { strings } from '@/lib/strings';

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src="/images/logo-dark.png" alt={strings.brand.name} className="h-14 w-auto" />
            </div>
            <p className="text-gray-400 text-sm">
              {strings.brand.tagline}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {strings.brand.description}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{strings.footer.training}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/courses" className="hover:text-teal transition-colors">{strings.footer.allCourses}</Link></li>
              <li><Link href="/courses?type=ONLINE" className="hover:text-teal transition-colors">{strings.footer.onlineCourses}</Link></li>
              <li><Link href="/courses?type=IN_PERSON" className="hover:text-teal transition-colors">{strings.footer.inPersonTraining}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{strings.footer.services}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/services" className="hover:text-teal transition-colors">{strings.footer.allServices}</Link></li>
              <li><Link href="/ai" className="hover:text-teal transition-colors">{strings.footer.aiSolutions}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{strings.footer.company}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/login" className="hover:text-teal transition-colors">{strings.footer.signIn}</Link></li>
              <li><Link href="/register" className="hover:text-teal transition-colors">{strings.footer.createAccount}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          {strings.brand.copyright(new Date().getFullYear())}
        </div>
      </div>
    </footer>
  );
}
