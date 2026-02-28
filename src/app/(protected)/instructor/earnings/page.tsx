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
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: DollarSign, color: 'bg-blue-50 text-blue-600' },
    { label: 'Your Share', value: formatPrice(instructorShare), icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'Platform Share', value: formatPrice(platformShare), icon: PieChart, color: 'bg-purple-50 text-purple-600' },
    { label: 'Commission Rate', value: `${commissionRate}%`, icon: Users, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Earnings</h1>
        <p className="text-gray-500 mt-1">Track your revenue and commission breakdown</p>
      </div>

      {!hasRevenue && (
        <div className="card p-5 mb-8 border-l-4 border-l-teal bg-teal/5">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-teal mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-navy">No earnings yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Earnings tracking will activate when paid courses are enabled and students make purchases. 
                Your commission rate is set to <strong>{commissionRate}%</strong> — you&apos;ll receive this percentage of every sale.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-navy">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6 mb-8">
        <h2 className="text-lg font-bold text-navy mb-1">Commission Structure</h2>
        <p className="text-sm text-gray-500 mb-4">Your earnings split for each course sale</p>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 rounded-full bg-teal" style={{ width: `${commissionRate}%` }} />
          <div className="h-4 rounded-full bg-navy/20" style={{ width: `${platformRate}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Your share: {commissionRate}%</span>
          <span>Platform: {platformRate}%</span>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-navy mb-4">Earnings by Course</h2>
        {courseBreakdown.length === 0 ? (
          <p className="text-gray-400 text-sm">No courses yet. Create your first course to start earning!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Course</th>
                  <th className="pb-3 font-medium text-center">Price</th>
                  <th className="pb-3 font-medium text-center">Students</th>
                  <th className="pb-3 font-medium text-right">Revenue</th>
                  <th className="pb-3 font-medium text-right">Your Earnings</th>
                </tr>
              </thead>
              <tbody>
                {courseBreakdown.map((course) => (
                  <tr key={course.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 font-medium text-navy">{course.title}</td>
                    <td className="py-3 text-center text-gray-600">
                      {course.price > 0 ? formatPrice(course.price) : 'Free'}
                    </td>
                    <td className="py-3 text-center text-gray-600">{course.students}</td>
                    <td className="py-3 text-right text-gray-600">{formatPrice(course.revenue)}</td>
                    <td className="py-3 text-right font-semibold text-teal">{formatPrice(course.instructorEarnings)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200">
                  <td className="pt-3 font-bold text-navy">Total</td>
                  <td className="pt-3"></td>
                  <td className="pt-3 text-center font-medium text-gray-600">
                    {courseBreakdown.reduce((s, c) => s + c.students, 0)}
                  </td>
                  <td className="pt-3 text-right font-medium text-gray-600">{formatPrice(totalRevenue)}</td>
                  <td className="pt-3 text-right font-bold text-teal">{formatPrice(instructorShare)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {earnings.length > 0 && (
        <div className="card p-6 mt-8">
          <h2 className="text-lg font-bold text-navy mb-4">Earnings History</h2>
          <div className="space-y-3">
            {earnings.map((earning) => (
              <div key={earning.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-navy">{earning.course.title}</div>
                  <div className="text-xs text-gray-400">{earning.period}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-teal">{formatPrice(earning.instructorCut)}</div>
                  <div className="text-xs text-gray-400">of {formatPrice(earning.amount)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
