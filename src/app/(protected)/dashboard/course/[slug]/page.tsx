import { requireAuth } from '@/lib/requireAuth';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Header from '@/components/Header';
import LessonViewer from '@/components/LessonViewer';
import { ArrowLeft, BookOpen, Users } from 'lucide-react';
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

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-navy mb-6 text-sm">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-navy mb-2">{course.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            {course.instructor && <span className="flex items-center gap-1"><Users size={14} /> {course.instructor.firstName} {course.instructor.lastName}</span>}
            <span>{moduleCount} modules</span>
            <span>{course.lessons.length} lessons</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-teal rounded-full h-2 transition-all" style={{ width: `${enrollment.progressPercentage}%` }} />
          </div>
          <span className="text-sm text-gray-500 mt-1 block">{Math.round(enrollment.progressPercentage)}% complete</span>
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
    </>
  );
}
