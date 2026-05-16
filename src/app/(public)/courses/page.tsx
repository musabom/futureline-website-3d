import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Search, ArrowRight, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import CourseEnquiryForm from '@/components/CourseEnquiryForm';
import HeroRibbon3D from '@/components/sections/HeroRibbon3DLazy';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { MarqueeStrip } from '@/components/ui/MarqueeStrip';
import { FadeUp } from '@/components/motion/FadeUp';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'FL Academy — Courses | FutureLine',
  description:
    'AI, cybersecurity, cloud, data — taught by operators. Online, in-person, and hybrid courses built to finish, not just enroll.',
  openGraph: {
    title: 'FL Academy — Courses',
    description: 'Professional and technical courses taught by practitioners.',
    type: 'website',
    url: '/courses',
  },
};

const PILL_CLASS =
  'rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] transition-colors';

function pillClass(active: boolean) {
  return active
    ? `${PILL_CLASS} border-academy/50 bg-academy/10 text-academy`
    : `${PILL_CLASS} border-white/[0.12] text-white/55 hover:border-white/30 hover:text-white`;
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{
    level?: string;
    category?: string;
    search?: string;
    tab?: string;
    type?: string;
  }>;
}) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;
  const activeTab = params.tab || 'all';

  const where: any = { status: 'PUBLISHED', approvalStatus: 'APPROVED' };

  if (activeTab === 'enrolled' && session?.user?.id) {
    where.enrollments = { some: { userId: session.user.id } };
  }
  if (params.level) where.level = params.level;
  if (params.category) where.category = params.category;
  if (params.type) where.deliveryType = params.type;
  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: 'insensitive' } },
      { shortDescription: { contains: params.search, mode: 'insensitive' } },
      { category: { contains: params.search, mode: 'insensitive' } },
    ];
  }

  const [courses, categoryRows, totalCount] = await Promise.all([
    prisma.course.findMany({
      where,
      include: {
        instructor: { select: { firstName: true, lastName: true } },
        enrollments: session?.user?.id ? { where: { userId: session.user.id } } : false,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.course.findMany({
      where: { status: 'PUBLISHED', approvalStatus: 'APPROVED' },
      select: { category: true },
      distinct: ['category'],
    }),
    prisma.course.count({
      where: { status: 'PUBLISHED', approvalStatus: 'APPROVED' },
    }),
  ]);

  const categories = categoryRows.map((r) => r.category).filter(Boolean) as string[];

  function buildHref(overrides: Record<string, string | undefined>) {
    const next: Record<string, string> = {};
    const fields = ['search', 'level', 'category', 'type', 'tab'] as const;
    for (const f of fields) {
      const ov = overrides[f];
      const cur = params[f];
      if (ov === undefined) {
        if (cur) next[f] = cur;
      } else if (ov !== '') {
        next[f] = ov;
      }
    }
    const qs = new URLSearchParams(next).toString();
    return `/courses${qs ? `?${qs}` : ''}`;
  }

  return (
    <main className="bg-brand-bg">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-y-0 right-0 z-0 w-full md:w-1/2">
          {/* Academy amber pole */}
          <HeroRibbon3D color="#F5A623" tilt={0.35} bloom={0.7} />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black via-black/85 to-transparent md:via-black/55"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-28 sm:px-6 md:py-40 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.4em] text-academy">
                <span
                  aria-hidden
                  className="block h-1.5 w-1.5 rounded-full bg-academy shadow-[0_0_10px_2px_rgba(245,166,35,0.55)]"
                />
                FL · Academy
              </p>
              <AnimatedText
                as="h1"
                variant="chars"
                className="text-5xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(3.5rem,8vw,7rem)]"
              >
                Taught by operators.
              </AnimatedText>
              <AnimatedText
                as="p"
                variant="words"
                className="mt-8 max-w-xl text-lg leading-relaxed text-white/65 md:text-xl"
                delay={0.2}
              >
                AI, cybersecurity, cloud, data. Practical courses taught by people who do the work — online, in-person, and hybrid. Built so you actually finish.
              </AnimatedText>
              <FadeUp delay={0.4}>
                <div className="mt-12 flex flex-wrap items-center gap-3">
                  <Link
                    href="#catalog"
                    data-cursor="magnetic"
                    data-cursor-strength="22"
                    className="rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90"
                  >
                    Browse {totalCount} courses
                  </Link>
                  <Link
                    href="#enquiry"
                    data-cursor="hover"
                    className="px-3 py-3 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    Request custom training →
                  </Link>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      <MarqueeStrip
        items={['AI', 'Cybersecurity', 'Cloud', 'Data', 'Web Development', 'Online · In-Person · Hybrid']}
        speed={32}
        accent="lab"
      />

      {/* ── Catalog ── */}
      <section id="catalog" className="px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Filters header */}
          <div className="mb-10 flex flex-col gap-6 md:mb-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <SectionEyebrow accent="academy" className="mb-3">Catalog</SectionEyebrow>
                <h2 className="text-3xl font-semibold tracking-[-0.01em] text-white md:text-4xl">
                  {courses.length} of {totalCount} courses
                </h2>
              </div>
              <form method="GET" action="/courses" className="flex w-full max-w-sm items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                  <input
                    name="search"
                    defaultValue={params.search}
                    placeholder="Search courses…"
                    className="fl-input !py-2.5 !pl-9 !text-xs"
                  />
                </div>
                {/* preserve other filters when searching */}
                {params.level && <input type="hidden" name="level" value={params.level} />}
                {params.category && <input type="hidden" name="category" value={params.category} />}
                {params.type && <input type="hidden" name="type" value={params.type} />}
              </form>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Level</span>
              <Link href={buildHref({ level: '' })} className={pillClass(!params.level)} data-cursor="hover">All</Link>
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <Link
                  key={lvl}
                  href={buildHref({ level: lvl })}
                  className={pillClass(params.level === lvl)}
                  data-cursor="hover"
                >
                  {lvl}
                </Link>
              ))}
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Category</span>
                <Link href={buildHref({ category: '' })} className={pillClass(!params.category)} data-cursor="hover">All</Link>
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={buildHref({ category: cat })}
                    className={pillClass(params.category === cat)}
                    data-cursor="hover"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Delivery</span>
              <Link href={buildHref({ type: '' })} className={pillClass(!params.type)} data-cursor="hover">All</Link>
              {[
                { v: 'ONLINE', label: 'Online' },
                { v: 'IN_PERSON', label: 'In-person' },
                { v: 'HYBRID', label: 'Hybrid' },
              ].map((d) => (
                <Link
                  key={d.v}
                  href={buildHref({ type: d.v })}
                  className={pillClass(params.type === d.v)}
                  data-cursor="hover"
                >
                  {d.label}
                </Link>
              ))}
            </div>

            {session?.user && (
              <div className="flex gap-4 border-b border-white/[0.06] pt-2">
                {[
                  { key: 'all', label: 'All courses' },
                  { key: 'enrolled', label: 'My courses' },
                ].map(({ key, label }) => (
                  <Link
                    key={key}
                    href={`/courses?tab=${key}`}
                    className={`pb-3 font-mono text-[11px] uppercase tracking-[0.3em] transition-colors ${
                      activeTab === key
                        ? 'border-b border-academy text-academy'
                        : 'border-b border-transparent text-white/45 hover:text-white'
                    }`}
                    data-cursor="hover"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Course grid */}
          {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">No courses found</p>
              <p className="mt-3 text-sm text-white/55">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, i) => {
                const isEnrolled = course.enrollments && course.enrollments.length > 0;
                const href = isEnrolled ? `/dashboard/course/${course.slug}` : `/courses/${course.slug}`;
                const priceLabel =
                  isEnrolled ? 'Continue →' : course.price > 0 ? formatPrice(course.discountPrice ?? course.price) : 'Free';
                const num = String(i + 1).padStart(2, '0');

                return (
                  <Link
                    key={course.id}
                    href={href}
                    data-cursor="hover"
                    className="group flex h-full flex-col overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-sm transition-colors duration-300 hover:border-academy/40 hover:bg-white/[0.04]"
                  >
                    <div className="mb-6 flex items-baseline justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-academy">{num}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                          {course.level}
                        </span>
                        <span className="rounded-full border border-academy/30 bg-academy/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-academy">
                          {course.deliveryType.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold leading-[1.15] tracking-[-0.01em] text-white transition-colors group-hover:text-academy-light">
                      {course.title}
                    </h3>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-white/55 line-clamp-3">
                      {course.shortDescription}
                    </p>
                    <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4">
                      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                        <Clock size={11} /> {course.durationHours}h
                      </span>
                      <span className="flex items-center gap-2 text-sm font-semibold text-white">
                        {priceLabel}
                        <ArrowRight size={13} className="text-white/30 transition-all group-hover:translate-x-1 group-hover:text-academy" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Enquiry ── */}
      <section id="enquiry" className="border-t border-white/[0.06] px-4 py-32 sm:px-6 md:py-44 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <FadeUp>
            <div className="mb-12 text-center">
              <SectionEyebrow accent="academy">Custom training</SectionEyebrow>
              <h2 className="text-4xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(2.5rem,5vw,4rem)]">
                Can&apos;t find what you need?
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/60">
                We design custom training programmes for teams. Tell us what you&apos;re building toward and we&apos;ll come back with a proposal.
              </p>
            </div>
          </FadeUp>
          <CourseEnquiryForm />
        </div>
      </section>
    </main>
  );
}
