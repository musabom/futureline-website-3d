import { requireAuth } from '@/lib/requireAuth';
import InstructorSidebar from '@/components/InstructorSidebar';

export const dynamic = 'force-dynamic';

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
  await requireAuth(['INSTRUCTOR']);

  return (
    <div className="flex min-h-screen">
      <InstructorSidebar />
      <main className="flex-1 bg-gray-soft overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
