'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ArrowLeft, CheckCircle2,
  AlertTriangle, DollarSign, Puzzle, Sliders, Code2,
  Smartphone, Globe, Database, LayoutDashboard, Bot,
  Layers, Target, Zap, Shield, ChevronDown,
  Factory, Building2, Landmark, GraduationCap, Briefcase,
  TrendingUp, Lock, Users,
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
    icon: DollarSign,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    headline: 'Licensing Fees Forever',
    stat: '$12k/yr average',
    body: 'The average SME spends $12,000+ per year on SaaS subscriptions — many for tools only half the team uses. You own nothing. Every renewal is a renegotiation.',
  },
  {
    icon: Puzzle,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    headline: 'The Workaround Tax',
    stat: '3.5 hrs/day lost',
    body: 'When software doesn\'t fit your process, your team builds workarounds — copy-pasting between tools, exporting reports manually, re-entering data. 3.5 hours a day, per person, wasted.',
  },
  {
    icon: Sliders,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    headline: 'Features You\'ll Never Use',
    stat: '80% unused',
    body: 'Studies show SMEs actively use only 20% of the features they\'re paying for. The rest is bloat — confusing your team and slowing adoption.',
  },
  {
    icon: Lock,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
    headline: 'Vendor Lock-in',
    stat: 'Zero control',
    body: 'When your vendor raises prices, kills features, or shuts down — your business stops. You\'re at their mercy. A tool you own can never be taken from you.',
  },
  {
    icon: Users,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    headline: 'Staff Won\'t Use It',
    stat: '70% adoption fail',
    body: '70% of enterprise software deployments fail due to low adoption. Generic tools feel foreign. Software built around your team\'s language and workflow gets used.',
  },
  {
    icon: TrendingUp,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    headline: 'Can\'t Scale Properly',
    stat: 'Growth blocked',
    body: 'Off-the-shelf tools hit their limits when your business grows. You end up bolting tools together — creating fragile, expensive integrations that break under pressure.',
  },
];

const BUILD_TYPES = [
  {
    icon: LayoutDashboard,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
    title: 'Operations Dashboards',
    desc: 'Live operational visibility — jobs, resources, KPIs, status — all in one place, built for how your leadership team thinks.',
  },
  {
    icon: Smartphone,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    title: 'Field & Mobile Apps',
    desc: 'Apps your field team actually uses — inspections, job sheets, incident reports, and sign-offs from any device, online or offline.',
  },
  {
    icon: Globe,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    title: 'Client & Customer Portals',
    desc: 'Give your clients a professional, branded experience — quotes, contracts, progress updates, and invoicing in one secure portal.',
  },
  {
    icon: Database,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'Internal Management Tools',
    desc: 'CRMs, HR tools, asset trackers, approval workflows — custom-built replacements for the off-the-shelf tools that never quite fit.',
  },
  {
    icon: Bot,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    title: 'AI-Powered Features',
    desc: 'Embed intelligent automation — document parsing, smart search, predictive alerts, and AI assistants — directly into your tool.',
  },
  {
    icon: Code2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'System Integrations',
    desc: 'Connect your existing tools — accounting, payroll, ERP, legacy systems — through clean APIs and data pipelines that just work.',
  },
];

const PROCESS_STEPS = [
  {
    week: 'Week 1',
    icon: Target,
    title: 'Discovery',
    desc: 'We map exactly what you need — users, workflows, pain points, and data. No assumptions. The spec is agreed before we start.',
  },
  {
    week: 'Weeks 2–3',
    icon: Layers,
    title: 'Design & Prototype',
    desc: 'You see the interface before a line of code is written. We iterate until it\'s exactly right — your team, your language, your workflow.',
  },
  {
    week: 'Weeks 3–6',
    icon: Code2,
    title: 'Build & Test',
    desc: 'Agile delivery with weekly check-ins. Real users test at every stage. Bugs found here, not in production.',
  },
  {
    week: 'Week 6+',
    icon: Zap,
    title: 'Launch & Handover',
    desc: 'You go live on your terms. Full source code. Full documentation. Training for every user. You own it completely from day one.',
  },
];

const DELIVERABLES = [
  { icon: Code2,          text: 'Full source code — yours to keep' },
  { icon: Shield,         text: 'Secure, production-grade architecture' },
  { icon: Database,       text: 'Scalable database design' },
  { icon: Smartphone,     text: 'Mobile-responsive on all devices' },
  { icon: Lock,           text: 'Role-based access control' },
  { icon: Bot,            text: 'Optional AI feature layer' },
  { icon: Globe,          text: 'Hosted, deployed, and monitored' },
];

const INDUSTRIES = [
  { icon: Factory,        name: 'Oil & Gas',                    pain: 'Custom permit systems, HSE dashboards, and contractor management portals built for your site.' },
  { icon: Building2,      name: 'Construction',                 pain: 'Project management, site diary, and subcontractor tracking tools that replace expensive generic platforms.' },
  { icon: Landmark,       name: 'Government & Public Sector',   pain: 'Citizen-facing service portals and internal workflow tools built to public sector compliance standards.' },
  { icon: GraduationCap, name: 'Education & Training',         pain: 'Student portals, LMS platforms, and enrolment systems that work the way your institution works.' },
  { icon: Briefcase,      name: 'SMEs Scaling Fast',            pain: 'Custom CRMs, operational tools, and client portals that grow with your business — not against it.' },
];

const FAQS = [
  {
    q: 'Custom software sounds expensive — we can\'t afford it.',
    a: 'Compare it against 3 years of SaaS fees for tools that don\'t fit. Most clients recover the build cost within 12 months — and then pay nothing year on year. We also offer phased delivery so the investment is spread over the build timeline.',
  },
  {
    q: 'What if requirements change during the build?',
    a: 'They always do — and we build for it. Our process includes regular check-ins and prototyping before coding starts, so you\'re always reviewing working software, not specs on paper. Changes caught early cost almost nothing.',
  },
  {
    q: 'What happens if something breaks after launch?',
    a: 'You\'ll have a documented, supported codebase — not a black box. We offer support packages and can train your own technical staff to maintain the system. You are never dependent on us to keep the lights on.',
  },
  {
    q: 'How long will it actually take?',
    a: 'Most projects go live in 6–10 weeks depending on complexity. We commit to a delivery timeline before we start — not a rolling estimate. If we miss it, we own it.',
  },
  {
    q: 'We already have a developer. Why do we need FutureLine?',
    a: 'A single developer builds features. We build systems — architecture, UX, data model, security, hosting, documentation, and training, all coordinated. Most in-house devs don\'t have time to do all of that while keeping current systems running.',
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

/* ─── Section wrapper ────────────────────────────────────────────────────── */
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
export default function CustomSoftwarePage() {
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
        title="Custom Software"
        ctaHref={`mailto:${contactEmail}?subject=Custom%20Software%20Discovery%20Call`}
        ctaLabel="Book Call"
        gradient="linear-gradient(to right, #60a5fa, #a78bfa)"
      />

      {/* ══════════════════════════════════════════
          § 1  HERO
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <MorphicBackground spawnInterval={280} />
        <div className="absolute inset-0 z-[10] bg-gradient-to-br from-[#18a999]/5 via-[#030d1a]/80 to-[#030d1a]" />
        <div className="absolute -top-32 -right-32 z-[10] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-[11px] text-blue-400 font-bold tracking-widest uppercase">Custom Software</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-black text-white mb-6 leading-[1.1] tracking-tight">
                Stop Forcing Your Business into Software{' '}
                <span style={{
                  background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  That Wasn't Built for You
                </span>
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed mb-4">
                Off-the-shelf software is designed for the average business. You are not average. You have specific workflows, specific teams, and specific problems no SaaS vendor has solved.
              </p>
              <p className="text-base text-slate-500 leading-relaxed mb-8">
                FutureLine builds software engineered around your operation — owned by you outright, live in weeks, with zero recurring licensing fees forever.
              </p>

              {/* Stat callout */}
              <div className="inline-flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-500/[0.08] border border-blue-500/20 mb-8">
                <AlertTriangle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-300 leading-relaxed">
                  <strong>The average SME spends $12,000+ per year on SaaS tools</strong> — paying forever for software they'll never fully own or control.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`mailto:${contactEmail}?subject=Custom%20Software%20Discovery%20Call`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 text-white text-sm font-bold hover:opacity-90 transition-opacity uppercase tracking-widest"
                >
                  Book a Discovery Call <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Mobile — compact comparison snapshot */}
            <div className="lg:hidden rounded-xl border border-white/[0.08] bg-slate-950/60 backdrop-blur-sm overflow-hidden">
              <div
                className="grid grid-cols-2 border-b border-white/[0.06]"
                style={{ animation: 'fall-from-above 0.55s cubic-bezier(0.22,1,0.36,1) both' }}
              >
                <div className="px-4 py-2.5 border-r border-white/[0.06] bg-red-500/[0.06]">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Off-the-Shelf</span>
                </div>
                <div className="px-4 py-2.5 bg-blue-500/[0.06]">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Custom by FutureLine</span>
                </div>
              </div>
              {[
                ['Built for everyone — fits no one', 'Built for your exact workflow'],
                ['Paying monthly forever', 'One investment, owned outright'],
                ['80% of features unused', 'Every feature you need, nothing extra'],
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
                    <CheckCircle2 size={13} className="text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{after}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — custom vs off-the-shelf comparison (desktop) */}
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-white/[0.08] bg-slate-950/60 backdrop-blur-sm overflow-hidden">
                {/* Header */}
                <div
                  className="grid grid-cols-2 border-b border-white/[0.06]"
                  style={{ animation: 'fall-from-above 0.55s cubic-bezier(0.22,1,0.36,1) both' }}
                >
                  <div className="px-5 py-3 border-r border-white/[0.06] bg-red-500/[0.06]">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Off-the-Shelf</span>
                  </div>
                  <div className="px-5 py-3 bg-blue-500/[0.06]">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Custom by FutureLine</span>
                  </div>
                </div>
                {/* Rows */}
                {[
                  ['Built for everyone — fits no one', 'Built exactly for your workflow'],
                  ['Paying monthly forever', 'One investment, owned outright'],
                  ['80% of features unused', 'Every feature you need, nothing you don\'t'],
                  ['Vendor raises prices — you\'re stuck', 'Zero vendor dependency, ever'],
                  ['Generic UX your team won\'t use', 'Interface built around your team\'s language'],
                  ['Integrations are always painful', 'Built to connect your existing systems'],
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
                      <CheckCircle2 size={16} className="text-blue-400 flex-shrink-0" />
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
          § 2  THE REAL COST OF OFF-THE-SHELF
      ══════════════════════════════════════════ */}
      <section className="py-24 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-0.5 bg-red-500" />
                <span className="text-sm font-bold text-red-400 tracking-widest uppercase">The Hidden Cost</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                Off-the-Shelf Software Is Costing You<br className="hidden md:block" /> More Than You Think
              </h2>
              <p className="text-slate-400 max-w-2xl leading-relaxed">
                The licensing fee is just the start. The real damage is happening in your team's productivity, your data, and your ability to scale.
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
          § 3  WHAT IS CUSTOM SOFTWARE
      ══════════════════════════════════════════ */}
      <section className="py-24 border-b border-white/[0.06] bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              {/* Left */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-0.5 bg-[#18a999]" />
                  <span className="text-sm font-bold text-[#18a999] tracking-widest uppercase">Let's Be Precise</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">
                  Custom Software Is a Competitive Advantage — Not a Luxury
                </h2>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Custom software used to be for enterprises with seven-figure IT budgets. That's no longer true. Modern development tools and frameworks mean we can build production-grade software for SMEs at a fraction of what it cost a decade ago.
                </p>
                <p className="text-slate-400 leading-relaxed mb-6">
                  The result is software that operates exactly as your business operates — your terminology, your process, your rules. No configuration. No workarounds. No compromises.
                </p>
                <p className="text-slate-300 font-medium leading-relaxed">
                  And unlike SaaS, once it's built, it's yours. The asset sits on your balance sheet, not theirs.
                </p>
              </div>

              {/* Right — not vs is */}
              <div className="space-y-3">
                <div className="rounded-xl border border-red-500/15 bg-red-500/[0.05] p-5">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">What custom software is NOT</p>
                  <ul className="space-y-2">
                    {[
                      'A website or a marketing landing page',
                      'Configuring an existing platform (Salesforce, HubSpot, etc.)',
                      'A six-month, six-figure enterprise project',
                      'Something only large companies can afford',
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2 text-sm text-slate-500">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500/50 flex-shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.05] p-5">
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">What custom software IS</p>
                  <ul className="space-y-2">
                    {[
                      'Software built from scratch to match your exact workflow',
                      'An asset you own — source code, database, everything',
                      'A one-time investment with no recurring licence fees',
                      'Ready to scale as your team and data grow',
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
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
          § 4  WHAT WE BUILD
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
                What We Build
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                From internal dashboards to client-facing platforms, we build the tools your business actually needs.
              </p>
            </div>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BUILD_TYPES.map((item, i) => (
              <Section key={item.title} delay={i * 80}>
                <div className="group rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/[0.05] transition-all duration-300 p-6 h-full">
                  <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <item.icon size={22} className={item.color} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 5  HOW WE BUILD IT
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
                Discovery to Delivery in 6 Weeks
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                You see working software, not just documentation. Every decision is made with you, not for you.
              </p>
            </div>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, i) => (
              <Section key={step.title} delay={i * 120}>
                <div className="group relative rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm hover:border-blue-500/25 transition-all duration-300 p-6 h-full">
                  <div className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-violet-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {step.week}
                  </div>
                  <div className="w-11 h-11 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-4 mt-3">
                    <step.icon size={20} className="text-blue-400" />
                  </div>
                  <h3 className="text-base font-black text-white mb-2 group-hover:text-blue-300 transition-colors">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
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
          § 6  RESULTS
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
            <StatCard value={0}  suffix="" display="$0/yr"     label="Licensing Fees"        sub="After the build is complete"                 color="#60a5fa" active={statsVisible} />
            <StatCard value={0}  suffix="" display="100%"      label="Owned Outright"        sub="Full source code, your asset forever"        color="#a78bfa" active={statsVisible} />
            <StatCard value={6}  suffix=" wks"                 label="Average Delivery"      sub="From discovery to production go-live"        color="#2dd4bf" active={statsVisible} />
            <StatCard value={0}  suffix="" display="3.5 hrs"   label="Daily Time Recovered"  sub="Per employee from eliminating workarounds"   color="#22d3ee" active={statsVisible} />
          </div>

          {/* Deliverables */}
          <Section>
            <div className="mt-8">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">What every build includes</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DELIVERABLES.map((item) => (
                  <div key={item.text} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/[0.06] bg-slate-950/30">
                    <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon size={14} className="text-blue-400" />
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
                Custom software works across every sector. The challenge is always the same: a generic tool that doesn't quite fit.
              </p>
            </div>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INDUSTRIES.map((ind, i) => (
              <Section key={ind.name} delay={i * 80}>
                <div className="group rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm hover:border-blue-500/20 transition-all duration-300 p-6 h-full">
                  <div className="w-11 h-11 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <ind.icon size={20} className="text-blue-400" />
                  </div>
                  <h3 className="text-sm font-black text-white mb-2 group-hover:text-blue-300 transition-colors">{ind.name}</h3>
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
                Questions We Get Every Time
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Honest answers, no sales spin.
              </p>
            </div>
          </Section>

          <Section>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} hoverClass="group-hover:text-blue-300" />
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 9  CTA
      ══════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-[#030d1a] to-[#030d1a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-500/[0.07] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Section>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-[11px] text-blue-400 font-bold tracking-widest uppercase">Discovery Call — Free, No Obligation</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              You Deserve Software<br />
              <span style={{
                background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Built for You
              </span>
            </h2>

            <p className="text-slate-500 text-base leading-relaxed mb-2">
              Every tool you pay for monthly was built for someone else.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed mb-2">
              Every workaround your team runs is a process waiting to be automated.
            </p>
            <p className="text-white text-xl font-bold leading-relaxed mb-10">
              Every $ in licensing fees is an asset you're renting, not owning.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`mailto:${contactEmail}?subject=Custom%20Software%20Discovery%20Call`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 text-white text-sm font-bold hover:opacity-90 transition-opacity uppercase tracking-widest"
              >
                Book a Free Discovery Call <ArrowRight size={16} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-white/20 text-white text-sm font-bold hover:bg-white/[0.06] transition-colors uppercase tracking-widest"
              >
                <ArrowLeft size={16} /> View All Services
              </Link>
            </div>

            <p className="text-sm text-slate-500 mt-6">
              30-minute call. We'll tell you honestly whether custom software is the right fit — even if the answer is no.
            </p>
            <p className="text-sm text-slate-600 mt-3">
              Prefer a form?{' '}
              <Link href="/services#enquiry" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
                Use our online enquiry form →
              </Link>
            </p>
          </Section>
        </div>
      </section>

    </div>
  );
}
