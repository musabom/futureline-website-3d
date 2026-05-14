import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import {
  ArrowRight, BookOpen, Clock, FlaskConical,
  Layers, Code2, Zap, MessageSquare, AlertTriangle,
} from 'lucide-react';
import ShaderBackground from '@/components/ui/shader-background';
import DivisionsBackground from '@/components/ui/divisions-background-loader';
import DivisionCard from '@/components/ui/division-card';
import ParallaxLayer from '@/components/ui/parallax-layer';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'FutureLine — Systems Built for Scale | Digital Transformation & Custom Software',
  description:
    'FutureLine builds the digital systems your business needs to scale: digitalisation, custom software, intelligent automations, and expert consultation. No jargon. No lock-in. Just results.',
  openGraph: {
    title: 'FutureLine — Systems Built for Scale',
    description:
      'FutureLine builds the digital systems your business needs to scale: digitalisation, custom software, intelligent automations, and expert consultation.',
    type: 'website',
    url: '/',
  },
};

const CORE_SERVICES = [
  {
    title: 'Digitalisation',
    href: '/services/digitalisation',
    pain: 'Disconnected tools eating your team alive?',
    description:
      'Replace paper trails and siloed spreadsheets with unified digital systems. One source of truth. Zero manual reconciliation.',
    textClass:   'text-teal-400',
    borderClass: 'border-teal-500/20',
    bgClass:     'bg-teal-500/10',
    hoverClass:  'hover:border-teal-500/30 hover:shadow-teal-500/[0.08]',
    Icon: Layers,
  },
  {
    title: 'Custom Software',
    href: '/services/custom-software',
    pain: 'Paying for software that only half-fits?',
    description:
      'Purpose-built platforms that do exactly what your business needs — no bloat, no recurring licence fees, no workarounds.',
    textClass:   'text-blue-400',
    borderClass: 'border-blue-500/20',
    bgClass:     'bg-blue-500/10',
    hoverClass:  'hover:border-blue-500/30 hover:shadow-blue-500/[0.08]',
    Icon: Code2,
  },
  {
    title: 'Automations',
    href: '/services/automations',
    pain: 'Wasting 11+ hours a week on repetitive tasks?',
    description:
      'AI-powered workflows that eliminate manual work, cut errors, and free your team to focus on what actually grows the business.',
    textClass:   'text-purple-400',
    borderClass: 'border-purple-500/20',
    bgClass:     'bg-purple-500/10',
    hoverClass:  'hover:border-purple-500/30 hover:shadow-purple-500/[0.08]',
    Icon: Zap,
  },
  {
    title: 'Consultation',
    href: '/services/consultation',
    pain: "Not sure where to start?",
    description:
      'A plain-English audit of your current systems — what is slowing you down, what to fix first, and a roadmap that makes sense.',
    textClass:   'text-amber-400',
    borderClass: 'border-amber-500/20',
    bgClass:     'bg-amber-500/10',
    hoverClass:  'hover:border-amber-500/30 hover:shadow-amber-500/[0.08]',
    Icon: MessageSquare,
  },
];

const STATS = [
  { value: '5 Weeks',  label: 'Avg. delivery time' },
  { value: '11 hrs',   label: 'Saved per client, per week' },
  { value: '$0',       label: 'Recurring licence fees' },
  { value: '$47k',     label: 'Average cost of getting it wrong' },
];

export default async function HomePage() {
  const featuredCourses = await prisma.course.findMany({
    where: { status: 'PUBLISHED', approvalStatus: 'APPROVED' },
    include: { instructor: { select: { firstName: true, lastName: true } } },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-surface text-on-surface">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background moves at 60% scroll speed */}
        <ParallaxLayer speed={0.6} className="absolute -top-32 left-0 right-0 bottom-0">
          <ShaderBackground className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 bg-surface/40 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[#0b1a39] pointer-events-none" />
        </ParallaxLayer>

        {/* Text layer */}
        <ParallaxLayer speed={-0.15} className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 pb-10 md:pb-14 flex flex-col items-center text-center">

            {/* Pain-stat badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 mb-6">
              <AlertTriangle size={11} className="text-red-400" />
              <span className="text-xs font-semibold text-red-300 tracking-wide">
                47% of digital transformation projects fail. Yours won&apos;t.
              </span>
            </div>

            {/* Headline — block spans force two clean lines at every viewport width */}
            <h1 className="text-5xl md:text-[68px] font-black leading-[1.1] tracking-tight mb-5 text-white max-w-4xl">
              <span className="block">Your Business Is Scaling.</span>
              <span className="block bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                Your Systems Aren&apos;t.
              </span>
            </h1>

            {/* Subheadline — immediate, no delay */}
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              We build the digital infrastructure that lets you grow without breaking things —
              custom software, intelligent automations, and full digitalisation.
              Done in weeks, not years.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/services/consultation"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold text-base hover:shadow-xl hover:shadow-teal-500/20 hover:scale-[1.02] transition-all duration-300"
              >
                Get a Free Systems Audit <ArrowRight size={18} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-white/20 text-white font-semibold text-base hover:bg-white/[0.05] transition-all duration-300"
              >
                See Our Services
              </Link>
            </div>

            {/* Academy prompt */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px w-8 bg-white/10" />
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-sm text-slate-400 hover:border-teal-500/30 hover:text-slate-200 hover:bg-white/[0.06] transition-all duration-200"
              >
                <BookOpen size={13} className="text-teal-400" />
                <span>Want to upskill? <span className="text-teal-400 font-semibold">Explore FL Academy</span> — AI, systems & tech courses</span>
                <ArrowRight size={12} className="text-slate-500" />
              </Link>
              <div className="h-px w-8 bg-white/10" />
            </div>

          </div>
        </ParallaxLayer>
      </section>

      {/* ── FL Lab Services ── */}
      <section className="py-24 bg-[#030d1a] border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-[#18a999]" />
                <span className="text-sm font-semibold text-[#18a999] tracking-widest uppercase flex items-center gap-2">
                  <FlaskConical size={13} /> FL Lab
                </span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight">What We Fix</h2>
              <p className="text-slate-400 text-sm mt-2">Four problems. Four solutions. Real results in weeks.</p>
            </div>
            <Link
              href="/services"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#18a999]/30 text-[#18a999] text-sm font-bold hover:bg-[#18a999]/10 transition-colors uppercase tracking-widest"
            >
              All Services <ArrowRight size={14} />
            </Link>
          </div>

          {/* Service cards — 2-col grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CORE_SERVICES.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className={`group rounded-xl border ${service.borderClass} bg-slate-950/40 backdrop-blur-sm ${service.hoverClass} hover:shadow-xl transition-all duration-300 p-6 flex flex-col`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg ${service.bgClass} border ${service.borderClass} flex items-center justify-center mb-4`}>
                  <service.Icon size={18} className={service.textClass} />
                </div>

                {/* Pain hook */}
                <span className={`text-[11px] font-bold uppercase tracking-widest ${service.textClass} mb-1.5`}>
                  {service.pain}
                </span>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-teal-300 transition-colors leading-snug">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed flex-1">
                  {service.description}
                </p>

                <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className={`text-xs font-bold ${service.textClass}`}>Learn more</span>
                  <ArrowRight size={14} className={`${service.textClass} group-hover:translate-x-1 transition-transform`} />
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile view all */}
          <div className="mt-8 text-center sm:hidden">
            <Link href="/services" className="inline-flex items-center gap-2 text-[#18a999] text-sm font-bold">
              View All Services <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>

      {/* ── Our Divisions ── */}
      <section id="divisions" className="relative pt-10 pb-20 bg-surface-container-low overflow-hidden">
        <DivisionsBackground />
        <div className="absolute inset-0 bg-surface-container-low/70 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0b1a39] to-transparent pointer-events-none z-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2
              className="text-4xl font-black tracking-tight"
              style={{
                background: 'linear-gradient(to right, #2dd4bf, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Our Divisions
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DivisionCard variant="lab"     direction="left"  />
            <DivisionCard variant="academy" direction="right" />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-surface-container-low border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-white/[0.08]">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center lg:px-8">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-primary-container" />
                <span className="text-sm font-semibold text-primary tracking-widest uppercase">Featured Courses</span>
              </div>
              <h2 className="text-4xl font-bold text-white tracking-tight">Start Learning Today</h2>
            </div>
            <Link
              href="/courses"
              className="hidden sm:flex items-center gap-2 text-primary text-sm font-semibold hover:gap-3 transition-all duration-300"
            >
              View All Courses <ArrowRight size={16} />
            </Link>
          </div>

          {featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <Link
                  href={`/courses/${course.slug}`}
                  key={course.id}
                  className="group rounded-2xl overflow-hidden border border-white/[0.07] bg-surface-container hover:border-primary-container/30 hover:shadow-xl hover:shadow-primary-container/[0.08] transition-all duration-500"
                >
                  <div className="h-44 bg-gradient-to-br from-navy-light to-primary-container flex items-center justify-center relative overflow-hidden">
                    <BookOpen className="text-white/25" size={56} />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container/70 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-primary-container/10 text-primary rounded-full border border-primary-container/20">
                        {course.deliveryType.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">{course.level}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-on-surface-variant mb-4 line-clamp-2 leading-relaxed">
                      {course.shortDescription}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">
                          {formatPrice(course.discountPrice ?? course.price)}
                        </span>
                        {course.discountPrice && (
                          <span className="text-xs text-slate-600 line-through">
                            {formatPrice(course.price)}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-on-surface-variant flex items-center gap-1">
                        <Clock size={12} /> {course.durationHours}h
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-2xl border border-white/[0.07] bg-surface-container">
              <BookOpen className="mx-auto mb-4 text-primary/30" size={48} />
              <p className="text-on-surface-variant">Courses coming soon. Check back shortly.</p>
            </div>
          )}

          <div className="sm:hidden text-center mt-8">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-navy-light to-primary-container text-white font-semibold"
            >
              View All Courses <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 bg-[#030d1a] relative overflow-hidden border-t border-white/[0.06]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-teal-500/[0.05] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span className="text-xs font-semibold text-teal-300 tracking-widest uppercase">Don&apos;t Wait</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            The Longer You Wait,{' '}
            <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              The More It Costs.
            </span>
          </h2>

          <div className="space-y-2 mb-10 max-w-2xl mx-auto">
            <p className="text-base text-slate-400 leading-relaxed">
              Every week of manual processes is hours your team can&apos;t get back.
            </p>
            <p className="text-base text-slate-400 leading-relaxed">
              Every failed project costs an average of $47,000.
            </p>
            <p className="text-base text-slate-200 leading-relaxed font-semibold">
              Every delay is a window for your competitors to gain ground.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services/consultation"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold text-base hover:shadow-xl hover:shadow-teal-500/20 hover:scale-[1.02] transition-all duration-300"
            >
              Start with a Free Audit <ArrowRight size={18} />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-white/20 text-white font-semibold text-base hover:bg-white/[0.05] transition-all duration-300"
            >
              Browse Our Services
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
