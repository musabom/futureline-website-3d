import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/requireAuth';
import { BookOpen, Users, Award, Clock, CheckCircle, XCircle, BarChart3 } from 'lucide-react';

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

  const [approvedCount, rejectedCount] = await Promise.all([
    prisma.course.count({ where: { instructorId, approvalStatus: 'APPROVED' } }),
    prisma.course.count({ where: { instructorId, approvalStatus: 'REJECTED' } }),
  ]);

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentEnrollmentsRaw = await prisma.enrollment.findMany({
    where: {
      course: { instructorId },
      createdAt: { gte: sevenDaysAgo },
    },
    select: { createdAt: true },
  });

  const trendData: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    const dayStr = day.toISOString().slice(0, 10);
    const label = day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' });
    const count = recentEnrollmentsRaw.filter(
      (e) => e.createdAt.toISOString().slice(0, 10) === dayStr
    ).length;
    trendData.push({ label, count });
  }
  const maxTrend = Math.max(...trendData.map((d) => d.count), 1);

  const coursesWithCompletion = await prisma.course.findMany({
    where: { instructorId },
    orderBy: { enrollments: { _count: 'desc' } },
    take: 6,
    include: {
      _count: { select: { enrollments: true, lessons: true } },
      enrollments: {
        select: { progressPercentage: true, completed: true },
      },
    },
  });

  const coursePerformance = coursesWithCompletion.map((course) => {
    const total = course.enrollments.length;
    const completedCount = course.enrollments.filter((e) => e.completed).length;
    const avgProgress =
      total > 0
        ? Math.round(course.enrollments.reduce((sum, e) => sum + e.progressPercentage, 0) / total)
        : 0;
    return {
      id: course.id,
      title: course.title,
      students: total,
      lessons: course._count.lessons,
      completedCount,
      completionRate: total > 0 ? Math.round((completedCount / total) * 100) : 0,
      avgProgress,
      approvalStatus: course.approvalStatus,
    };
  });

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
      user: { select: { firstName: true, lastName: true, email: true } },
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
        <h1 className="text-2xl font-bold text-navy">Welcome, {session.user.firstName}</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={20} className="text-teal" />
            <h2 className="text-lg font-bold text-navy">Enrollment Trend (Last 7 Days)</h2>
          </div>
          <div className="flex items-end gap-2 h-40">
            {trendData.map((day) => (
              <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-navy">{day.count}</span>
                <div
                  className="w-full bg-teal/80 rounded-t-md transition-all"
                  style={{
                    height: `${Math.max((day.count / maxTrend) * 100, 4)}%`,
                    minHeight: '4px',
                  }}
                />
                <span className="text-[10px] text-gray-400 mt-1">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-navy mb-4">Approval Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-500" />
                <span className="text-sm text-gray-600">Approved</span>
              </div>
              <span className="text-lg font-bold text-navy">{approvedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-orange-500" />
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <span className="text-lg font-bold text-navy">{pendingCourses}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle size={18} className="text-red-500" />
                <span className="text-sm text-gray-600">Rejected</span>
              </div>
              <span className="text-lg font-bold text-navy">{rejectedCount}</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden flex">
              {myCourses > 0 && (
                <>
                  <div
                    className="bg-green-500 h-full"
                    style={{ width: `${(approvedCount / myCourses) * 100}%` }}
                  />
                  <div
                    className="bg-orange-400 h-full"
                    style={{ width: `${(pendingCourses / myCourses) * 100}%` }}
                  />
                  <div
                    className="bg-red-400 h-full"
                    style={{ width: `${(rejectedCount / myCourses) * 100}%` }}
                  />
                </>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">{myCourses} total courses</p>
          </div>
        </div>
      </div>

      {coursePerformance.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold text-navy mb-4">Course Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coursePerformance.map((course) => (
              <div key={course.id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-navy line-clamp-2 flex-1">{course.title}</h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ml-2 whitespace-nowrap ${
                      course.approvalStatus === 'APPROVED'
                        ? 'bg-green-50 text-green-600'
                        : course.approvalStatus === 'PENDING'
                        ? 'bg-orange-50 text-orange-600'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {course.approvalStatus}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span>{course.students} students</span>
                  <span>{course.lessons} lessons</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Avg Progress</span>
                      <span className="font-medium text-navy">{course.avgProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${course.avgProgress}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Completion Rate</span>
                      <span className="font-medium text-navy">{course.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-teal h-full rounded-full transition-all"
                        style={{ width: `${course.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-lg font-bold text-navy mb-4">My Courses</h2>
          {topCourses.length === 0 ? (
            <p className="text-gray-400 text-sm">No courses yet. Create your first course!</p>
          ) : (
            <div className="space-y-3">
              {topCourses.map((course) => (
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
                    <div className="text-sm font-medium text-navy">{enrollment.user.firstName} {enrollment.user.lastName}</div>
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
