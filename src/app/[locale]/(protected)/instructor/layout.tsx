import { requireAuth } from '@/lib/requireAuth';
import InstructorSidebar from '@/components/InstructorSidebar';
import InactivityWatcher from '@/components/InactivityWatcher';

export const dynamic = 'force-dynamic';

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
  await requireAuth(['INSTRUCTOR']);

  return (
    <div className="flex min-h-screen">
      <InactivityWatcher timeoutMinutes={30} />
      <InstructorSidebar />
      <main className="flex-1 fl-dark-surface bg-[#030d1a] overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
