import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { DollarSign, Users, BookOpen, Briefcase, TrendingUp, Clock, AlertCircle, BarChart3 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [
    totalRevenue,
    activeStudents,
    totalCourses,
    totalServices,
    recentOrders,
    topCourses,
    pendingApprovals,
    enrollmentsLast7Days,
    leadsByStage,
    ordersLast7Days,
    topInstructors,
  ] = await Promise.all([
    prisma.order.aggregate({ _sum: { amount: true }, where: { paymentStatus: 'COMPLETED' } }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.course.count(),
    prisma.service.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } }, course: { select: { title: true } } },
    }),
    prisma.course.findMany({
      take: 5,
      orderBy: { enrollments: { _count: 'desc' } },
      include: { _count: { select: { enrollments: true } } },
    }),
    prisma.course.count({ where: { approvalStatus: 'PENDING' } }),
    prisma.enrollment.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    }),
    prisma.lead.groupBy({
      by: ['stage'],
      _count: { id: true },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: sevenDaysAgo }, paymentStatus: 'COMPLETED' },
      select: { amount: true, createdAt: true },
    }),
    prisma.user.findMany({
      where: { role: 'INSTRUCTOR' },
      select: {
        id: true,
        name: true,
        courses: {
          select: {
            _count: { select: { enrollments: true } },
          },
        },
      },
    }),
  ]);

  const enrollmentsByDay: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    enrollmentsByDay[d.toISOString().slice(0, 10)] = 0;
  }
  for (const e of enrollmentsLast7Days) {
    const key = new Date(e.createdAt).toISOString().slice(0, 10);
    if (key in enrollmentsByDay) enrollmentsByDay[key]++;
  }
  const enrollmentTrend = Object.entries(enrollmentsByDay).map(([date, count]) => ({
    label: new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short' }),
    count,
  }));
  const maxEnrollment = Math.max(...enrollmentTrend.map((d) => d.count), 1);

  const revenueByDay: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo);
    d.setDate(d.getDate() + i);
    revenueByDay[d.toISOString().slice(0, 10)] = 0;
  }
  for (const o of ordersLast7Days) {
    const key = new Date(o.createdAt).toISOString().slice(0, 10);
    if (key in revenueByDay) revenueByDay[key] += o.amount;
  }
  const revenueTrend = Object.entries(revenueByDay).map(([date, amount]) => ({
    label: new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short' }),
    amount,
  }));
  const maxRevenue = Math.max(...revenueTrend.map((d) => d.amount), 1);

  const stageOrder = ['NEW', 'CONTACTED', 'OFFER_SENT', 'FOLLOW_UP', 'NEGOTIATING', 'WON', 'LOST'] as const;
  const stageLabels: Record<string, string> = {
    NEW: 'New',
    CONTACTED: 'Contacted',
    OFFER_SENT: 'Offer Sent',
    FOLLOW_UP: 'Follow Up',
    NEGOTIATING: 'Negotiating',
    WON: 'Won',
    LOST: 'Lost',
  };
  const stageColors: Record<string, string> = {
    NEW: 'bg-blue-500',
    CONTACTED: 'bg-cyan-500',
    OFFER_SENT: 'bg-indigo-500',
    FOLLOW_UP: 'bg-yellow-500',
    NEGOTIATING: 'bg-orange-500',
    WON: 'bg-green-500',
    LOST: 'bg-red-400',
  };
  const leadPipeline = stageOrder.map((stage) => {
    const found = leadsByStage.find((l) => l.stage === stage);
    return { stage, label: stageLabels[stage], count: found?._count?.id || 0, color: stageColors[stage] };
  });
  const totalLeads = leadPipeline.reduce((sum, l) => sum + l.count, 0);

  const instructorPerformance = topInstructors
    .map((inst) => ({
      name: inst.name,
      students: inst.courses.reduce((sum, c) => sum + c._count.enrollments, 0),
      courses: inst.courses.length,
    }))
    .sort((a, b) => b.students - a.students)
    .slice(0, 5);

  const stats = [
    { label: 'Total Revenue', value: formatPrice(totalRevenue._sum.amount || 0), icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Active Students', value: activeStudents, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Courses', value: totalCourses, icon: BookOpen, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Services', value: totalServices, icon: Briefcase, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your platform</p>
      </div>

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

      {pendingApprovals > 0 && (
        <div className="card p-4 mb-8 border-l-4 border-yellow-400 bg-yellow-50 flex items-center gap-3">
          <AlertCircle size={20} className="text-yellow-600" />
          <div>
            <span className="font-semibold text-yellow-800">{pendingApprovals} course{pendingApprovals !== 1 ? 's' : ''} pending approval</span>
            <span className="text-yellow-700 text-sm ml-2">— review in the Courses section</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-teal" />
            <h2 className="text-lg font-bold text-navy">Enrollment Trend (Last 7 Days)</h2>
          </div>
          <div className="flex items-end gap-2 h-40">
            {enrollmentTrend.map((day) => (
              <div key={day.label} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-xs font-semibold text-navy mb-1">{day.count}</span>
                <div
                  className="w-full bg-teal rounded-t-md transition-all"
                  style={{ height: `${(day.count / maxEnrollment) * 100}%`, minHeight: day.count > 0 ? '8px' : '2px' }}
                />
                <span className="text-xs text-gray-400 mt-2">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-green-600" />
            <h2 className="text-lg font-bold text-navy">Revenue Trend (Last 7 Days)</h2>
          </div>
          <div className="flex items-end gap-2 h-40">
            {revenueTrend.map((day) => (
              <div key={day.label} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-xs font-semibold text-navy mb-1">{day.amount > 0 ? formatPrice(day.amount) : '£0'}</span>
                <div
                  className="w-full bg-green-500 rounded-t-md transition-all"
                  style={{ height: `${(day.amount / maxRevenue) * 100}%`, minHeight: day.amount > 0 ? '8px' : '2px' }}
                />
                <span className="text-xs text-gray-400 mt-2">{day.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-indigo-500" />
            <h2 className="text-lg font-bold text-navy">Lead Pipeline</h2>
            <span className="ml-auto text-sm text-gray-400">{totalLeads} total</span>
          </div>
          {totalLeads === 0 ? (
            <p className="text-gray-400 text-sm">No leads yet</p>
          ) : (
            <div className="space-y-3">
              {leadPipeline.map((stage) => (
                <div key={stage.stage} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-24 shrink-0">{stage.label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div
                      className={`${stage.color} h-full rounded-full transition-all`}
                      style={{ width: `${(stage.count / totalLeads) * 100}%`, minWidth: stage.count > 0 ? '12px' : '0' }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-navy w-8 text-right">{stage.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-purple-500" />
            <h2 className="text-lg font-bold text-navy">Top Instructors</h2>
          </div>
          {instructorPerformance.length === 0 ? (
            <p className="text-gray-400 text-sm">No instructors yet</p>
          ) : (
            <div className="space-y-3">
              {instructorPerformance.map((inst, i) => (
                <div key={inst.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-teal w-6">{i + 1}</span>
                    <div>
                      <div className="text-sm font-medium text-navy">{inst.name}</div>
                      <div className="text-xs text-gray-400">{inst.courses} course{inst.courses !== 1 ? 's' : ''}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{inst.students} student{inst.students !== 1 ? 's' : ''}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-lg font-bold text-navy mb-4">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-400 text-sm">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-navy">{order.user.name}</div>
                    <div className="text-xs text-gray-400">{order.course.title}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-navy">{formatPrice(order.amount)}</div>
                    <div className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-GB')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-navy mb-4">Top Courses</h2>
          {topCourses.length === 0 ? (
            <p className="text-gray-400 text-sm">No courses yet</p>
          ) : (
            <div className="space-y-3">
              {topCourses.map((course, i) => (
                <div key={course.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-teal w-6">{i + 1}</span>
                    <div className="text-sm font-medium text-navy">{course.title}</div>
                  </div>
                  <div className="text-sm text-gray-500">{course._count.enrollments} enrolled</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
