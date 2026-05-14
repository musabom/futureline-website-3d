import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { BookOpen, Search, MessageSquare, SlidersHorizontal } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import CourseEnquiryForm from '@/components/CourseEnquiryForm';
import CourseCard from '@/components/ui/course-card';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Course Explorer — FL Academy | FutureLine',
  description: 'Browse our catalogue of professional and technical courses. Filter by level and category.',
  openGraph: {
    title: 'Course Explorer — FL Academy',
    description: 'Browse our catalogue of professional and technical courses.',
    type: 'website',
    url: '/courses',
  },
};

const LEVEL_COLORS: Record<string, string> = {
  Beginner:     'bg-teal-500/20 border-teal-500/30 text-teal-400',
  Intermediate: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
  Advanced:     'bg-purple-500/20 border-purple-500/30 text-purple-400',
};

const CARD_GRADIENTS = [
  'from-teal-900/80 via-slate-900 to-slate-950',
  'from-blue-900/80 via-slate-900 to-slate-950',
  'from-purple-900/80 via-slate-900 to-slate-950',
  'from-emerald-900/80 via-slate-900 to-slate-950',
  'from-cyan-900/80 via-slate-900 to-slate-950',
  'from-indigo-900/80 via-slate-900 to-slate-950',
];

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; category?: string; search?: string; tab?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const params  = await searchParams;
  const activeTab = params.tab || 'all';

  const where: any = { status: 'PUBLISHED', approvalStatus: 'APPROVED' };

  if (activeTab === 'enrolled' && session?.user?.id) {
    where.enrollments = { some: { userId: session.user.id } };
  }
  if (params.level)    where.level    = params.level;
  if (params.category) where.category = params.category;
  if (params.search) {
    where.OR = [
      { title:            { contains: params.search, mode: 'insensitive' } },
      { shortDescription: { contains: params.search, mode: 'insensitive' } },
      { category:         { contains: params.search, mode: 'insensitive' } },
    ];
  }

  const [courses, categoryRows] = await Promise.all([
    prisma.course.findMany({
      where,
      include: {
        instructor:  { select: { firstName: true, lastName: true } },
        enrollments: session?.user?.id ? { where: { userId: session.user.id } } : false,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.course.findMany({
      where:    { status: 'PUBLISHED', approvalStatus: 'APPROVED' },
      select:   { category: true },
      distinct: ['category'],
    }),
  ]);

  const categories = categoryRows.map((r) => r.category).filter(Boolean) as string[];
  const totalCount = await prisma.course.count({ where: { status: 'PUBLISHED', approvalStatus: 'APPROVED' } });

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#030d1a] overflow-hidden">

      {/* ── Filter Panel ── */}
      <aside className="w-64 flex-shrink-0 border-r border-white/[0.06] bg-slate-950/40 backdrop-blur-xl overflow-y-auto">
        <form method="GET" action="/courses" className="p-6 space-y-8">
          {/* search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input
              name="search"
              defaultValue={params.search}
              placeholder="Search courses…"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50"
            />
          </div>

          {/* Category */}
          {categories.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white mb-4">
                <SlidersHorizontal size={13} className="text-teal-400" /> Category
              </h3>
              <div className="space-y-1">
                <Link
                  replace
                  href={`/courses?${new URLSearchParams({ ...(params.level ? { level: params.level } : {}), ...(params.search ? { search: params.search } : {}) }).toString()}`}
                  className={`block w-full text-left px-3 py-2 rounded text-xs transition-all ${!params.category ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300 border border-transparent'}`}
                >
                  All Categories
                </Link>
                {categories.map((cat) => (
                  <Link
                    replace
                    key={cat}
                    href={`/courses?${new URLSearchParams({ category: cat, ...(params.level ? { level: params.level } : {}), ...(params.search ? { search: params.search } : {}) }).toString()}`}
                    className={`block w-full text-left px-3 py-2 rounded text-xs transition-all ${params.category === cat ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300 border border-transparent'}`}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Difficulty */}
          <div>
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white mb-4">
              <SlidersHorizontal size={13} className="text-teal-400" /> Difficulty
            </h3>
            <div className="space-y-1">
              {['', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <Link
                  replace
                  key={lvl || 'all'}
                  href={`/courses?${new URLSearchParams({ ...(lvl ? { level: lvl } : {}), ...(params.category ? { category: params.category } : {}), ...(params.search ? { search: params.search } : {}) }).toString()}`}
                  className={`block w-full text-left px-3 py-2 rounded text-xs transition-all ${params.level === lvl || (!lvl && !params.level) ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300 border border-transparent'}`}
                >
                  {lvl || 'All Skill Levels'}
                </Link>
              ))}
            </div>
          </div>
        </form>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-1">Course Explorer</h1>
              <p className="text-sm text-slate-400">
                Browse our catalogue of professional and technical courses.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[11px] font-bold text-teal-400 uppercase tracking-widest">{totalCount} Courses</span>
            </div>
          </div>

          {/* Tabs (enrolled / all) */}
          {session?.user && (
            <div className="flex gap-1 mb-8 border-b border-white/[0.06] pb-0">
              {[{ key: 'all', label: 'All Courses' }, { key: 'enrolled', label: 'My Courses' }].map(({ key, label }) => (
                <Link
                  key={key}
                  href={`/courses?tab=${key}`}
                  className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest border-b-2 transition-colors ${
                    activeTab === key
                      ? 'text-teal-400 border-teal-400'
                      : 'text-slate-500 border-transparent hover:text-slate-300'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Course Grid */}
          {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <BookOpen className="text-slate-700 mb-4" size={48} />
              <p className="text-slate-400 font-semibold">No courses found</p>
              <p className="text-slate-600 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {courses.map((course, idx) => {
                const isEnrolled = course.enrollments && course.enrollments.length > 0;
                const ctaLabel   = isEnrolled ? 'Continue Learning' : (course.price > 0 ? formatPrice(course.discountPrice ?? course.price) : 'Enroll Now');

                return (
                  <CourseCard
                    key={course.id}
                    href={isEnrolled ? `/dashboard/course/${course.slug}` : `/courses/${course.slug}`}
                    gradient={CARD_GRADIENTS[idx % CARD_GRADIENTS.length]}
                    levelColor={LEVEL_COLORS[course.level] ?? LEVEL_COLORS.Beginner}
                    level={course.level}
                    durationHours={course.durationHours}
                    isEnrolled={!!isEnrolled}
                    title={course.title}
                    shortDescription={course.shortDescription}
                    instructorName={course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : null}
                    location={course.location}
                    ctaLabel={ctaLabel}
                  />
                );
              })}
            </div>
          )}

          {/* Enquiry section */}
          <section className="mt-16 rounded-2xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm p-8 md:p-12">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Can&apos;t Find What You&apos;re Looking For?</h2>
                <p className="text-slate-400 leading-relaxed">
                  We offer custom training programmes tailored to your team&apos;s needs.
                </p>
              </div>
              <CourseEnquiryForm />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
