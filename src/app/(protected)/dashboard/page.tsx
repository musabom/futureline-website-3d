import { requireAuth } from '@/lib/requireAuth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { BookOpen, Clock, CheckCircle, ShoppingCart, User, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await requireAuth();

  if (session.user.role === 'ADMIN') {
    const { redirect } = await import('next/navigation');
    redirect('/admin');
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          lessons: true,
          instructor: { select: { firstName: true, lastName: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { course: { select: { title: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy">Welcome, {session.user.firstName}</h1>
          <p className="text-gray-500 mt-1">Manage your courses and track your progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center">
                <BookOpen className="text-teal" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-navy">{enrollments.length}</div>
                <div className="text-sm text-gray-500">Enrolled Courses</div>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-green-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-navy">{enrollments.filter(e => e.completed).length}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <ShoppingCart className="text-blue-500" size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-navy">{orders.length}</div>
                <div className="text-sm text-gray-500">Orders</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-bold text-navy mb-6">My Courses</h2>
          {enrollments.length === 0 ? (
            <div className="card p-12 text-center">
              <BookOpen className="text-gray-300 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No courses yet</h3>
              <p className="text-gray-400 mb-4">Browse our catalogue to get started</p>
              <Link href="/courses" className="btn-primary inline-flex items-center gap-2">
                Explore Courses <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <Link
                  href={`/dashboard/course/${enrollment.course.slug}`}
                  key={enrollment.id}
                  className="card overflow-hidden group"
                >
                  <div className="h-32 bg-brand-gradient flex items-center justify-center">
                    <BookOpen className="text-white/50" size={32} />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-navy mb-2 group-hover:text-teal transition-colors">
                      {enrollment.course.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <span>{enrollment.course.deliveryType.replace('_', ' ')}</span>
                      <span>&bull;</span>
                      <span>{enrollment.course.lessons.length} lessons</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-teal rounded-full h-2 transition-all"
                        style={{ width: `${enrollment.progressPercentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{Math.round(enrollment.progressPercentage)}% complete</span>
                      {enrollment.completed && (
                        <span className="text-green-500 flex items-center gap-1"><CheckCircle size={12} /> Done</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-navy mb-6">Order History</h2>
          {orders.length === 0 ? (
            <p className="text-gray-400">No orders yet.</p>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 text-sm text-navy font-medium">{order.course.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatPrice(order.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          order.paymentStatus === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-GB')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
