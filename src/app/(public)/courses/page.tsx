import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Search, ArrowRight, Clock, Check, X, Layers } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import CourseEnquiryForm from '@/components/CourseEnquiryForm';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { FadeUp } from '@/components/motion/FadeUp';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'FL Academy — Courses | FutureLine',
  description:
    'AI, cybersecurity, cloud, data — taught by practitioners. Online, in-person, and hybrid courses built so you actually finish.',
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

// Why-this-works stats — 4 quick differentiators between hero and catalog.
// Each one is a single concept, not a claim that needs a citation.
const WHY_STATS = [
  {
    value: '4%',
    label: 'Online course completion',
    sub: 'Industry average for free online courses. Most people don’t get past week 2 — we built around that.',
  },
  {
    value: 'Cohort',
    label: 'Format',
    sub: 'Small cohorts, fixed start dates, weekly live sessions. Peer pressure + instructor presence = you finish.',
  },
  {
    value: 'Practitioners',
    label: 'Who teaches',
    sub: 'People shipping the systems they teach — not career instructors with one project from a decade ago.',
  },
  {
    value: 'Lifetime',
    label: 'Materials access',
    sub: 'Course materials yours forever, including future updates. Re-attend any cohort free if a topic shifts.',
  },
];

// How a track runs — 4 process steps. Mirrors the service-page pattern
// with explicit outputs per phase.
const PROCESS_STEPS = [
  {
    when: 'Week 1',
    title: 'Foundations & framing',
    body:
      'Get your tools set up, complete a first hands-on milestone, meet the cohort. Output: working setup + first checkpoint reviewed by the instructor.',
  },
  {
    when: 'Weeks 2–3',
    title: 'Hands-on labs',
    body:
      'Build 3–4 small projects, each unlocking a real-world skill. Live sessions twice a week, async labs in between. Output: portfolio-ready code, peer-reviewed.',
  },
  {
    when: 'Week 4',
    title: 'Capstone',
    body:
      'One bigger project tied to your own work where possible. Instructor reviews. Real critique, not a participation badge. Output: portfolio-grade project + written feedback.',
  },
  {
    when: 'Post-course',
    title: 'Materials & community',
    body:
      'Lifetime access to course materials. Alumni Slack. Monthly office hours with practitioner instructors. Output: a network of people building with the same skills.',
  },
];

// 3-way decision matrix — Self-taught / Generic bootcamp / FL Academy.
// Addresses the "why pay when YouTube exists?" objection.
const VS_ROWS = [
  {
    label: 'Cost shape',
    yt: 'Free — but your time isn’t. Months of stop-start learning.',
    bootcamp: '$10k–$20k for 12–26 weeks of full-time commitment.',
    fl: 'Per-course pricing. Team training scales with seats — no per-seat tax.',
  },
  {
    label: 'Time to first result',
    yt: 'Days to start. Months to finish. If you finish.',
    bootcamp: '12+ weeks of full-time commitment.',
    fl: 'Week 1 — working setup + first checkpoint reviewed.',
  },
  {
    label: 'Instructor access',
    yt: 'Zero. You’re alone with the comment section.',
    bootcamp: 'Junior teaching assistants reading from a scripted curriculum.',
    fl: 'Live sessions with practitioners shipping the systems they teach.',
  },
  {
    label: 'Completion rate',
    yt: '~4% industry average for self-paced.',
    bootcamp: 'Better — peer pressure helps. But high drop-out in week 4–6.',
    fl: 'Cohort-paced, weekly live, designed end-to-end for people who finish.',
  },
  {
    label: 'What you leave with',
    yt: 'Notes. Maybe.',
    bootcamp: 'A generic capstone everyone in your cohort built.',
    fl: 'A portfolio-grade project tied to your own work + instructor feedback.',
  },
];

// FAQ items including the soft pricing band (the unspoken "what does this
// actually cost?" buyers self-disqualify on).
const FAQS = [
  {
    q: 'How much does a course cost?',
    a: 'Public courses run between $250–$1,200 per cohort depending on length and depth (OMR 100–500 in local pricing). Team training scales differently — a fixed price for 5+ seats with no per-seat tax. Discounts available for non-profits and the education sector. Exact price is listed on each course’s card in the catalog above.',
  },
  {
    q: 'How much time per week do I need?',
    a: 'Plan for 4–6 hours per week: 2 hours of live session + 2–4 hours of hands-on labs and reading. Live cohorts run weekday evenings UTC+4 (Oman) and are recorded. We’d rather you finish at week 6 than not at all — flexibility is built in.',
  },
  {
    q: 'What if I miss a session or fall behind?',
    a: 'Every live session is recorded and posted within a few hours. Slack channel with the instructor + your cohort. If you fall a week behind, the instructor will help you catch up — or roll you into the next cohort at no extra cost.',
  },
  {
    q: 'Do I get a certificate?',
    a: 'Yes — and a portfolio piece (the capstone), which is the more useful of the two. The certificate is FutureLine-issued and verifiable. The portfolio is what gets you hired or promoted.',
  },
  {
    q: 'What if it’s not for me?',
    a: 'Full refund within the first week of the cohort — no questions, no awkward call. After week 1, we offer pro-rata refunds if you stop attending. We’d rather lose the booking than have you stuck.',
  },
  {
    q: 'Are there prerequisites?',
    a: 'Listed per course. Most beginner tracks have none beyond "comfortable using a laptop." Intermediate and advanced tracks call out 1–2 specific prereqs (e.g., basic Python, basic SQL) up front — no surprise gates.',
  },
];

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

  // Base filter: published + approved + NOT the placeholder "Test"
  // course. (The Test course was leaking to production — defensive
  // filter here even if a future deploy fixes the DB status.)
  const baseFilter = {
    status: 'PUBLISHED' as const,
    approvalStatus: 'APPROVED' as const,
    NOT: { title: { equals: 'Test', mode: 'insensitive' as const } },
  };

  const where: any = { ...baseFilter };

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

  // Catalog appears above the marketing copy. We intentionally don't expose
  // a total course count anywhere — this is a CMS-driven catalog where
  // courses come and go, so the count is meaningless as marketing surface.
  const [courses, categoryRows] = await Promise.all([
    prisma.course.findMany({
      where,
      include: {
        instructor: { select: { firstName: true, lastName: true } },
        enrollments: session?.user?.id ? { where: { userId: session.user.id } } : false,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.course.findMany({
      where: baseFilter,
      select: { category: true },
      distinct: ['category'],
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

  // No PageScrollSpy on this page — its left-edge label overlaps the
  // catalog header content on narrower viewports. The page is content-
  // led (cards first, marketing sections second), users scroll naturally.

  return (
    <main className="bg-brand-bg">
      {/* ── Catalog (page top — compact header + cards) ──
          Replaced the giant 3D hero with a tight inline header so the
          first row of course cards is visible above the fold on any
          laptop viewport. The marketing copy (Why / Process / Compare /
          FAQ) lives below the cards for buyers who scroll. */}
      <section
        id="catalog"
        className="scroll-mt-24 px-4 pt-8 pb-16 sm:px-6 md:pt-12 md:pb-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          {/* Page header — eyebrow + Title Case H1 + single-line subhead. */}
          <div className="mb-8 max-w-4xl md:mb-10">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.4em] text-academy">
              <span
                aria-hidden
                className="block h-1.5 w-1.5 rounded-full bg-academy shadow-[0_0_10px_2px_rgba(91,123,251,0.55)]"
              />
              FL · Academy
            </p>
            <h1 className="mt-3 text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] text-white sm:text-4xl md:text-[2.75rem]">
              We Teach What We Practice.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
              AI, cybersecurity, cloud, and data — built so you actually finish.
            </p>
          </div>

          {/* Filters (left sticky rail) + cards (right) ──────────────
              Moved filters into a dedicated 240px sidebar on lg+ so the
              cards grid sits at the top of its column with no preamble.
              On smaller viewports the grid collapses to one column and
              the filters stack above the cards. */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">

            <aside
              aria-label="Course filters"
              className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2"
            >
              <div className="flex flex-col gap-6">
                {/* Search */}
                <form method="GET" action="/courses" className="w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                    <input
                      name="search"
                      defaultValue={params.search}
                      placeholder="Search courses…"
                      className="fl-input w-full !py-2 !pl-9 !text-xs"
                    />
                  </div>
                  {params.level && <input type="hidden" name="level" value={params.level} />}
                  {params.category && <input type="hidden" name="category" value={params.category} />}
                  {params.type && <input type="hidden" name="type" value={params.type} />}
                </form>

                {/* Level */}
                <div className="flex flex-col gap-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Level</span>
                  <div className="flex flex-wrap gap-2">
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
                </div>

                {/* Category */}
                {categories.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Category</span>
                    <div className="flex flex-wrap gap-2">
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
                  </div>
                )}

                {/* Delivery */}
                <div className="flex flex-col gap-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Delivery</span>
                  <div className="flex flex-wrap gap-2">
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
                </div>

                {/* Auth-gated tabs */}
                {session?.user && (
                  <div className="flex flex-col gap-2.5 border-t border-white/[0.06] pt-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">View</span>
                    <div className="flex flex-col gap-1">
                      {[
                        { key: 'all', label: 'All courses' },
                        { key: 'enrolled', label: 'My courses' },
                      ].map(({ key, label }) => (
                        <Link
                          key={key}
                          href={`/courses?tab=${key}`}
                          className={`py-1 text-sm transition-colors ${
                            activeTab === key
                              ? 'text-academy'
                              : 'text-white/55 hover:text-white'
                          }`}
                          data-cursor="hover"
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Cards column */}
            <div>
              {courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">No courses found</p>
                  <p className="mt-3 text-sm text-white/55">Try adjusting your filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((course, i) => {
                const isEnrolled = course.enrollments && course.enrollments.length > 0;
                const href = isEnrolled ? `/dashboard/course/${course.slug}` : `/courses/${course.slug}`;
                const priceLabel =
                  isEnrolled ? 'Continue →' : course.price > 0 ? formatPrice(course.discountPrice ?? course.price) : 'Free';
                const num = String(i + 1).padStart(2, '0');
                const instructorName = course.instructor
                  ? `${course.instructor.firstName ?? ''} ${course.instructor.lastName ?? ''}`.trim()
                  : '';

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
                    <p className="mt-4 text-sm leading-relaxed text-white/55 line-clamp-3">
                      {course.shortDescription}
                    </p>
                    {/* Instructor strip — shows "Taught by [name]" when an
                        instructor is attached. Backs the hero's "We teach what
                        we practice." claim with a concrete name per course. */}
                    {instructorName && (
                      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
                        Taught by <span className="text-academy/90">{instructorName}</span>
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4">
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
          </div>
        </div>
      </section>

      {/* ── Why this works (4 stats) ── */}
      <section
        id="why-this-works"
        className="scroll-mt-24 border-t border-white/[0.06] px-4 py-16 sm:px-6 md:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl md:mb-12">
            <SectionEyebrow accent="academy">Why this works</SectionEyebrow>
            <AnimatedText
              as="h2"
              variant="chars"
              className="text-4xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(2.5rem,5vw,4.5rem)]"
            >
              Built around the people who finish.
            </AnimatedText>
            <AnimatedText
              as="p"
              variant="words"
              className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg"
              delay={0.15}
            >
              Most online courses optimise for sign-up. We optimise for finish.
            </AnimatedText>
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {WHY_STATS.map((s, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="border-t border-white/[0.12] pt-6">
                  <p className="text-5xl font-semibold tracking-tight text-white md:text-6xl">
                    {s.value}
                  </p>
                  <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-academy/90">
                    {s.label}
                  </p>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">{s.sub}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── How a track runs (process) ── */}
      <section
        id="how-a-track-runs"
        className="scroll-mt-24 border-t border-white/[0.06] px-4 py-16 sm:px-6 md:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl md:mb-12">
            <SectionEyebrow accent="academy">How a track runs</SectionEyebrow>
            <AnimatedText
              as="h2"
              variant="chars"
              className="max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(2.5rem,5vw,4.5rem)]"
            >
              4 weeks. One outcome.
            </AnimatedText>
            <AnimatedText
              as="p"
              variant="words"
              className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg"
              delay={0.15}
            >
              The default shape. Some tracks run longer; the rhythm is the same.
            </AnimatedText>
          </div>
          <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="border-t border-white/[0.12] py-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-academy">
                    {step.when}
                  </p>
                  <h3 className="mt-5 text-2xl font-semibold tracking-[-0.01em] text-white">
                    {String(i + 1).padStart(2, '0')} · {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/55">{step.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it compares (3-way decision matrix) ── */}
      <section
        id="how-it-compares"
        className="scroll-mt-24 border-t border-white/[0.06] px-4 py-16 sm:px-6 md:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl md:mb-12">
            <SectionEyebrow accent="academy">How it compares</SectionEyebrow>
            <AnimatedText
              as="h2"
              variant="chars"
              className="text-4xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(2.5rem,5vw,4.5rem)]"
            >
              YouTube, bootcamp, or us?
            </AnimatedText>
            <AnimatedText
              as="p"
              variant="words"
              className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg"
              delay={0.15}
            >
              Three honest paths. We&apos;ll tell you when YouTube is genuinely the right call — it sometimes is.
            </AnimatedText>
          </div>

          <div className="overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.015]">
            <div className="sticky top-0 z-10 grid grid-cols-12 gap-3 border-b border-white/[0.12] bg-black/90 px-5 py-5 backdrop-blur-md md:px-8 md:py-6">
              <div className="col-span-12 md:col-span-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">Category</p>
              </div>
              <div className="col-span-4 md:col-span-3">
                <p className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white/70 md:text-base">
                  <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-white/30" />
                  YouTube / blogs
                </p>
              </div>
              <div className="col-span-4 md:col-span-3">
                <p className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white/70 md:text-base">
                  <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-white/30" />
                  Generic bootcamp
                </p>
              </div>
              <div className="col-span-4 md:col-span-3">
                <p
                  className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white md:text-base"
                  style={{ textShadow: '0 0 8px rgba(91,123,251,0.4)' }}
                >
                  <span
                    aria-hidden
                    className="inline-block h-2 w-2 rounded-full bg-academy"
                    style={{ boxShadow: '0 0 8px rgba(91, 123, 251, 0.65)' }}
                  />
                  FL Academy
                </p>
              </div>
            </div>
            {VS_ROWS.map((row, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <div className="grid grid-cols-12 items-start gap-3 border-b border-white/[0.06] px-5 py-6 last:border-b-0 md:gap-4 md:px-8 md:py-7">
                  <div className="col-span-12 md:col-span-3">
                    <div className="flex items-baseline gap-3">
                      <span aria-hidden className="font-mono text-[11px] tracking-[0.25em] text-academy/70">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h4 className="text-base font-semibold tracking-tight text-white md:text-lg">{row.label}</h4>
                    </div>
                  </div>
                  <div className="col-span-4 md:col-span-3">
                    <p className="text-sm leading-relaxed text-white/55 md:text-base">{row.yt}</p>
                  </div>
                  <div className="col-span-4 md:col-span-3">
                    <p className="text-sm leading-relaxed text-white/55 md:text-base">{row.bootcamp}</p>
                  </div>
                  <div className="relative col-span-4 md:col-span-3">
                    <span
                      aria-hidden
                      className="absolute -left-3 top-1 hidden h-[calc(100%-0.5rem)] w-px bg-gradient-to-b from-academy/40 via-academy/15 to-transparent md:block"
                    />
                    <p className="text-sm font-medium leading-relaxed text-white md:text-base">{row.fl}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── For teams — custom training band ── */}
      <section
        id="for-teams"
        className="scroll-mt-24 border-t border-white/[0.06] px-4 py-16 sm:px-6 md:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <SectionEyebrow accent="academy">For teams</SectionEyebrow>
              <AnimatedText
                as="h2"
                variant="chars"
                className="text-4xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(2.5rem,5vw,4.5rem)]"
              >
                Train the team. Skip the per-seat tax.
              </AnimatedText>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/60 md:text-lg">
                For 5+ team members. We design the training around the work your team actually does — and price it like training, not a per-seat licence.
              </p>
            </div>
            <ul className="md:col-span-7">
              {[
                'Custom syllabus designed around your team’s actual work and tools',
                'On-site (Oman / GCC), remote (any timezone), or hybrid',
                'Single invoice — no per-seat tax that punishes hiring',
                'Capstone projects tied to your own actual systems',
                'Manager debriefs after the cohort — what your team learned, what to deploy next',
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-4 border-t border-white/[0.08] py-5 text-base text-white/80 md:text-lg"
                >
                  <span aria-hidden className="font-mono text-xs tracking-[0.3em] text-academy">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        id="faq"
        className="scroll-mt-24 border-t border-white/[0.06] px-4 py-16 sm:px-6 md:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 md:mb-12">
            <SectionEyebrow accent="academy">FAQ</SectionEyebrow>
            <AnimatedText
              as="h2"
              variant="chars"
              className="text-4xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(2.5rem,5vw,4rem)]"
            >
              Things people ask.
            </AnimatedText>
          </div>
          <div className="mt-10">
            {FAQS.map((f, i) => (
              <details
                key={i}
                className="group border-t border-white/[0.08]"
              >
                <summary
                  className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left"
                  data-cursor="hover"
                >
                  <span className="text-base font-medium leading-snug text-white md:text-lg">{f.q}</span>
                  <span
                    aria-hidden
                    className="mt-1 flex-shrink-0 font-mono text-xs text-white/45 transition-colors group-hover:text-academy group-open:rotate-45"
                    style={{ transition: 'transform 220ms ease, color 220ms ease' }}
                  >
                    +
                  </span>
                </summary>
                <p className="pb-6 pr-8 text-sm leading-relaxed text-white/65 md:text-base">{f.a}</p>
              </details>
            ))}
            <div className="border-t border-white/[0.08]" />
          </div>
        </div>
      </section>

      {/* ── Enquiry ── */}
      <section
        id="enquiry"
        className="scroll-mt-24 border-t border-white/[0.06] px-4 py-20 sm:px-6 md:py-28 lg:px-8"
      >
        <div className="mx-auto max-w-2xl">
          <FadeUp>
            <div className="mb-12 text-center">
              <SectionEyebrow accent="academy">Get in touch</SectionEyebrow>
              <h2 className="text-4xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(2.5rem,5vw,4rem)]">
                Can&apos;t find what you need?
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/60">
                A different schedule, a different topic, or training that doesn&apos;t fit a public cohort — tell us what you&apos;re working toward and we&apos;ll come back within a business day.
              </p>
            </div>
          </FadeUp>
          <CourseEnquiryForm />
        </div>
      </section>
    </main>
  );
}
