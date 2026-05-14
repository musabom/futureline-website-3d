'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ArrowLeft, CheckCircle2,
  AlertTriangle, Clock, RefreshCw, Mail, FileText,
  Bell, BarChart3, Database, Bot, Workflow,
  Target, Zap, Shield, Layers, ChevronDown,
  Factory, Building2, Landmark, GraduationCap, Briefcase,
  TrendingDown, Users, Settings,
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
    headline: 'Time Haemorrhage',
    stat: '19 hrs/wk per team',
    body: 'The average small business team spends 19 hours per week on tasks a machine could do — data entry, copy-pasting between tools, chasing approvals.',
  },
  {
    icon: RefreshCw,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    headline: 'Human Error Loops',
    stat: '1 in 20 re-entered',
    body: 'Every time a human re-enters data, the error rate is 1 in 20. Across thousands of records, your database is degrading. Automation is error-free, every time.',
  },
  {
    icon: TrendingDown,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    headline: 'Staff Doing Robot Work',
    stat: '40% of tasks',
    body: '40% of most job roles involve tasks that could be fully automated today. Your best people are spending their day on tasks that add zero unique value.',
  },
  {
    icon: Mail,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
    headline: 'Approval Bottlenecks',
    stat: '2.3 days average',
    body: 'The average business approval — expense, purchase order, sign-off — takes 2.3 days of back-and-forth. Automation routes, notifies, and closes in minutes.',
  },
  {
    icon: Users,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    headline: 'Growth Constrained',
    stat: '10× harder to scale',
    body: 'Manual processes mean adding more revenue requires hiring more people to do the same repetitive tasks. Automation breaks the linear relationship between growth and headcount.',
  },
  {
    icon: BarChart3,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    headline: 'Reporting That\'s Always Late',
    stat: 'Weekly, manually',
    body: 'When reports require a human to compile them, they\'re always late and always about last week. Automated reporting means your leadership always has today\'s numbers.',
  },
];

const AUTO_TYPES = [
  {
    icon: Workflow,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    title: 'Approval & Sign-off Workflows',
    desc: 'Purchase orders, expense claims, document approvals — automatically routed to the right person, tracked, escalated if overdue, and logged for audit.',
  },
  {
    icon: Database,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
    title: 'Data Entry & Sync',
    desc: 'Stop re-entering data between systems. We build pipelines that move, transform, and sync data between your tools automatically — zero human involvement.',
  },
  {
    icon: Bell,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    title: 'Smart Notifications & Alerts',
    desc: 'The right person gets notified at exactly the right moment — job complete, deadline missed, threshold breached, status changed. Zero manual monitoring.',
  },
  {
    icon: FileText,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'Report Generation',
    desc: 'Daily, weekly, and monthly reports generated and delivered automatically. Your leadership team gets the numbers in their inbox before they ask for them.',
  },
  {
    icon: Mail,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    title: 'Client & Customer Comms',
    desc: 'Order confirmations, follow-ups, status updates, and renewal reminders — sent automatically based on real-time events in your system.',
  },
  {
    icon: Bot,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'AI-Powered Automation',
    desc: 'Document extraction, smart categorisation, natural language processing, and intelligent decision routing — AI that works inside your existing processes.',
  },
];

const PROCESS_STEPS = [
  {
    week: 'Day 1–3',
    icon: Target,
    title: 'Process Audit',
    desc: 'We map every repetitive task your team does. You tell us what\'s draining time — we document, quantify, and prioritise.',
  },
  {
    week: 'Week 1–2',
    icon: Settings,
    title: 'Design & Agree',
    desc: 'We build the automation logic and walk you through it before building anything. Every trigger, action, and exception is agreed.',
  },
  {
    week: 'Weeks 2–4',
    icon: Layers,
    title: 'Build & Test',
    desc: 'Automation built and tested against real data before going live. Edge cases handled. Monitoring in place from day one.',
  },
  {
    week: 'Week 4+',
    icon: Zap,
    title: 'Live & Maintained',
    desc: 'Goes live silently — your team just stops doing the task. We monitor, adjust, and expand as your processes evolve.',
  },
];

const DELIVERABLES = [
  { icon: Workflow,   text: 'Approval & escalation workflows' },
  { icon: Database,   text: 'Data sync between your tools' },
  { icon: Bell,       text: 'Trigger-based notification system' },
  { icon: BarChart3,  text: 'Automated report delivery' },
  { icon: Shield,     text: 'Audit log on every automated action' },
  { icon: Bot,        text: 'AI document and data processing' },
  { icon: Settings,   text: 'Monitoring and error alerting' },
];

const INDUSTRIES = [
  { icon: Factory,        name: 'Oil & Gas',                    pain: 'Automated permit workflows, HSE incident routing, and shift handover notifications without manual intervention.' },
  { icon: Building2,      name: 'Construction',                 pain: 'Automated snag tracking, material order approvals, and subcontractor payment workflows — no chasing.' },
  { icon: Landmark,       name: 'Government & Public Sector',   pain: 'Citizen enquiry routing, document processing, and compliance reporting automated to reduce manual admin.' },
  { icon: GraduationCap, name: 'Education & Training',         pain: 'Enrolment confirmations, attendance alerts, and exam notifications sent without manual effort.' },
  { icon: Briefcase,      name: 'SMEs Scaling Operations',      pain: 'Replace the daily manual tasks your team hates most — quotes, follow-ups, and internal approvals.' },
];

const FAQS = [
  {
    q: 'Our processes are too complicated to automate.',
    a: 'We\'ve heard this every time. Complex processes are exactly what automation is designed for — because the more steps involved, the more time and error risk you\'re carrying. We start simple and build up, so complexity is managed, not avoided.',
  },
  {
    q: 'What if the automation makes a mistake?',
    a: 'Every automation we build has error handling, logging, and human escalation paths built in. When an edge case occurs, it routes to a human rather than silently failing. You have full visibility of every action taken.',
  },
  {
    q: 'We use lots of different tools — can you connect them?',
    a: 'That\'s often where the biggest wins are. We build integrations between your existing tools — accounting, CRM, operations platforms, email — so data flows automatically instead of being re-entered by hand.',
  },
  {
    q: 'How quickly can we see results?',
    a: 'Most automations go live within 2–4 weeks. The first time your team stops doing a task they\'ve been doing manually for years is the moment you feel the ROI. It\'s usually within weeks of go-live.',
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

/* ─── Stat card ──────────────────────────────────────────────────────────── */
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
export default function AutomationsPage() {
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
        title="Automations"
        ctaHref={`mailto:${contactEmail}?subject=Automation%20Audit%20Request`}
        ctaLabel="Book Audit"
        gradient="linear-gradient(to right, #c084fc, #818cf8)"
      />

      {/* ══════════════════════════════════════════
          § 1  HERO
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <MorphicBackground spawnInterval={280} />
        <div className="absolute inset-0 z-[10] bg-gradient-to-br from-[#18a999]/5 via-[#030d1a]/80 to-[#030d1a]" />
        <div className="absolute -top-32 -right-32 z-[10] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span className="text-[11px] text-purple-400 font-bold tracking-widest uppercase">Automations</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-black text-white mb-6 leading-[1.1] tracking-tight">
                Stop Paying People{' '}
                <span style={{
                  background: 'linear-gradient(to right, #c084fc, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  to Do What Machines Do Better
                </span>
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed mb-4">
                Your team is smart, skilled, and expensive. They should not be spending half their day copying data between spreadsheets, chasing approvals, and sending status update emails.
              </p>
              <p className="text-base text-slate-500 leading-relaxed mb-8">
                FutureLine builds automation that handles your repetitive tasks — fast, error-free, and around the clock — so your people can focus on work only humans can do.
              </p>

              {/* Stat callout */}
              <div className="inline-flex items-start gap-3 px-4 py-3 rounded-xl bg-purple-500/[0.08] border border-purple-500/20 mb-8">
                <AlertTriangle size={16} className="text-purple-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-purple-300 leading-relaxed">
                  <strong>19 hours per week</strong> — that's how much the average small business team spends on tasks automation could handle entirely.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`mailto:${contactEmail}?subject=Automation%20Audit%20Request`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-bold hover:opacity-90 transition-opacity uppercase tracking-widest"
                >
                  Book a Free Automation Audit <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Mobile — compact manual vs automated snapshot */}
            <div className="lg:hidden rounded-xl border border-white/[0.08] bg-slate-950/60 backdrop-blur-sm overflow-hidden">
              <div
                className="grid grid-cols-2 border-b border-white/[0.06]"
                style={{ animation: 'fall-from-above 0.55s cubic-bezier(0.22,1,0.36,1) both' }}
              >
                <div className="px-4 py-2.5 border-r border-white/[0.06] bg-red-500/[0.06]">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Manual Today</span>
                </div>
                <div className="px-4 py-2.5 bg-purple-500/[0.06]">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Automated</span>
                </div>
              </div>
              {[
                ['Approval email — waits 2 days', 'Routes & notifies in seconds'],
                ['Data re-entered across 3 tools', 'Synced automatically, instantly'],
                ['Reports built manually each week', 'Delivered to inbox automatically'],
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
                    <CheckCircle2 size={13} className="text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{after}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — manual vs automated (desktop) */}
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-white/[0.08] bg-slate-950/60 backdrop-blur-sm overflow-hidden">
                <div
                  className="grid grid-cols-2 border-b border-white/[0.06]"
                  style={{ animation: 'fall-from-above 0.55s cubic-bezier(0.22,1,0.36,1) both' }}
                >
                  <div className="px-5 py-3 border-r border-white/[0.06] bg-red-500/[0.06]">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Manual Today</span>
                  </div>
                  <div className="px-5 py-3 bg-purple-500/[0.06]">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Automated by FutureLine</span>
                  </div>
                </div>
                {[
                  ['Someone emails for approval — waits 2 days', 'System routes, notifies, escalates in seconds'],
                  ['Data re-entered across 3 tools by hand', 'Synced automatically between all tools, instantly'],
                  ['Reports built manually every Friday', 'Reports delivered to inbox every Monday morning'],
                  ['Staff chasing overdue tasks by email', 'System auto-escalates with full audit trail'],
                  ['New client — 12-step onboarding admin', 'Triggers, sends, and tracks onboarding automatically'],
                  ['Errors caught days or weeks later', 'Caught at entry point, flagged immediately'],
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
                      <CheckCircle2 size={16} className="text-purple-400 flex-shrink-0" />
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
          § 2  COST OF MANUAL
      ══════════════════════════════════════════ */}
      <section className="py-24 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-0.5 bg-red-500" />
                <span className="text-sm font-bold text-red-400 tracking-widest uppercase">The Real Cost</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                Manual Processes Are a Tax on Your Business
              </h2>
              <p className="text-slate-400 max-w-2xl leading-relaxed">
                You're not just losing time. You're losing accuracy, scalability, and the ability to retain the people who deserve better than admin work.
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
          § 3  WHAT WE AUTOMATE
      ══════════════════════════════════════════ */}
      <section className="py-24 border-b border-white/[0.06] bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-[#18a999]" />
                <span className="text-sm font-bold text-[#18a999] tracking-widest uppercase">Our Scope</span>
                <div className="w-8 h-0.5 bg-[#18a999]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                What We Automate
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                From simple triggers to AI-powered pipelines — we automate the tasks that are stealing your team's day.
              </p>
            </div>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AUTO_TYPES.map((item, i) => (
              <Section key={item.title} delay={i * 80}>
                <div className="group rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm hover:border-purple-500/20 hover:shadow-xl hover:shadow-purple-500/[0.05] transition-all duration-300 p-6 h-full">
                  <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <item.icon size={22} className={item.color} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 4  HOW WE DO IT
      ══════════════════════════════════════════ */}
      <section className="py-24 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-[#18a999]" />
                <span className="text-sm font-bold text-[#18a999] tracking-widest uppercase">The Process</span>
                <div className="w-8 h-0.5 bg-[#18a999]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                Audit to Live in 4 Weeks
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                We find the biggest time drain first, fix it fast, and build from there.
              </p>
            </div>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, i) => (
              <Section key={step.title} delay={i * 120}>
                <div className="group relative rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm hover:border-purple-500/25 transition-all duration-300 p-6 h-full">
                  <div className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {step.week}
                  </div>
                  <div className="w-11 h-11 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-4 mt-3">
                    <step.icon size={20} className="text-purple-400" />
                  </div>
                  <h3 className="text-base font-black text-white mb-2 group-hover:text-purple-300 transition-colors">{step.title}</h3>
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
          § 5  RESULTS
      ══════════════════════════════════════════ */}
      <section className="py-24 border-b border-white/[0.06] bg-slate-950/20">
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
            <StatCard value={19}  suffix=" hrs"                 label="Hours Returned Weekly"  sub="Per team, freed from manual tasks"          color="#c084fc" active={statsVisible} />
            <StatCard value={0}   suffix="" display="Zero"      label="Data Entry Errors"      sub="On automated pipelines, every time"         color="#818cf8" active={statsVisible} />
            <StatCard value={4}   suffix=" wks"                 label="Average Delivery"       sub="From audit to first automation live"        color="#2dd4bf" active={statsVisible} />
            <StatCard value={0}   suffix="" display="24/7"      label="Works While You Sleep"  sub="Automation doesn't take weekends off"       color="#22d3ee" active={statsVisible} />
          </div>

          {/* Deliverables */}
          <Section>
            <div className="mt-12">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">What's included in every automation build</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DELIVERABLES.map((item) => (
                  <div key={item.text} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/[0.06] bg-slate-950/30">
                    <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon size={14} className="text-purple-400" />
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
          § 6  INDUSTRIES
      ══════════════════════════════════════════ */}
      <section className="py-24 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-0.5 bg-[#18a999]" />
                <span className="text-sm font-bold text-[#18a999] tracking-widest uppercase">Who We Help</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">Built for Your Industry</h2>
              <p className="text-slate-400 max-w-lg leading-relaxed">
                Repetitive tasks exist in every sector. We know exactly where to find them in yours.
              </p>
            </div>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INDUSTRIES.map((ind, i) => (
              <Section key={ind.name} delay={i * 80}>
                <div className="group rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm hover:border-purple-500/20 transition-all duration-300 p-6 h-full">
                  <div className="w-11 h-11 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                    <ind.icon size={20} className="text-purple-400" />
                  </div>
                  <h3 className="text-sm font-black text-white mb-2 group-hover:text-purple-300 transition-colors">{ind.name}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{ind.pain}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 7  FAQ
      ══════════════════════════════════════════ */}
      <section className="py-24 border-b border-white/[0.06] bg-slate-950/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-[#18a999]" />
                <span className="text-sm font-bold text-[#18a999] tracking-widest uppercase">Objections</span>
                <div className="w-8 h-0.5 bg-[#18a999]" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-4">
                What We Hear Every Time
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Straight answers.
              </p>
            </div>
          </Section>

          <Section>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} hoverClass="group-hover:text-purple-300" />
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 8  CTA
      ══════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.05] via-[#030d1a] to-[#030d1a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-500/[0.07] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Section>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span className="text-[11px] text-purple-400 font-bold tracking-widest uppercase">Free Automation Audit — No Commitment</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              Every Hour Spent on Admin<br />
              <span style={{
                background: 'linear-gradient(to right, #c084fc, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Is an Hour Not Spent on Growth
              </span>
            </h2>

            <p className="text-slate-500 text-base leading-relaxed mb-2">
              Your competitors are automating.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed mb-2">
              Your team is ready for better work.
            </p>
            <p className="text-white text-xl font-bold leading-relaxed mb-10">
              The only thing still running manually is the decision to change it.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`mailto:${contactEmail}?subject=Automation%20Audit%20Request`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-bold hover:opacity-90 transition-opacity uppercase tracking-widest"
              >
                Book a Free Audit <ArrowRight size={16} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-white/20 text-white text-sm font-bold hover:bg-white/[0.06] transition-colors uppercase tracking-widest"
              >
                <ArrowLeft size={16} /> View All Services
              </Link>
            </div>

            <p className="text-sm text-slate-500 mt-6">
              We'll identify your top 3 automation opportunities in the first session — whether we work together or not.
            </p>
            <p className="text-sm text-slate-600 mt-3">
              Prefer a form?{' '}
              <Link href="/services#enquiry" className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors">
                Use our online enquiry form →
              </Link>
            </p>
          </Section>
        </div>
      </section>

    </div>
  );
}
