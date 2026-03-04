import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { BookOpen, Search, Clock, MapPin, Users, MessageSquare } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import CourseEnquiryForm from '@/components/CourseEnquiryForm';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Courses — FutureLine | Professional & Technical Training',
  description: 'Browse our catalogue of professional and technical courses. Filter by delivery type, level, and category. Online, in-person, and hybrid options available.',
  openGraph: {
    title: 'Courses — FutureLine',
    description: 'Browse our catalogue of professional and technical courses. Online, in-person, and hybrid options available.',
    type: 'website',
    url: '/courses',
  },
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; level?: string; search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const where: any = { status: 'PUBLISHED', approvalStatus: 'APPROVED' };
  if (resolvedParams.type) where.deliveryType = resolvedParams.type;
  if (resolvedParams.level) where.level = resolvedParams.level;
  if (resolvedParams.search) {
    where.OR = [
      { title: { contains: resolvedParams.search, mode: 'insensitive' } },
      { shortDescription: { contains: resolvedParams.search, mode: 'insensitive' } },
      { category: { contains: resolvedParams.search, mode: 'insensitive' } },
    ];
  }

  const courses = await prisma.course.findMany({
    where,
    include: { instructor: { select: { firstName: true, lastName: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">Our Courses</h1>
        <p className="text-gray-500">Find the perfect course to advance your career</p>
      </div>

      <form className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            name="search"
            defaultValue={resolvedParams.search}
            placeholder="Search courses..."
            className="input-field !pl-10"
          />
        </div>
        <select name="type" defaultValue={resolvedParams.type || ''} className="input-field md:w-48">
          <option value="">All Types</option>
          <option value="ONLINE">Online</option>
          <option value="IN_PERSON">In-Person</option>
          <option value="HYBRID">Hybrid</option>
        </select>
        <select name="level" defaultValue={resolvedParams.level || ''} className="input-field md:w-48">
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <button type="submit" className="btn-primary">Filter</button>
      </form>

      {courses.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="text-gray-300 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-400">No courses found</h3>
          <p className="text-gray-400 mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link href={`/courses/${course.slug}`} key={course.id} className="card overflow-hidden group">
              <div className="h-44 bg-brand-gradient flex items-center justify-center">
                <BookOpen className="text-white/50" size={40} />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold px-2 py-1 bg-teal/10 text-teal rounded-full">
                    {course.deliveryType.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-400">{course.level}</span>
                  <span className="text-xs text-gray-400">{course.category}</span>
                </div>
                <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-teal transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.shortDescription}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><Clock size={14} /> {course.durationHours}h</span>
                  {course.location && <span className="flex items-center gap-1"><MapPin size={14} /> {course.location}</span>}
                  {course.instructor && <span className="flex items-center gap-1"><Users size={14} /> {course.instructor.firstName} {course.instructor.lastName}</span>}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="font-bold text-teal text-lg">{course.price > 0 ? formatPrice(course.discountPrice ?? course.price) : 'Free'}</span>
                  <span className="text-teal font-semibold text-sm">View Details</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <section className="mt-20 bg-gray-50 rounded-2xl p-8 md:p-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="text-white" size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
              Can&apos;t Find What You&apos;re Looking For?
            </h2>
            <p className="text-gray-500 leading-relaxed">
              We offer custom training programmes tailored to your team&apos;s needs. Tell us what you&apos;re interested in and we&apos;ll get back to you.
            </p>
          </div>
          <CourseEnquiryForm />
        </div>
      </section>
    </div>
  );
}
