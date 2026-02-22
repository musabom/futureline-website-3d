import { requireAuth } from '@/lib/requireAuth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAuth(['ADMIN']);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-soft overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
