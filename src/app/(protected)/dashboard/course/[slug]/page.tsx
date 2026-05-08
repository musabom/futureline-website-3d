import { requireAuth } from '@/lib/requireAuth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Header from '@/components/Header';
import LessonViewer from '@/components/LessonViewer';
import { ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CourseLearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await requireAuth();
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: { orderBy: { orderIndex: 'asc' } },
      instructor: { select: { firstName: true, lastName: true } },
    },
  });

  if (!course) return notFound();

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
  });

  if (!enrollment) redirect('/dashboard');

  const moduleCount = new Set(course.lessons.map(l => l.moduleTitle)).size;
  const progress = Math.round(enrollment.progressPercentage);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#030d1a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-400 text-xs font-bold uppercase tracking-widest mb-8 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>

          {/* Course header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">{course.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-5 font-medium uppercase tracking-widest">
              {course.instructor && (
                <span className="flex items-center gap-1.5">
                  <Users size={12} /> {course.instructor.firstName} {course.instructor.lastName}
                </span>
              )}
              <span>{moduleCount} modules</span>
              <span>{course.lessons.length} lessons</span>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${enrollment.progressPercentage}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 font-bold tabular-nums shrink-0">{progress}%</span>
            </div>
          </div>

          <LessonViewer
            lessons={course.lessons.map(l => ({
              id: l.id,
              moduleTitle: l.moduleTitle,
              lessonTitle: l.lessonTitle,
              lessonType: l.lessonType,
              content: l.content,
              videoUrl: l.videoUrl,
              resources: l.resources,
              questions: l.questions as any,
              orderIndex: l.orderIndex,
            }))}
            enrollmentId={enrollment.id}
            progressPercentage={enrollment.progressPercentage}
            totalLessons={course.lessons.length}
          />
        </div>
      </div>
    </>
  );
}
