import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { BookOpen, Search, Clock, MapPin, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { type?: string; level?: string; search?: string };
}) {
  const where: any = { status: 'PUBLISHED' };
  if (searchParams.type) where.deliveryType = searchParams.type;
  if (searchParams.level) where.level = searchParams.level;
  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: 'insensitive' } },
      { shortDescription: { contains: searchParams.search, mode: 'insensitive' } },
      { category: { contains: searchParams.search, mode: 'insensitive' } },
    ];
  }

  const courses = await prisma.course.findMany({
    where,
    include: { instructor: { select: { name: true } } },
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
            defaultValue={searchParams.search}
            placeholder="Search courses..."
            className="input-field !pl-10"
          />
        </div>
        <select name="type" defaultValue={searchParams.type || ''} className="input-field md:w-48">
          <option value="">All Types</option>
          <option value="ONLINE">Online</option>
          <option value="IN_PERSON">In-Person</option>
          <option value="HYBRID">Hybrid</option>
        </select>
        <select name="level" defaultValue={searchParams.level || ''} className="input-field md:w-48">
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
                  {course.instructor && <span className="flex items-center gap-1"><Users size={14} /> {course.instructor.name}</span>}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="font-bold text-teal text-lg">Free</span>
                  <span className="text-teal font-semibold text-sm">View Details</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
