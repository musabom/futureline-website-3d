import Link from 'next/link';
import { Brain, Cog, BarChart3, Bot, Mail, ArrowRight, Sparkles, FlaskConical } from 'lucide-react';
import type { Metadata } from 'next';
import { getBrandSettings } from '@/lib/brand';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'AI & Automation — FutureLine | Intelligent Business Solutions',
  description: 'AI-powered solutions to help businesses automate processes, gain insights, and operate smarter. Machine learning, process automation, and AI-powered analytics.',
  openGraph: {
    title: 'AI & Automation — FutureLine',
    description: 'AI-powered solutions to help businesses automate processes, gain insights, and operate smarter.',
    type: 'website',
    url: '/ai',
  },
};

const capabilities = [
  {
    icon: Brain,
    title: 'Machine Learning',
    desc: 'Custom ML models that learn and adapt to your business data for predictive analytics and automation.',
    color: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  },
  {
    icon: Cog,
    title: 'Process Automation',
    desc: 'Intelligent automation solutions that streamline workflows and reduce manual effort across your organisation.',
    color: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
  },
  {
    icon: BarChart3,
    title: 'AI-Powered Analytics',
    desc: 'Turn raw data into actionable insights with AI-driven dashboards, reports, and decision support tools.',
    color: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  },
];

const stats = [
  { num: '50+', label: 'AI Projects Planned' },
  { num: '98%', label: 'Target Satisfaction' },
  { num: '5+', label: 'Industries Served' },
  { num: '24/7', label: 'AI-Powered Systems' },
];

const vision = [
  'Custom AI models tailored to your industry and data',
  'Automation of repetitive tasks and decision-making',
  'Integration with your existing tools and workflows',
  'Ongoing support and model improvement',
];

export default async function AIPage() {
  const brand = await getBrandSettings();
  const contactEmail = brand.contactEmail;

  return (
    <div className="min-h-screen bg-[#030d1a]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-slate-900 to-[#030d1a]" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/[0.07] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#18a999]/[0.05] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#18a999]/15 border border-[#18a999]/30 mb-6">
              <FlaskConical size={11} className="text-[#18a999]" />
              <span className="text-[11px] text-[#18a999] font-bold tracking-widest uppercase">FL Lab · AI & Automation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
              Intelligent{' '}
              <span style={{
                background: 'linear-gradient(to right, #a855f7, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Systems
              </span>
            </h1>
            <p className="text-lg text-slate-400 mb-3 leading-relaxed">
              We are building AI-powered solutions to help businesses automate processes, gain insights, and operate smarter.
            </p>
            <p className="text-sm text-slate-600 mb-10">
              Our AI & Automation division is currently in development. Get in touch to discuss your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`mailto:${contactEmail}?subject=FL%20AI%20Enquiry`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white text-sm font-bold hover:opacity-90 transition-opacity uppercase tracking-widest"
              >
                Get in Touch <Mail size={16} />
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white text-sm font-bold hover:bg-white/[0.06] transition-colors uppercase tracking-widest"
              >
                Explore Courses <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capabilities ── */}
      <section className="py-24 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[#18a999]" />
              <span className="text-sm font-bold text-[#18a999] tracking-widest uppercase">What We&apos;re Building</span>
              <div className="w-8 h-0.5 bg-[#18a999]" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">AI Capabilities</h2>
            <p className="text-slate-500 max-w-xl mx-auto mt-3 text-sm leading-relaxed">
              A preview of the AI-powered services we are preparing to launch.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {capabilities.map((item) => (
              <div
                key={item.title}
                className="group rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm hover:border-white/[0.15] p-8 text-center transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-6 ${item.color}`}>
                  <item.icon size={26} />
                </div>
                <h3 className="text-base font-black text-white mb-3 tracking-tight">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className="py-20 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-[#18a999]" />
                <span className="text-sm font-bold text-[#18a999] tracking-widest uppercase">The Vision</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-6">
                AI That Works for Your Business
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed text-sm">
                Our approach is practical and results-driven. We do not believe in AI for the sake of AI. Every solution we build is designed to solve a real problem, save time, and deliver measurable impact.
              </p>
              <ul className="space-y-4">
                {vision.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Sparkles className="text-[#18a999] mt-0.5 flex-shrink-0" size={15} />
                    <span className="text-slate-400 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm p-6 text-center">
                  <div
                    className="text-3xl font-black mb-2"
                    style={{
                      background: 'linear-gradient(to right, #2dd4bf, #3b82f6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {stat.num}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-[#030d1a] to-[#030d1a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-[#18a999]/10 border border-[#18a999]/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Bot className="text-[#18a999]" size={28} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight">
            Interested in AI for Your Business?
          </h2>
          <p className="text-slate-400 mb-10 text-sm leading-relaxed max-w-xl mx-auto">
            We are currently taking expressions of interest. Tell us about your challenge and we will reach out when our AI services go live.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`mailto:${contactEmail}?subject=FL%20AI%20-%20Expression%20of%20Interest`}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white text-sm font-bold hover:opacity-90 transition-opacity uppercase tracking-widest"
            >
              Express Interest <Mail size={16} />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border border-white/20 text-white text-sm font-bold hover:bg-white/[0.06] transition-colors uppercase tracking-widest"
            >
              Browse Courses <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
