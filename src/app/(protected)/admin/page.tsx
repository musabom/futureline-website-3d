import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { DollarSign, Users, BookOpen, Briefcase, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [totalRevenue, activeStudents, totalCourses, totalServices, recentOrders, topCourses] = await Promise.all([
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
  ]);

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
