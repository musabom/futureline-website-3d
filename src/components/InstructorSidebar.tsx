'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, BookOpen, FileText, DollarSign, Settings, LogOut, Home } from 'lucide-react';

const links = [
  { href: '/instructor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/instructor/courses', label: 'My Courses', icon: BookOpen },
  { href: '/instructor/lessons', label: 'Course Builder', icon: FileText },
  { href: '/instructor/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/instructor/settings', label: 'Settings', icon: Settings },
];

export default function InstructorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-navy text-white flex flex-col min-h-screen sticky top-0">
      <div className="p-6 border-b border-white/10">
        <Link href="/instructor" className="flex items-center gap-2">
          <img src="/images/logo-icon-dark.png" alt="FutureLine" className="h-9 w-auto" />
          <div>
            <span className="text-lg font-bold block">FutureLine</span>
            <span className="text-xs text-gray-400">Instructor Portal</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/instructor' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`admin-sidebar-item ${isActive ? 'active' : ''}`}
            >
              <link.icon size={18} />
              <span className="text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-1">
        <Link href="/" className="admin-sidebar-item">
          <Home size={18} />
          <span className="text-sm">View Site</span>
        </Link>
        <button onClick={() => signOut()} className="admin-sidebar-item w-full">
          <LogOut size={18} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
