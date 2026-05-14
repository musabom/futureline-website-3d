'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ArrowLeft, CheckCircle2,
  AlertTriangle, Compass, DollarSign, ShieldOff,
  Map, Lightbulb, BarChart3, Target,
  Zap, Shield, Layers, ChevronDown,
  Factory, Building2, Landmark, GraduationCap, Briefcase,
  TrendingUp, Search, FileText, Users,
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
    headline: 'Wrong Tool, Right Price',
    stat: '$47k avg. write-off',
    body: 'The average failed software project costs SMEs $47,000 in licences, development time, and implementation costs — before the decision is made to abandon it.',
  },
  {
    icon: ShieldOff,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    headline: 'Biased Vendor Advice',
    stat: '100% conflict of interest',
    body: 'Every vendor demo, agency pitch, and software comparison site is funded by someone who wants to sell you something. None of them make money telling you what you actually need.',
  },
  {
    icon: Compass,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    headline: 'No Technology Roadmap',
    stat: 'Reactive, not planned',
    body: 'Without a clear technology strategy, every decision is reactive — you buy what\'s urgent, not what\'s strategic. The result is a patchwork of tools that don\'t connect.',
  },
  {
    icon: Users,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
    headline: 'Building in the Wrong Order',
    stat: '#1 project failure cause',
    body: 'Most businesses build tools before fixing the underlying process. The result is faster bad processes. Strategy first means you build the right thing, not just something.',
  },
  {
    icon: Search,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    headline: 'Analysis Paralysis',
    stat: 'Months wasted',
    body: 'The volume of software options, opinions, and conflicting advice leaves decision-makers frozen. An independent expert cuts through the noise and gives you a clear, reasoned path.',
  },
  {
    icon: TrendingUp,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    headline: 'Paying to Learn on the Job',
    stat: 'Avoidable mistakes',
    body: 'Technology mistakes are expensive and slow to fix. A session with an experienced consultant surfaces the pitfalls before you hit them — not six months after.',
  },
];

const CONSULT_TYPES = [
  {
    icon: Map,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    title: 'Technology Roadmap',
    desc: 'A clear, prioritised plan for your technology investments over 12–24 months — what to build, what to buy, what to defer, and in what order.',
  },
  {
    icon: Search,
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
    title: 'Operations & Process Audit',
    desc: 'We map your current operations from the ground up — identifying every inefficiency, risk, and missed opportunity before recommending any solution.',
  },
  {
    icon: FileText,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    title: 'Software Selection Support',
    desc: 'Independent, vendor-neutral guidance on choosing the right tools — evaluated against your specific requirements, not influenced by commission.',
  },
  {
    icon: Lightbulb,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    title: 'Digital Transformation Strategy',
    desc: 'Full-scope transformation planning — people, processes, and technology — aligned to your business objectives, not technology for its own sake.',
  },
  {
    icon: BarChart3,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'Data & Reporting Strategy',
    desc: 'Define the data you need, where it lives, how it flows, and what decisions it drives — before building any dashboards or infrastructure.',
  },
  {
    icon: Shield,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    title: 'Pre-Investment Review',
    desc: 'Before committing budget to a software project or vendor, have FutureLine independently review the proposal — scope, risk, alternatives, and value.',
  },
];

const PROCESS_STEPS = [
  {
    week: 'Session 1',
    icon: Target,
    title: 'Context & Discovery',
    desc: 'We listen before we advise. We map your business, your goals, your constraints, and your current technology landscape without assumptions.',
  },
  {
    week: 'Week 1–2',
    icon: Search,
    title: 'Analysis',
    desc: 'We analyse your processes, review your current tools, and identify the gaps, risks, and priorities — with evidence, not opinion.',
  },
  {
    week: 'Week 2–3',
    icon: Layers,
    title: 'Strategy & Report',
    desc: 'You receive a clear, prioritised recommendation — what to do, in what order, why, and with realistic cost and timeline expectations.',
  },
  {
    week: 'Ongoing',
    icon: Zap,
    title: 'Implementation Support',
    desc: 'We can stay engaged through delivery — as a sanity check, a vendor-neutral reviewer, or an embedded strategic partner as you execute.',
  },
];

const DELIVERABLES = [
  { icon: FileText,   text: 'Written strategy and roadmap document' },
  { icon: Map,        text: 'Prioritised technology investment plan' },
  { icon: Search,     text: 'Process and operations audit report' },
  { icon: BarChart3,  text: 'Data and reporting requirements brief' },
  { icon: Shield,     text: 'Risk and vendor assessment' },
  { icon: Lightbulb,  text: 'Build vs buy recommendations' },
  { icon: Users,      text: 'Team readiness and change plan' },
];

const INDUSTRIES = [
  { icon: Factory,        name: 'Oil & Gas',                    pain: 'Field operations, compliance, and HSE technology strategy — from permit systems to reporting infrastructure.' },
  { icon: Building2,      name: 'Construction',                 pain: 'Project management, subcontractor, and site operations technology — evaluated against your actual workflow.' },
  { icon: Landmark,       name: 'Government & Public Sector',   pain: 'Citizen service transformation, procurement compliance, and legacy system strategy — realistic and evidence-based.' },
  { icon: GraduationCap, name: 'Education & Training',         pain: 'Student experience, LMS, and administration technology strategy aligned to your institution\'s needs.' },
  { icon: Briefcase,      name: 'SMEs Scaling Operations',      pain: 'Technology foundations for growth — what to build now, what to defer, and how to scale without technical debt.' },
];

const FAQS = [
  {
    q: 'We already have an IT team — why would we need consultation?',
    a: 'Internal IT teams manage what\'s there. Strategic consultation is about deciding what should be there next — and why. Most IT teams don\'t have the business strategy context or the cross-sector experience to make those calls independently.',
  },
  {
    q: 'How is FutureLine consultation different from talking to a vendor?',
    a: 'We don\'t sell software. We don\'t receive commission. We have no financial interest in which tool you choose or whether you build or buy. Our only interest is giving you the right advice — because that\'s what keeps clients coming back.',
  },
  {
    q: 'What does consultation actually produce?',
    a: 'Not a deck full of buzzwords. You get a written strategy document, a prioritised roadmap, and specific, reasoned recommendations — with the evidence behind every decision. Something you can take to your board, your bank, or your team.',
  },
  {
    q: 'Can you help us if we\'ve already made some decisions?',
    a: 'Absolutely. Often the most useful engagement is a pre-investment review before a major commitment, or a course-correction when a project is running into problems. It\'s never too late to get independent input.',
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
export default function ConsultationPage() {
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
        title="Consultation"
        ctaHref={`mailto:${contactEmail}?subject=Technology%20Consultation%20Enquiry`}
        ctaLabel="Book Session"
        gradient="linear-gradient(to right, #fbbf24, #f97316)"
      />

      {/* ══════════════════════════════════════════
          § 1  HERO
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <MorphicBackground spawnInterval={280} />
        <div className="absolute inset-0 z-[10] bg-gradient-to-br from-[#18a999]/5 via-[#030d1a]/80 to-[#030d1a]" />
        <div className="absolute -top-32 -right-32 z-[10] w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

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
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[11px] text-amber-400 font-bold tracking-widest uppercase">Consultation</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-black text-white mb-6 leading-[1.1] tracking-tight">
                Make the Right Technology Decisions{' '}
                <span style={{
                  background: 'linear-gradient(to right, #fbbf24, #f97316)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Before They Cost You
                </span>
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed mb-4">
                The most expensive technology decisions are the ones made without independent advice — when a vendor demo replaces a strategy, or urgency replaces planning.
              </p>
              <p className="text-base text-slate-500 leading-relaxed mb-8">
                FutureLine provides honest, vendor-independent technology consultation — helping you understand what your business actually needs, in what order, and at what cost, before you commit a penny.
              </p>

              {/* Stat callout */}
              <div className="inline-flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-500/[0.08] border border-amber-500/20 mb-8">
                <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-300 leading-relaxed">
                  <strong>$47,000 is the average cost of a failed software project</strong> for an SME — most of which could have been avoided with the right advice upfront.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`mailto:${contactEmail}?subject=Technology%20Consultation%20Enquiry`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold hover:opacity-90 transition-opacity uppercase tracking-widest"
                >
                  Book a Strategy Session <ArrowRight size={16} />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white text-sm font-bold hover:bg-white/10 transition-colors uppercase tracking-widest"
                >
                  View All Services
                </Link>
              </div>
            </div>

            {/* Mobile — compact without vs with consultation snapshot */}
            <div className="lg:hidden rounded-xl border border-white/[0.08] bg-slate-950/60 backdrop-blur-sm overflow-hidden">
              <div
                className="grid grid-cols-2 border-b border-white/[0.06]"
                style={{ animation: 'fall-from-above 0.55s cubic-bezier(0.22,1,0.36,1) both' }}
              >
                <div className="px-4 py-2.5 border-r border-white/[0.06] bg-red-500/[0.06]">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Without Advice</span>
                </div>
                <div className="px-4 py-2.5 bg-amber-500/[0.06]">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">With FutureLine</span>
                </div>
              </div>
              {[
                ['Vendor demo replaces strategy', 'Independent roadmap drives decisions'],
                ['$47k average failed project', 'Right tool chosen before budget spent'],
                ['Patchwork of disconnected tools', 'Integrated architecture from day one'],
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
                    <CheckCircle2 size={13} className="text-amber-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{after}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — bad advice vs expert consultation (desktop) */}
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-white/[0.08] bg-slate-950/60 backdrop-blur-sm overflow-hidden">
                <div
                  className="grid grid-cols-2 border-b border-white/[0.06]"
                  style={{ animation: 'fall-from-above 0.55s cubic-bezier(0.22,1,0.36,1) both' }}
                >
                  <div className="px-5 py-3 border-r border-white/[0.06] bg-red-500/[0.06]">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Without Expert Advice</span>
                  </div>
                  <div className="px-5 py-3 bg-amber-500/[0.06]">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">With FutureLine Consultation</span>
                  </div>
                </div>
                {[
                  ['Vendor demo replaces strategy', 'Independent roadmap drives every decision'],
                  ['Build what\'s urgent, not what\'s right', 'Prioritised plan aligned to business goals'],
                  ['$47k average failed project write-off', 'Right tool selected before budget committed'],
                  ['Patchwork of disconnected tools', 'Integrated technology architecture from day one'],
                  ['Technical decisions made by non-technical leaders', 'Expert translation — business goals to technical spec'],
                  ['Guess at ROI, justify post-hoc', 'Evidence-based business case before any spend'],
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
                      <CheckCircle2 size={16} className="text-amber-400 flex-shrink-0" />
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
          § 2  COST OF WRONG DECISIONS
      ══════════════════════════════════════════ */}
      <section className="py-24 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-0.5 bg-red-500" />
                <span className="text-sm font-bold text-red-400 tracking-widest uppercase">The Real Risk</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                Bad Technology Decisions Are Expensive.<br className="hidden md:block" /> Good Advice Isn't.
              </h2>
              <p className="text-slate-400 max-w-2xl leading-relaxed">
                Most technology mistakes aren't technical — they're strategic. The wrong problem was solved. The wrong tool was chosen. The wrong order was followed. All fixable, with the right advice first.
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
          § 3  WHAT WE DO
      ══════════════════════════════════════════ */}
      <section className="py-24 border-b border-white/[0.06] bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              {/* Left */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-0.5 bg-[#18a999]" />
                  <span className="text-sm font-bold text-[#18a999] tracking-widest uppercase">Our Position</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">
                  Independent Advice. No Agenda. No Commission.
                </h2>
                <p className="text-slate-400 leading-relaxed mb-6">
                  FutureLine is not a software vendor. We are not an agency looking for a development contract. We don't receive referral fees or commissions from any tool or platform.
                </p>
                <p className="text-slate-400 leading-relaxed mb-6">
                  This means our only incentive is to give you the right advice — because our reputation depends on our clients making good decisions, not on closing the next deal.
                </p>
                <p className="text-slate-300 font-medium leading-relaxed">
                  Sometimes the right advice is: "Don't build anything yet." We'll say that when it's true.
                </p>
              </div>

              {/* Right */}
              <div className="space-y-3">
                <div className="rounded-xl border border-red-500/15 bg-red-500/[0.05] p-5">
                  <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">What consultation is NOT</p>
                  <ul className="space-y-2">
                    {[
                      'A vendor pitching their platform',
                      'A discovery call designed to sell you a project',
                      'Generic advice that ignores your specific context',
                      'Theory without operational experience behind it',
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2 text-sm text-slate-500">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500/50 flex-shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.05] p-5">
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3">What consultation IS</p>
                  <ul className="space-y-2">
                    {[
                      'Independent review of your current operations and technology',
                      'Clear, prioritised recommendations with the reasoning behind them',
                      'Honest assessment of build vs buy vs defer',
                      'A written strategy your leadership can act on immediately',
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
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
          § 4  CONSULTATION TYPES
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
                Where We Add Value
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                Six types of engagement — each designed to give you clarity before you commit.
              </p>
            </div>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONSULT_TYPES.map((item, i) => (
              <Section key={item.title} delay={i * 80}>
                <div className="group rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm hover:border-amber-500/20 hover:shadow-xl hover:shadow-amber-500/[0.05] transition-all duration-300 p-6 h-full">
                  <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <item.icon size={22} className={item.color} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 5  PROCESS
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
                From First Session to Clear Strategy
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                Structured, documented, and actionable — not a conversation that evaporates the next day.
              </p>
            </div>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, i) => (
              <Section key={step.title} delay={i * 120}>
                <div className="group relative rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm hover:border-amber-500/25 transition-all duration-300 p-6 h-full">
                  <div className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {step.week}
                  </div>
                  <div className="w-11 h-11 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mb-4 mt-3">
                    <step.icon size={20} className="text-amber-400" />
                  </div>
                  <h3 className="text-base font-black text-white mb-2 group-hover:text-amber-300 transition-colors">{step.title}</h3>
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
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">What Good Advice Delivers</h2>
            </div>
          </Section>

          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard value={0}  suffix="" display="$47k"   label="Average Saved"           sub="On aborted or wrong-tool projects"           color="#fbbf24" active={statsVisible} />
            <StatCard value={0}  suffix="" display="100%"   label="Vendor Neutral"           sub="No commission, no referral fees, ever"      color="#f97316" active={statsVisible} />
            <StatCard value={3}  suffix=" wks"              label="Strategy Delivered"       sub="From first session to written roadmap"      color="#2dd4bf" active={statsVisible} />
            <StatCard value={0}  suffix="" display="Clear"  label="Decision Confidence"      sub="Leadership aligned before any spend"        color="#22d3ee" active={statsVisible} />
          </div>

          {/* Deliverables */}
          <Section>
            <div className="mt-12">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">What every engagement produces</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DELIVERABLES.map((item) => (
                  <div key={item.text} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white/[0.06] bg-slate-950/30">
                    <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon size={14} className="text-amber-400" />
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
                Technology strategy looks different in every sector. We bring cross-sector experience and sector-specific understanding.
              </p>
            </div>
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INDUSTRIES.map((ind, i) => (
              <Section key={ind.name} delay={i * 80}>
                <div className="group rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm hover:border-amber-500/20 transition-all duration-300 p-6 h-full">
                  <div className="w-11 h-11 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                    <ind.icon size={20} className="text-amber-400" />
                  </div>
                  <h3 className="text-sm font-black text-white mb-2 group-hover:text-amber-300 transition-colors">{ind.name}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{ind.pain}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 8  FAQ
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
                Questions Worth Asking
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Honest answers to the ones we hear most.
              </p>
            </div>
          </Section>

          <Section>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} hoverClass="group-hover:text-amber-300" />
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 9  CTA
      ══════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.05] via-[#030d1a] to-[#030d1a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/[0.07] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Section>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[11px] text-amber-400 font-bold tracking-widest uppercase">Strategy Session — Independent, No Agenda</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
              Get Clarity Before<br />
              <span style={{
                background: 'linear-gradient(to right, #fbbf24, #f97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                You Commit
              </span>
            </h2>

            <p className="text-slate-500 text-base leading-relaxed mb-2">
              The right decision made early costs nothing.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed mb-2">
              The wrong decision made without advice costs tens of thousands.
            </p>
            <p className="text-white text-xl font-bold leading-relaxed mb-10">
              One session with FutureLine can change the trajectory of your technology investment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`mailto:${contactEmail}?subject=Technology%20Consultation%20Enquiry`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold hover:opacity-90 transition-opacity uppercase tracking-widest"
              >
                Book a Strategy Session <ArrowRight size={16} />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-white/20 text-white text-sm font-bold hover:bg-white/[0.06] transition-colors uppercase tracking-widest"
              >
                <ArrowLeft size={16} /> View All Services
              </Link>
            </div>

            <p className="text-sm text-slate-500 mt-6">
              No sales pitch. We'll tell you what your business actually needs — even if it's nothing from us.
            </p>
            <p className="text-sm text-slate-600 mt-3">
              Prefer a form?{' '}
              <Link href="/services#enquiry" className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors">
                Use our online enquiry form →
              </Link>
            </p>
          </Section>
        </div>
      </section>

    </div>
  );
}
