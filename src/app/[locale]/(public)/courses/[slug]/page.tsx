import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  MapPin,
  Users,
  Calendar,
  BookOpen,
  CheckCircle,
  ChevronLeft,
} from 'lucide-react';
import EnrollButton from '@/components/EnrollButton';
import { formatPrice } from '@/lib/utils';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { BrandedHeading } from '@/components/ui/BrandedHeading';
import { FadeUp } from '@/components/motion/FadeUp';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
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

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: { select: { firstName: true, lastName: true, email: true } },
      _count: { select: { enrollments: true, lessons: true } },
    },
  });

  if (!course || course.status !== 'PUBLISHED') return notFound();

  const priceLabel = course.price > 0 ? formatPrice(course.discountPrice ?? course.price) : 'Free';

  return (
    <main className="fl-dark-surface bg-brand-bg">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-academy-glow opacity-60"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-8">
          <Link
            href="/courses"
            data-cursor="hover"
            className="mb-10 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.3em] text-white/45 transition-colors hover:text-academy"
          >
            <ChevronLeft size={13} /> Course catalog
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="rounded-full border border-academy/30 bg-academy/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-academy">
              {course.level}
            </span>
            {course.category && (
              <span className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/65">
                {course.category}
              </span>
            )}
            <span className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/65">
              {course.deliveryType.replace('_', ' ')}
            </span>
          </div>

          <BrandedHeading as="h1" size="xl">
            {course.title}
          </BrandedHeading>

          <AnimatedText
            as="p"
            variant="words"
            className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65 md:text-xl"
            delay={0.15}
          >
            {course.shortDescription || `Learn ${course.title} with FutureLine.`}
          </AnimatedText>

          <FadeUp delay={0.3}>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/55">
              <span className="flex items-center gap-2">
                <Clock size={13} /> {course.durationHours}h of content
              </span>
              {course.instructor && (
                <span className="flex items-center gap-2">
                  <Users size={13} /> {course.instructor.firstName} {course.instructor.lastName}
                </span>
              )}
              {course.location && (
                <span className="flex items-center gap-2">
                  <MapPin size={13} /> {course.location}
                </span>
              )}
              {course.startDate && (
                <span className="flex items-center gap-2">
                  <Calendar size={13} />
                  {new Date(course.startDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  {course.endDate &&
                    ` – ${new Date(course.endDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}`}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Users size={13} /> {course._count.enrollments} enrolled
              </span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Body ── */}
      <section className="px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
            {/* ── Left: course content ── */}
            <div className="space-y-16 lg:col-span-2">
              {course.marketingVideoUrl && (
                <FadeUp>
                  <div>
                    <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-academy">
                      Preview
                    </p>
                    <div className="aspect-video overflow-hidden rounded-md border border-white/[0.08] bg-black">
                      <iframe
                        src={
                          course.marketingVideoUrl.includes('youtube.com') ||
                          course.marketingVideoUrl.includes('youtu.be')
                            ? `https://www.youtube.com/embed/${
                                new URL(course.marketingVideoUrl).searchParams.get('v') ||
                                course.marketingVideoUrl.split('/').pop()
                              }`
                            : course.marketingVideoUrl.includes('vimeo.com')
                            ? `https://player.vimeo.com/video/${
                                course.marketingVideoUrl.match(/\d+/)?.[0]
                              }`
                            : course.marketingVideoUrl
                        }
                        title="Course preview"
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </FadeUp>
              )}

              {course.fullDescription && (
                <FadeUp>
                  <div>
                    <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-academy">
                      About this course
                    </p>
                    <BrandedHeading as="h2" size="md">
                      What you&apos;ll learn.
                    </BrandedHeading>
                    <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-white/70 md:text-lg">
                      {course.fullDescription}
                    </p>
                  </div>
                </FadeUp>
              )}
            </div>

            {/* ── Right: enrolment card ── */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
                <div className="relative flex h-40 items-center justify-center border-b border-white/[0.06] bg-gradient-to-br from-academy/15 via-black to-black">
                  <BookOpen className="text-white/15" size={36} />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="rounded-full border border-academy/30 bg-academy/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-academy">
                      {course.level}
                    </span>
                    <span className="rounded-full border border-white/15 bg-black/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-white/75 backdrop-blur-md">
                      {course.durationHours}h
                    </span>
                  </div>
                </div>

                <div className="space-y-6 p-6">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
                      Price
                    </p>
                    <div className="mt-2 flex items-baseline gap-3">
                      <span className="text-4xl font-semibold tracking-tight text-white">
                        {priceLabel}
                      </span>
                      {course.discountPrice && course.discountPrice < course.price && (
                        <span className="text-sm text-white/35 line-through">
                          {formatPrice(course.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <EnrollButton
                    courseId={course.id}
                    slug={course.slug}
                    price={course.discountPrice ?? course.price}
                  />

                  <div className="space-y-2.5 border-t border-white/[0.06] pt-5 font-mono text-[11px] uppercase tracking-[0.25em] text-white/55">
                    <div className="flex items-center gap-2">
                      <Clock size={12} /> {course.durationHours} hours of content
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen size={12} /> {course._count.lessons} lessons
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={12} /> {course._count.enrollments} students enrolled
                    </div>
                    {course.seatCapacity && (
                      <div className="flex items-center gap-2 text-academy">
                        <CheckCircle size={12} />
                        {Math.max(0, course.seatCapacity - course._count.enrollments)} seats left
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
