'use client';
import Link from 'next/link';

import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard, BookOpen, FileText, Briefcase, Users,
  ShoppingCart, GraduationCap, Brain, Palette, Star,
  MessageSquare, LogOut, Home
} from 'lucide-react';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen },
  { href: '/admin/lessons', label: 'Lessons', icon: FileText },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/enrollments', label: 'Enrollments', icon: GraduationCap },
  { href: '/admin/leads', label: 'Leads', icon: MessageSquare },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/ai-settings', label: 'AI Settings', icon: Brain },
  { href: '/admin/brand', label: 'Brand Settings', icon: Palette },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-navy text-white flex flex-col min-h-screen sticky top-0">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <img src="/images/logo-icon-dark.png" alt="FutureLine" className="h-9 w-auto" />
          <div>
            <span className="text-lg font-bold block">FutureLine</span>
            <span className="text-xs text-gray-400">Admin Portal</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
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
