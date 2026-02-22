import Link from 'next/link';


export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src="/images/logo-dark.png" alt="FutureLine" className="h-14 w-auto" />
            </div>
            <p className="text-gray-400 text-sm">
              Design &bull; Deploy &bull; Evolve
            </p>
            <p className="text-gray-400 text-sm mt-2">
              AI-driven solutions, professional training, and intelligent digital services.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Training</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/courses" className="hover:text-teal transition-colors">All Courses</Link></li>
              <li><Link href="/courses?type=ONLINE" className="hover:text-teal transition-colors">Online Courses</Link></li>
              <li><Link href="/courses?type=IN_PERSON" className="hover:text-teal transition-colors">In-Person Training</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/services" className="hover:text-teal transition-colors">All Services</Link></li>
              <li><Link href="/ai" className="hover:text-teal transition-colors">AI Solutions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/login" className="hover:text-teal transition-colors">Sign In</Link></li>
              <li><Link href="/register" className="hover:text-teal transition-colors">Create Account</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} FutureLine. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
