import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/requireAuth';
import { formatPrice } from '@/lib/utils';
import { DollarSign, TrendingUp, PieChart, Users, Info } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InstructorEarningsPage() {
  const session = await requireAuth(['INSTRUCTOR']);
  const instructorId = session.user.id;

  const instructor = await prisma.user.findUnique({
    where: { id: instructorId },
    select: { commissionRate: true },
  });

  const commissionRate = instructor?.commissionRate ?? 70;
  const platformRate = 100 - commissionRate;

  const courses = await prisma.course.findMany({
    where: { instructorId },
    include: {
      _count: { select: { enrollments: true } },
      orders: {
        where: { paymentStatus: 'COMPLETED' },
        select: { amount: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const earnings = await prisma.instructorEarning.findMany({
    where: { instructorId },
    include: { course: { select: { title: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const totalRevenue = courses.reduce(
    (sum, c) => sum + c.orders.reduce((s, o) => s + o.amount, 0),
    0
  );
  const instructorShare = totalRevenue * (commissionRate / 100);
  const platformShare = totalRevenue * (platformRate / 100);

  const courseBreakdown = courses.map((course) => {
    const courseRevenue = course.orders.reduce((s, o) => s + o.amount, 0);
    return {
      id: course.id,
      title: course.title,
      students: course._count.enrollments,
      revenue: courseRevenue,
      instructorEarnings: courseRevenue * (commissionRate / 100),
      platformEarnings: courseRevenue * (platformRate / 100),
      price: course.price,
    };
  });

  const hasRevenue = totalRevenue > 0;

  const stats = [
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
    { label: 'Your Share', value: formatPrice(instructorShare), icon: TrendingUp, iconBg: 'bg-teal-500/10', iconColor: 'text-teal-400' },
    { label: 'Platform Share', value: formatPrice(platformShare), icon: PieChart, iconBg: 'bg-purple-500/10', iconColor: 'text-purple-400' },
    { label: 'Commission Rate', value: `${commissionRate}%`, icon: Users, iconBg: 'bg-yellow-500/10', iconColor: 'text-yellow-400' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-navy tracking-tight">Earnings</h1>
        <p className="text-ink-muted mt-1 text-sm">Track your revenue and commission breakdown</p>
      </div>

      {!hasRevenue && (
        <div className="rounded-xl border border-teal-500/20 bg-teal-500/10 p-5 mb-8">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-teal-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-navy">No earnings yet</p>
              <p className="text-sm text-ink-muted mt-1">
                Earnings tracking will activate when paid courses are enabled and students make purchases.
                Your commission rate is set to <strong className="text-navy">{commissionRate}%</strong> — you&apos;ll receive this percentage of every sale.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-hairline bg-canvas-card backdrop-blur-sm p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                <stat.icon size={22} className={stat.iconColor} />
              </div>
              <div>
                <div className="text-3xl font-black text-navy">{stat.value}</div>
                <div className="text-sm text-ink-muted">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-hairline bg-canvas-card backdrop-blur-sm p-6 mb-8">
        <h2 className="text-2xl font-black text-navy tracking-tight mb-1">Commission Structure</h2>
        <p className="text-sm text-ink-muted mb-4">Your earnings split for each course sale</p>
        <div className="flex items-center gap-2 mb-2 rounded-full overflow-hidden h-4">
          <div className="h-4 rounded-l-full bg-teal-500" style={{ width: `${commissionRate}%` }} />
          <div className="h-4 rounded-r-full bg-canvas-card" style={{ width: `${platformRate}%` }} />
        </div>
        <div className="flex justify-between text-xs text-ink-muted">
          <span>Your share: {commissionRate}%</span>
          <span>Platform: {platformRate}%</span>
        </div>
      </div>

      <div className="rounded-xl border border-hairline bg-canvas-card overflow-hidden">
        <div className="p-6 border-b border-hairline">
          <h2 className="text-2xl font-black text-navy tracking-tight">Earnings by Course</h2>
        </div>
        {courseBreakdown.length === 0 ? (
          <div className="p-6">
            <p className="text-ink-muted text-sm">No courses yet. Create your first course to start earning!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-hairline bg-canvas-card">
                <tr>
                  <th className="text-left px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-ink-muted">Course</th>
                  <th className="text-center px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-ink-muted">Price</th>
                  <th className="text-center px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-ink-muted">Students</th>
                  <th className="text-right px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-ink-muted">Revenue</th>
                  <th className="text-right px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-ink-muted">Your Earnings</th>
                </tr>
              </thead>
              <tbody>
                {courseBreakdown.map((course) => (
                  <tr key={course.id} className="border-b border-hairline hover:bg-canvas-card">
                    <td className="px-6 py-4 font-medium text-navy">{course.title}</td>
                    <td className="px-6 py-4 text-center text-ink-muted">
                      {course.price > 0 ? formatPrice(course.price) : 'Free'}
                    </td>
                    <td className="px-6 py-4 text-center text-ink-muted">{course.students}</td>
                    <td className="px-6 py-4 text-right text-ink-muted">{formatPrice(course.revenue)}</td>
                    <td className="px-6 py-4 text-right font-semibold text-teal-400">{formatPrice(course.instructorEarnings)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-hairline bg-canvas-card">
                  <td className="px-6 pt-3 pb-4 font-bold text-navy">Total</td>
                  <td className="px-6 pt-3 pb-4"></td>
                  <td className="px-6 pt-3 pb-4 text-center font-medium text-ink-muted">
                    {courseBreakdown.reduce((s, c) => s + c.students, 0)}
                  </td>
                  <td className="px-6 pt-3 pb-4 text-right font-medium text-ink-muted">{formatPrice(totalRevenue)}</td>
                  <td className="px-6 pt-3 pb-4 text-right font-bold text-teal-400">{formatPrice(instructorShare)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {earnings.length > 0 && (
        <div className="rounded-xl border border-hairline bg-canvas-card backdrop-blur-sm p-6 mt-8">
          <h2 className="text-2xl font-black text-navy tracking-tight mb-4">Earnings History</h2>
          <div className="space-y-3">
            {earnings.map((earning) => (
              <div key={earning.id} className="flex items-center justify-between py-2 border-b border-hairline last:border-0">
                <div>
                  <div className="text-sm font-medium text-navy">{earning.course.title}</div>
                  <div className="text-xs text-ink-muted">{earning.period}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-teal-400">{formatPrice(earning.instructorCut)}</div>
                  <div className="text-xs text-ink-muted">of {formatPrice(earning.amount)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
