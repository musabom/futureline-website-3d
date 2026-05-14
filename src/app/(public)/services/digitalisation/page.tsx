'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ArrowLeft, CheckCircle2,
  AlertTriangle, Clock, Eye, FileText, Users, MessageSquare,
  Workflow, Lock, Bell, BarChart3, Database, Bot,
  Target, Shield, Layers, Zap, ChevronDown,
  Factory, Building2, Landmark, GraduationCap, Briefcase,
  TrendingDown, TrendingUp,
} from 'lucide-react';
import { MorphicBackground } from '@/components/ui/morhic-background';
import { ServiceStickyNav } from '@/components/ui/ServiceStickyNav';

/* ─── Fade-in hook ───────────────────────────────────────────────────────── */
function useFadeIn(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Counter hook ───────────────────────────────────────────────────────── */
function useCountUp(target: number, active: boolean, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active || target === 0) return;
    let id: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round((1 - (1 - p) ** 3) * target));
      if (p < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [active, target, duration]);
  return val;
}

/* ─── Data ───────────────────────────────────────────────────────────────── */
const PAIN_CARDS = [
  {
    icon: Clock,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    headline: 'Wasted Hours',
    stat: '11 hrs / week',
    body: 'Manual data entry alone costs the average SME employee 11 hours per week — time your competitors are spending on growth.',
  },
  {
    icon: FileText,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    headline: 'Spreadsheet Risk',
    stat: '88% error rate',
    body: '88% of spreadsheets contain critical errors. Every one is an unaudited liability sitting in someone\'s inbox.',
  },
  {
    icon: Eye,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    headline: 'Zero Visibility',
    stat: 'Real-time: 0%',
    body: 'You can\'t manage what you can\'t see. Decisions are made on yesterday\'s data — or last month\'s.',
  },
  {
    icon: Users,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
    headline: 'Staff Burnout',
    stat: '#1 churn cause',
    body: 'Talented people leave when their job is admin, not work. Manual processes are the number one cause of preventable staff turnover.',
  },
  {
    icon: TrendingDown,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    headline: 'Lost Customers',
    stat: '73% switch',
    body: '73% of customers will switch providers after a poor digital experience. A paper form is a poor digital experience.',
  },
  {
    icon: MessageSquare,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    headline: 'No Scale Path',
    stat: 'Growth blocked',
    body: 'You cannot 10× your revenue with a process built for 2 people on WhatsApp. Manual is a ceiling, not a foundation.',
  },
];

const TRANSFORM_DOMAINS = [
  {
    icon: Workflow,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
    title: 'Field & Site Operations',
    desc: 'Job sheets, inspections, incident reports, and site sign-offs — all digital, all instant, all traceable.',
  },
  {
    icon: Bell,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    title: 'Internal Workflows',
    desc: 'Approvals, handovers, task assignment, and escalations — tracked, notified, closed. No more chasing.',
  },
  {
    icon: BarChart3,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    title: 'Data & Reporting',
    desc: 'One source of truth. Live dashboards your leadership team can act on — not a spreadsheet updated once a month.',
  },
  {
    icon: TrendingUp,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'Client-Facing Processes',
    desc: 'Quotes, onboarding, service delivery, and invoicing — professional, fast, and digital from day one.',
  },
];

const PROCESS_STEPS = [
  {
    week: 'Week 1',
    icon: Target,
    title: 'Audit',
    desc: 'We sit in your operation. Map every manual touchpoint, decision point, and bottleneck — nothing assumed.',
  },
  {
    week: 'Weeks 2–3',
    icon: Shield,
    title: 'Design',
    desc: 'We build the digital workflow. You approve every step before a line of code is written.',
  },
  {
    week: 'Weeks 3–5',
    icon: Layers,
    title: 'Build & Test',
    desc: 'Live system, trained team, zero disruption to daily operations. We go live when you\'re confident.',
  },
  {
    week: 'Week 5+',
    icon: Zap,
    title: 'Handover & Support',
    desc: 'It runs. You own it. We remain available — but most clients don\'t need us after month one.',
  },
];

const DELIVERABLES = [
  { icon: Workflow,  text: 'Centralised workflow management' },
  { icon: Lock,     text: 'Role-based access & approvals' },
  { icon: Bell,     text: 'Automated notifications & tracking' },
  { icon: BarChart3,text: 'Real-time dashboards & reporting' },
  { icon: Eye,      text: 'Audit trail & governance visibility' },
  { icon: Database, text: 'Scalable and secure architecture' },
  { icon: Bot,      text: 'Optional AI Knowledge Assistant' },
];

const INDUSTRIES = [
  { icon: Factory,      name: 'Oil & Gas',                    pain: 'Paper permits, HSE compliance, and field reporting going digital.' },
  { icon: Building2,    name: 'Construction',                 pain: 'Site diaries, snag lists, and subcontractor workflows — all tracked.' },
  { icon: Landmark,     name: 'Government & Public Sector',   pain: 'Service requests, approvals, and public records made accessible.' },
  { icon: GraduationCap,name: 'Education & Training',         pain: 'Enrolment, attendance, and reporting off spreadsheets for good.' },
  { icon: Briefcase,    name: 'SMEs Scaling Operations',      pain: 'Processes that worked at 5 people — redesigned to work at 50.' },
];

const FAQS = [
  {
    q: 'We\'ve tried software before and it didn\'t work.',
    a: 'Off-the-shelf software is built for everyone, which means it fits no one perfectly. We build around your workflow, not the other way around. If it doesn\'t fit how your team works, your team won\'t use it — and we know that.',
  },
  {
    q: 'Sounds expensive. We can\'t justify the cost right now.',
    a: 'Manual processes are already expensive — you\'re just not seeing the invoice. At 11 hours of wasted admin per employee per week, the cost of NOT digitalising is far higher than our build fee. We can show you the numbers in the first session.',
  },
  {
    q: 'Our team won\'t adopt new technology.',
    a: 'Because we build WITH your team — not for them. Every step is reviewed and approved by the people who will use it. We train your people before go-live. Adoption is a design problem, not a people problem.',
  },
  {
    q: 'We\'re too busy to change right now.',
    a: 'That\'s exactly when you need it most. The reason you\'re too busy is because manual processes are consuming time you don\'t have. We handle the build — your team\'s involvement is minimal during delivery.',
  },
];

/* ─── Self-contained FAQ item ────────────────────────────────────────────── */
function FaqItem({ q, a, hoverClass }: { q: string; a: string; hoverClass: string }) {
  const [open, setOpen] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  return (
    <div className="rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-5 text-left group"
      >
        <span className={`text-sm font-bold text-white pr-4 ${hoverClass} transition-colors leading-snug`}>
          {q}
        </span>
        <ChevronDown
          size={18}
          className="text-slate-500 flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div
        role="region"
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? `${innerRef.current?.scrollHeight ?? 600}px` : '0px' }}
      >
        <div ref={innerRef}>
          <p className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-white/[0.05] pt-4">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Section wrapper with fade-in ──────────────────────────────────────── */
function Section({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
      className={className}
    >
      {children}
    </div>
  );
}

/* ─── Stat card with counter ─────────────────────────────────────────────── */
function StatCard({
  value,
  suffix,
  display,
  label,
  sub,
  color,
  active,
}: {
  value: number;
  suffix: string;
  display?: string;
  label: string;
  sub: string;
  color: string;
  active: boolean;
}) {
  const count = useCountUp(display ? 0 : value, active);
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm p-6 text-center">
      <div className="text-5xl font-black mb-2 tabular-nums" style={{ color }}>
        {display ?? `${count}${suffix}`}
      </div>
      <div className="text-sm font-bold text-white mb-1">{label}</div>
      <div className="text-xs text-slate-500">{sub}</div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function DigitalisationPage() {
  const [contactEmail, setContactEmail] = useState('flservices.ai@gmail.com');
  const { ref: statsRef, visible: statsVisible } = useFadeIn(0.2);

  useEffect(() => {
    fetch('/api/brand')
      .then((r) => r.json())
      .then((d) => { if (d?.contactEmail) setContactEmail(d.contactEmail); })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#030d1a]">
      <ServiceStickyNav
        title="Digitalisation"
        ctaHref={`mailto:${contactEmail}?subject=Digitalisation%20Free%20Audit`}
        ctaLabel="Book Audit"
        gradient="linear-gradient(to right, #2dd4bf, #3b82f6)"
      />

      {/* ══════════════════════════════════════════
          § 1  HERO
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <MorphicBackground spawnInterval={280} />
        <div className="absolute inset-0 z-[10] bg-gradient-to-br from-[#18a999]/5 via-[#030d1a]/80 to-[#030d1a]" />
        <div className="absolute -top-32 -right-32 z-[10] w-96 h-96 bg-[#18a999]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-[20] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-400 text-xs font-bold uppercase tracking-widest mb-10 transition-colors"
          >
            <ArrowLeft size={13} /> Back to Services
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18a999]/15 border border-[#18a999]/30 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#18a999]" />
                <span className="text-[11px] text-[#18a999] font-bold tracking-widest uppercase">Digitalisation</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-black text-white mb-6 leading-[1.1] tracking-tight">
                Your Business Is{' '}
                <span style={{
                  background: 'linear-gradient(to right, #f87171, #fb923c)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Bleeding Money
                </span>{' '}
                Every Day You Delay
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed mb-4">
                Manual processes, scattered spreadsheets, and WhatsApp chains are costing you more than a digital system ever would.
              </p>
              <p className="text-base text-slate-500 leading-relaxed mb-8">
                FutureLine converts your paper-heavy operations into lean digital workflows — built around your people, live in 5 weeks, owned by you forever.
              </p>

              {/* Stat callout */}
              <div className="inline-flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/[0.08] border border-red-500/20 mb-8">
                <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300 leading-relaxed">
                  <strong>88% of business spreadsheets contain critical errors.</strong>{' '}
                  Every one of those is an unaudited risk sitting in someone's inbox.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`mailto:${contactEmail}?subject=Free%20Digitalisation%20Audit`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white text-sm font-bold hover:opacity-90 transition-opacity uppercase tracking-widest"
                >
                  Book a Free Audit <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Mobile — compact before/after snapshot */}
            <div className="lg:hidden rounded-xl border border-white/[0.08] bg-slate-950/60 backdrop-blur-sm overflow-hidden">
              <div
                className="grid grid-cols-2 border-b border-white/[0.06]"
                style={{ animation: 'fall-from-above 0.55s cubic-bezier(0.22,1,0.36,1) both' }}
              >
                <div className="px-4 py-2.5 border-r border-white/[0.06] bg-red-500/[0.06]">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Before</span>
                </div>
                <div className="px-4 py-2.5 bg-teal-500/[0.06]">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">After</span>
                </div>
              </div>
              {[
                ['Manual spreadsheet updates', 'Live dashboards, instant'],
                ['WhatsApp & email chains', 'Structured tracked workflows'],
                ['Monthly paper reports', 'Real-time visibility'],
              ].map(([before, after], i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 border-b border-white/[0.04] last:border-0"
                  style={{ animation: 'fall-from-above 0.55s cubic-bezier(0.22,1,0.36,1) both', animationDelay: `${(i + 1) * 90}ms` }}
                >
                  <div className="px-4 py-4 flex items-center gap-2 border-r border-white/[0.04]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/60 flex-shrink-0" />
                    <span className="text-sm text-slate-500">{before}</span>
                  </div>
                  <div className="px-4 py-4 flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-teal-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{after}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — before/after comparison (desktop) */}
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-white/[0.08] bg-slate-950/60 backdrop-blur-sm overflow-hidden">
                {/* Header */}
                <div
                  className="grid grid-cols-2 border-b border-white/[0.06]"
                  style={{ animation: 'fall-from-above 0.55s cubic-bezier(0.22,1,0.36,1) both' }}
                >
                  <div className="px-5 py-3 border-r border-white/[0.06] bg-red-500/[0.06]">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Before FutureLine</span>
                  </div>
                  <div className="px-5 py-3 bg-teal-500/[0.06]">
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">After FutureLine</span>
                  </div>
                </div>
                {/* Rows */}
                {[
                  ['Spreadsheets updated manually', 'Live dashboards, updated instantly'],
                  ['WhatsApp & email chains', 'Structured tracked workflows'],
                  ['Monthly paper reports', 'Real-time operational visibility'],
                  ['Approval bottlenecks', 'Automated sign-off & notifications'],
                  ['Tribal knowledge in heads', 'Centralised digital records'],
                  ['Can\'t scale beyond 10 people', 'Scales to 500+ without friction'],
                ].map(([before, after], i) => (
                  <div
                    key={i}
                    className="grid grid-cols-2 border-b border-white/[0.04] last:border-0"
                    style={{ animation: 'fall-from-above 0.55s cubic-bezier(0.22,1,0.36,1) both', animationDelay: `${(i + 1) * 90}ms` }}
                  >
                    <div className="px-5 py-5 flex items-center gap-3 border-r border-white/[0.04]">
                      <span className="w-2 h-2 rounded-full bg-red-500/60 flex-shrink-0" />
                      <span className="text-base text-slate-500">{before}</span>
                    </div>
                    <div className="px-5 py-5 flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-teal-400 flex-shrink-0" />
                      <span className="text-base text-slate-300">{after}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 2  COST OF WAITING
      ══════════════════════════════════════════ */}
      <section className="py-24 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-0.5 bg-red-500" />
                <span className="text-sm font-bold text-red-400 tracking-widest uppercase">The Hidden Bill</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                Every Month Without Digitalisation<br className="hidden md:block" /> Is Costing You
              </h2>
              <p className="text-slate-400 max-w-2xl leading-relaxed">
                These aren't theoretical risks. They're the daily reality for businesses running on manual processes — and they compound every single month.
              </p>
            </div>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {PAIN_CARDS.map((card, i) => (
              <Section key={card.headline} delay={i * 80}>
                <div className="group h-full rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm hover:border-red-500/20 hover:shadow-xl hover:shadow-red-500/[0.05] transition-all duration-300 p-6">
                  <div className={`w-11 h-11 ${card.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <card.icon size={20} className={card.color} />
                  </div>
                  <div className="text-2xl font-black text-white mb-1">{card.stat}</div>
                  <div className="text-sm font-bold text-slate-200 mb-2">{card.headline}</div>
                  <p className="text-sm text-slate-400 leading-relaxed">{card.body}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 3  WHAT IS DIGITALISATION
      ══════════════════════════════════════════ */}
      <section className="py-24 border-b border-white/[0.06] bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              {/* Left */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-0.5 bg-[#18a999]" />
                  <span className="text-sm font-bold text-[#18a999] tracking-widest uppercase">Let's Be Clear</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">
                  Most Businesses Get Digitalisation Completely Wrong
                </h2>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Digitalisation is <em>not</em> buying new software and hoping for the best. It's replacing the way your business actually works — how information moves, how decisions get made, how your team operates — with systems that are faster, error-free, and built around you.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  The difference between businesses that transform successfully and those that don't is simple: successful ones change the process first, then add the technology. We do exactly that.
                </p>
              </div>

              {/* Right — not vs is */}
              <div className="space-y-3">
                <div className="rounded-xl border border-red-500/15 bg-red-500/[0.05] p-5">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">What it's NOT</p>
                  <ul className="space-y-2">
                    {[
                      'Buying a SaaS tool and hoping staff use it',
                      'Moving files from paper to PDF',
                      'Installing project management software',
                      'Paying for tech no one asked for',
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2 text-sm text-slate-500">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500/50 flex-shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-teal-500/20 bg-teal-500/[0.05] p-5">
                  <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">What it IS</p>
                  <ul className="space-y-2">
                    {[
                      'Replacing paper & PDFs with live digital forms and databases',
                      'Converting WhatsApp chains into structured tracked workflows',
                      'Turning monthly spreadsheet reports into real-time dashboards',
                      'Replacing manual approvals with automated sign-off and notifications',
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 size={14} className="text-teal-400 flex-shrink-0 mt-0.5" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 4  WHAT WE TRANSFORM
      ══════════════════════════════════════════ */}
      <section className="py-24 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-[#18a999]" />
                <span className="text-sm font-bold text-[#18a999] tracking-widest uppercase">Our Scope</span>
                <div className="w-8 h-0.5 bg-[#18a999]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                Where We Operate
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                We target the four areas where manual processes cause the most damage to growing businesses.
              </p>
            </div>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TRANSFORM_DOMAINS.map((d, i) => (
              <Section key={d.title} delay={i * 100}>
                <div className="group rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm hover:border-[#18a999]/25 hover:shadow-xl hover:shadow-[#18a999]/[0.05] transition-all duration-300 p-8 flex gap-6 h-full">
                  <div className={`w-12 h-12 ${d.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <d.icon size={22} className={d.color} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">{d.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{d.desc}</p>
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 5  HOW WE DO IT
      ══════════════════════════════════════════ */}
      <section className="py-24 border-b border-white/[0.06] bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-[#18a999]" />
                <span className="text-sm font-bold text-[#18a999] tracking-widest uppercase">The Process</span>
                <div className="w-8 h-0.5 bg-[#18a999]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                From Audit to Live System in 5 Weeks
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                Structured. Predictable. Zero disruption to your daily operations.
              </p>
            </div>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, i) => (
              <Section key={step.title} delay={i * 120}>
                <div className="group relative rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm hover:border-[#18a999]/30 transition-all duration-300 p-6 h-full">
                  {/* Step number */}
                  <div className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {step.week}
                  </div>
                  <div className="w-11 h-11 bg-[#18a999]/10 border border-[#18a999]/20 rounded-xl flex items-center justify-center mb-4 mt-3">
                    <step.icon size={20} className="text-[#18a999]" />
                  </div>
                  <h3 className="text-base font-black text-white mb-2 group-hover:text-teal-300 transition-colors">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>

                  {/* Connector line (desktop) */}
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-10 -right-3 w-6 h-0.5 bg-gradient-to-r from-white/10 to-transparent" />
                  )}
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 6  RESULTS / PROOF
      ══════════════════════════════════════════ */}
      <section className="py-24 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-[#18a999]" />
                <span className="text-sm font-bold text-[#18a999] tracking-widest uppercase">The Numbers</span>
                <div className="w-8 h-0.5 bg-[#18a999]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">What Our Clients Gain</h2>
            </div>
          </Section>

          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard value={5} suffix="×" label="Faster Operations"     sub="Tasks that took a day take an hour"          color="#2dd4bf" active={statsVisible} />
            <StatCard value={0} suffix="" display="40–60%" label="Cost Reduction"      sub="In administrative overhead & rework"         color="#60a5fa" active={statsVisible} />
            <StatCard value={0} suffix="" display="Zero"   label="Manual Errors"       sub="Fully auditable digital trail"               color="#c084fc" active={statsVisible} />
            <StatCard value={5} suffix="" label="Weeks to Live"          sub="Average from kick-off to go-live"           color="#22d3ee" active={statsVisible} />
          </div>

          {/* Deliverables */}
          <Section>
            <div className="mt-8">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">What's included in every build</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DELIVERABLES.map((item) => (
                  <div key={item.text} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/[0.06] bg-slate-950/30">
                    <div className="w-8 h-8 bg-teal-500/10 border border-teal-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon size={14} className="text-teal-400" />
                    </div>
                    <span className="text-sm text-slate-300 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 7  INDUSTRIES
      ══════════════════════════════════════════ */}
      <section className="py-24 border-b border-white/[0.06] bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-0.5 bg-[#18a999]" />
                <span className="text-sm font-bold text-[#18a999] tracking-widest uppercase">Who We Help</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Built for Your Industry</h2>
              <p className="text-slate-400 max-w-lg leading-relaxed">
                Every sector has its own version of the same problem. We know yours.
              </p>
            </div>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INDUSTRIES.map((ind, i) => (
              <Section key={ind.name} delay={i * 80}>
                <div className="group rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm hover:border-[#18a999]/25 transition-all duration-300 p-6 h-full">
                  <div className="w-11 h-11 bg-[#18a999]/10 border border-[#18a999]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#18a999]/20 transition-colors">
                    <ind.icon size={20} className="text-[#18a999]" />
                  </div>
                  <h3 className="text-sm font-black text-white mb-2 group-hover:text-teal-300 transition-colors">{ind.name}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{ind.pain}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 8  FAQ / OBJECTIONS
      ══════════════════════════════════════════ */}
      <section className="py-24 border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-[#18a999]" />
                <span className="text-sm font-bold text-[#18a999] tracking-widest uppercase">Objections</span>
                <div className="w-8 h-0.5 bg-[#18a999]" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-4">
                We've Heard Every Excuse
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Here's the honest answer to each one.
              </p>
            </div>
          </Section>

          <Section>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} hoverClass="group-hover:text-teal-300" />
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 9  CTA
      ══════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#18a999]/[0.06] via-[#030d1a] to-[#030d1a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#18a999]/[0.07] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Section>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18a999]/15 border border-[#18a999]/30 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#18a999]" />
              <span className="text-[11px] text-[#18a999] font-bold tracking-widest uppercase">Free Audit — No Commitment</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              The Longer You Wait,<br />
              <span style={{
                background: 'linear-gradient(to right, #2dd4bf, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                The More It Costs
              </span>
            </h2>

            <p className="text-slate-500 text-base leading-relaxed mb-2">
              Your competitors are not waiting.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed mb-2">
              Your customers already expect it.
            </p>
            <p className="text-white text-xl font-bold leading-relaxed mb-10">
              Your team deserves better than this.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`mailto:${contactEmail}?subject=Digitalisation%20Free%20Audit`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white text-sm font-bold hover:opacity-90 transition-opacity uppercase tracking-widest"
              >
                Book Free Audit — 45 Minutes <ArrowRight size={16} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-white/20 text-white text-sm font-bold hover:bg-white/[0.06] transition-colors uppercase tracking-widest"
              >
                <ArrowLeft size={16} /> View All Services
              </Link>
            </div>

            <p className="text-sm text-slate-500 mt-6">
              No sales pitch. No obligation. Just a clear picture of what your operations could look like.
            </p>
            <p className="text-sm text-slate-600 mt-3">
              Prefer a form?{' '}
              <Link href="/services#enquiry" className="text-teal-400 hover:text-teal-300 underline underline-offset-2 transition-colors">
                Use our online enquiry form →
              </Link>
            </p>
          </Section>
        </div>
      </section>

    </div>
  );
}
