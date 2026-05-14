import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, MapPin, Users, Calendar, BookOpen, CheckCircle, ChevronLeft, GraduationCap } from 'lucide-react';
import EnrollButton from '@/components/EnrollButton';
import { formatPrice } from '@/lib/utils';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const LEVEL_COLORS: Record<string, string> = {
  Beginner:     'bg-teal-500/20 border-teal-500/30 text-teal-400',
  Intermediate: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
  Advanced:     'bg-purple-500/20 border-purple-500/30 text-purple-400',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug },
    select: { title: true, shortDescription: true, slug: true },
  });
  if (!course) return { title: 'Course Not Found — FutureLine' };
  return {
    title: `${course.title} — FL Academy | FutureLine`,
    description: course.shortDescription || `Learn ${course.title} with FutureLine.`,
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

  const levelColor = LEVEL_COLORS[course.level] ?? LEVEL_COLORS.Beginner;
  const priceLabel = course.price > 0 ? formatPrice(course.discountPrice ?? course.price) : 'Free';

  return (
    <div className="min-h-screen bg-[#030d1a]">

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-900/40 via-slate-900 to-[#030d1a] border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#030d1a]/80 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Breadcrumb */}
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-400 transition-colors mb-6 uppercase tracking-widest font-bold"
          >
            <ChevronLeft size={13} /> Course Explorer
          </Link>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`px-2.5 py-0.5 rounded border text-[10px] font-bold uppercase tracking-widest ${levelColor}`}>
              {course.level}
            </span>
            {course.category && (
              <span className="px-2.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {course.category}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {course.deliveryType.replace('_', ' ')}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4 max-w-3xl">
            {course.title}
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-2xl mb-6">
            {course.shortDescription}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap gap-5 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><Clock size={13} /> {course.durationHours}h of content</span>
            {course.instructor && (
              <span className="flex items-center gap-1.5"><Users size={13} /> {course.instructor.firstName} {course.instructor.lastName}</span>
            )}
            {course.location && (
              <span className="flex items-center gap-1.5"><MapPin size={13} /> {course.location}</span>
            )}
            {course.startDate && (
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {new Date(course.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                {course.endDate && ` – ${new Date(course.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
              </span>
            )}
            <span className="flex items-center gap-1.5"><Users size={13} /> {course._count.enrollments} enrolled</span>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── Left: course content ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Preview video */}
            {course.marketingVideoUrl && (
              <section>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 rounded bg-teal-400 inline-block" /> Preview Video
                </h2>
                <div className="rounded-xl overflow-hidden border border-white/[0.07] bg-slate-950/40 aspect-video">
                  <iframe
                    src={
                      course.marketingVideoUrl.includes('youtube.com') || course.marketingVideoUrl.includes('youtu.be')
                        ? `https://www.youtube.com/embed/${new URL(course.marketingVideoUrl).searchParams.get('v') || course.marketingVideoUrl.split('/').pop()}`
                        : course.marketingVideoUrl.includes('vimeo.com')
                        ? `https://player.vimeo.com/video/${course.marketingVideoUrl.match(/\d+/)?.[0]}`
                        : course.marketingVideoUrl
                    }
                    title="Course Preview"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </section>
            )}

            {/* About */}
            {course.fullDescription && (
              <section>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 rounded bg-teal-400 inline-block" /> About This Course
                </h2>
                <div className="rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm p-6">
                  <p className="text-slate-400 leading-relaxed whitespace-pre-line text-sm">{course.fullDescription}</p>
                </div>
              </section>
            )}
          </div>

          {/* ── Right: enrolment card ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-white/[0.07] bg-slate-950/60 backdrop-blur-xl overflow-hidden">

              {/* Thumbnail */}
              <div className="h-44 relative bg-gradient-to-br from-teal-900/80 via-slate-900 to-slate-950 flex items-center justify-center">
                <GraduationCap className="text-white/10" size={52} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-widest backdrop-blur-md ${levelColor}`}>
                    {course.level}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-950/50 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest backdrop-blur-md">
                    {course.durationHours}h
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Price */}
                <div>
                  <span className="text-3xl font-black text-white">{priceLabel}</span>
                  {course.discountPrice && course.discountPrice < course.price && (
                    <span className="text-sm text-slate-500 line-through ml-2">{formatPrice(course.price)}</span>
                  )}
                </div>

                {/* Enroll */}
                <EnrollButton courseId={course.id} slug={course.slug} price={course.discountPrice ?? course.price} />

                {/* Stats */}
                <div className="pt-4 border-t border-white/[0.06] space-y-2.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2"><Clock size={13} /> {course.durationHours} hours of content</div>
                  <div className="flex items-center gap-2"><BookOpen size={13} /> {course._count.lessons} lessons</div>
                  <div className="flex items-center gap-2"><Users size={13} /> {course._count.enrollments} students enrolled</div>
                  {course.seatCapacity && (
                    <div className="flex items-center gap-2">
                      <CheckCircle size={13} className="text-teal-500" />
                      {Math.max(0, course.seatCapacity - course._count.enrollments)} seats remaining
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
