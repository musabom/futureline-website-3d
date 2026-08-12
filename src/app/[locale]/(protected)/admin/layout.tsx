import { requireAuth } from '@/lib/requireAuth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import InactivityWatcher from '@/components/InactivityWatcher';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAuth(['ADMIN']);

  return (
    <div className="flex min-h-screen">
      <InactivityWatcher timeoutMinutes={30} />
      <AdminSidebar />
      <main className="flex-1 fl-dark-surface bg-[#030d1a] overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
