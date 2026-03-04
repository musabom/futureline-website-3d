import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Clock, MapPin, Users, Calendar, BookOpen, CheckCircle } from 'lucide-react';
import EnrollButton from '@/components/EnrollButton';
import { formatPrice } from '@/lib/utils';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug },
    select: { title: true, shortDescription: true, category: true, slug: true },
  });

  if (!course) {
    return { title: 'Course Not Found — FutureLine' };
  }

  return {
    title: `${course.title} — FutureLine Courses`,
    description: course.shortDescription || `Learn ${course.title} with FutureLine. Professional training and education.`,
    openGraph: {
      title: course.title,
      description: course.shortDescription || `Learn ${course.title} with FutureLine.`,
      type: 'website',
      url: `/courses/${course.slug}`,
    },
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: { select: { firstName: true, lastName: true, email: true } },
      _count: { select: { enrollments: true, lessons: true } },
    },
  });

  if (!course || course.status !== 'PUBLISHED') return notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold px-3 py-1 bg-teal/10 text-teal rounded-full">
              {course.deliveryType.replace('_', ' ')}
            </span>
            <span className="text-sm text-gray-400">{course.category}</span>
            <span className="text-sm text-gray-400">{course.level}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">{course.title}</h1>
          <p className="text-lg text-gray-500 mb-8">{course.shortDescription}</p>

          <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-500">
            <span className="flex items-center gap-2"><Clock size={16} /> {course.durationHours} hours</span>
            {course.instructor && (
              <span className="flex items-center gap-2"><Users size={16} /> {course.instructor.firstName} {course.instructor.lastName}</span>
            )}
            {course.location && (
              <span className="flex items-center gap-2"><MapPin size={16} /> {course.location}</span>
            )}
            {course.startDate && (
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(course.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                {course.endDate && ` - ${new Date(course.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
              </span>
            )}
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-navy mb-4">About This Course</h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line">{course.fullDescription}</div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <div className="h-40 bg-brand-gradient rounded-lg flex items-center justify-center mb-6">
              <BookOpen className="text-white/50" size={40} />
            </div>

            <div className="mb-6">
              {course.price > 0 ? (
                <div>
                  <span className="text-3xl font-bold text-teal">{formatPrice(course.discountPrice ?? course.price)}</span>
                  {course.discountPrice && course.discountPrice < course.price && (
                    <span className="text-lg text-gray-400 line-through ml-2">{formatPrice(course.price)}</span>
                  )}
                </div>
              ) : (
                <span className="text-3xl font-bold text-teal">Free</span>
              )}
            </div>

            <EnrollButton 
              courseId={course.id} 
              slug={course.slug} 
              price={course.discountPrice ?? course.price} 
            />

            <div className="mt-6 space-y-3 text-sm text-gray-500">
              <div className="flex items-center gap-2"><Clock size={14} /> {course.durationHours} hours of content</div>
              <div className="flex items-center gap-2"><BookOpen size={14} /> {course._count.lessons} lessons</div>
              <div className="flex items-center gap-2"><Users size={14} /> {course._count.enrollments} enrolled</div>
              {course.seatCapacity && (
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} />
                  {Math.max(0, course.seatCapacity - course._count.enrollments)} seats remaining
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
