import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/requireAuth';
import { BookOpen, Users, Award, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InstructorDashboard() {
  const session = await requireAuth(['INSTRUCTOR']);
  const instructorId = session.user.id;

  const [myCourses, totalEnrollments, publishedCourses, pendingCourses] = await Promise.all([
    prisma.course.count({ where: { instructorId } }),
    prisma.enrollment.count({ where: { course: { instructorId } } }),
    prisma.course.count({ where: { instructorId, status: 'PUBLISHED', approvalStatus: 'APPROVED' } }),
    prisma.course.count({ where: { instructorId, approvalStatus: 'PENDING' } }),
  ]);

  const topCourses = await prisma.course.findMany({
    where: { instructorId },
    take: 5,
    orderBy: { enrollments: { _count: 'desc' } },
    include: { _count: { select: { enrollments: true, lessons: true } } },
  });

  const recentEnrollments = await prisma.enrollment.findMany({
    where: { course: { instructorId } },
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
  });

  const stats = [
    { label: 'My Courses', value: myCourses, icon: BookOpen, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Students', value: totalEnrollments, icon: Users, color: 'bg-green-50 text-green-600' },
    { label: 'Published', value: publishedCourses, icon: Award, color: 'bg-purple-50 text-purple-600' },
    { label: 'Pending Approval', value: pendingCourses, icon: Clock, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Welcome, {session.user.name}</h1>
        <p className="text-gray-500 mt-1">Your instructor dashboard</p>
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
          <h2 className="text-lg font-bold text-navy mb-4">My Courses</h2>
          {topCourses.length === 0 ? (
            <p className="text-gray-400 text-sm">No courses yet. Create your first course!</p>
          ) : (
            <div className="space-y-3">
              {topCourses.map((course, i) => (
                <div key={course.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-navy">{course.title}</div>
                    <div className="text-xs text-gray-400">{course._count.lessons} lessons</div>
                  </div>
                  <div className="text-sm text-gray-500">{course._count.enrollments} students</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-navy mb-4">Recent Enrollments</h2>
          {recentEnrollments.length === 0 ? (
            <p className="text-gray-400 text-sm">No enrollments yet</p>
          ) : (
            <div className="space-y-3">
              {recentEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-navy">{enrollment.user.name}</div>
                    <div className="text-xs text-gray-400">{enrollment.course.title}</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(enrollment.createdAt).toLocaleDateString('en-GB')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
