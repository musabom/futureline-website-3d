import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getBrandSettings } from '@/lib/brand';
import HeroRibbon3D from '@/components/sections/HeroRibbon3DLazy';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { MarqueeStrip } from '@/components/ui/MarqueeStrip';
import { FadeUp } from '@/components/motion/FadeUp';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'AI & Automation — FutureLine | Intelligent Business Solutions',
  description:
    'AI-powered solutions to help businesses automate processes, gain insights, and operate smarter. Machine learning, process automation, and AI-powered analytics.',
  openGraph: {
    title: 'AI & Automation — FutureLine',
    description:
      'AI-powered solutions to help businesses automate processes, gain insights, and operate smarter.',
    type: 'website',
    url: '/ai',
  },
};

const CAPABILITIES = [
  {
    title: 'Machine Learning',
    body:
      'Custom ML models that learn and adapt to your business data — predictive analytics, anomaly detection, recommendation engines, classifiers trained on your reality.',
  },
  {
    title: 'Process Automation',
    body:
      'Intelligent automation that streamlines workflows and decisions across your organisation. Approvals routed, exceptions escalated, audit trail built in.',
  },
  {
    title: 'AI-Powered Analytics',
    body:
      'Turn raw data into actionable insights with AI-driven dashboards, reports, and decision support — natural language queries on top of your operational data.',
  },
];

const VISION = [
  'Custom AI models tailored to your industry and data',
  'Automation of repetitive tasks and decision-making',
  'Integration with your existing tools and workflows',
  'Ongoing support and model improvement',
  'Plain-English explanations of what the model is doing',
  'Human escalation paths on every automated decision',
];

const STATS = [
  { value: '50+', label: 'AI projects planned', sub: 'In active scoping across industries we serve.' },
  { value: '98%', label: 'Target satisfaction', sub: 'Designed so the system pays for itself, fast.' },
  { value: '5+', label: 'Industries served', sub: 'Oil & gas, construction, public sector, education, SME ops.' },
  { value: '24/7', label: 'AI-powered systems', sub: 'Always-on automation with human escalation built in.' },
];

export default async function AIPage() {
  const brand = await getBrandSettings();
  const contactEmail = brand.contactEmail;

  return (
    <main className="bg-brand-bg">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-y-0 right-0 z-0 w-full md:w-1/2">
          <HeroRibbon3D color="#18A999" tilt={0.32} bloom={0.78} />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black via-black/85 to-transparent md:via-black/55"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 md:py-44 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.4em] text-lab">
                <span
                  aria-hidden
                  className="block h-1.5 w-1.5 rounded-full bg-lab shadow-[0_0_10px_2px_rgba(24,169,153,0.55)]"
                />
                FL · Lab · AI & Automation
              </p>
              <AnimatedText
                as="h1"
                variant="chars"
                className="text-5xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(3.5rem,8vw,7rem)]"
              >
                Useful, not magic.
              </AnimatedText>
              <AnimatedText
                as="p"
                variant="words"
                className="mt-8 max-w-xl text-lg leading-relaxed text-white/65 md:text-xl"
                delay={0.2}
              >
                Practical AI for businesses. We don&apos;t build AI for the sake of AI — every model and automation we ship solves a real problem and pays its way.
              </AnimatedText>
              <p className="mt-4 max-w-xl text-sm text-white/40">
                Our AI & Automation division is in active development. Get in touch to discuss your needs early.
              </p>
              <FadeUp delay={0.4}>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Link
                    href={`mailto:${contactEmail}?subject=FL%20AI%20Enquiry`}
                    data-cursor="magnetic"
                    data-cursor-strength="22"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90"
                  >
                    Get in touch <Mail size={15} />
                  </Link>
                  <Link
                    href="/courses"
                    data-cursor="hover"
                    className="inline-flex items-center gap-1 px-3 py-3 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    Explore AI courses <ArrowRight size={14} />
                  </Link>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      <MarqueeStrip
        items={[
          'Machine Learning',
          'Process Automation',
          'AI Analytics',
          'LLM Integration',
          'Human-in-the-loop',
          'Built to be explainable',
        ]}
        speed={32}
      />

      {/* ── Capabilities (numbered editorial rows) ── */}
      <section className="px-4 py-32 sm:px-6 md:py-44 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 md:mb-24">
            <SectionEyebrow>What we&apos;re building</SectionEyebrow>
            <AnimatedText
              as="h2"
              variant="chars"
              className="max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(3rem,6vw,5.5rem)]"
            >
              AI capabilities.
            </AnimatedText>
            <AnimatedText
              as="p"
              variant="words"
              className="mt-8 max-w-xl text-lg leading-relaxed text-white/60 md:text-xl"
              delay={0.15}
            >
              A preview of the AI-powered services we&apos;re preparing to launch.
            </AnimatedText>
          </div>

          <div className="space-y-0">
            {CAPABILITIES.map((c, i) => (
              <article
                key={i}
                className="relative grid grid-cols-12 gap-6 border-t border-white/[0.08] py-12 md:gap-12 md:py-16"
              >
                <div className="col-span-12 md:col-span-3">
                  <p className="font-mono text-sm tracking-[0.3em] text-lab">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-9">
                  <AnimatedText
                    as="h3"
                    variant="chars"
                    className="text-3xl font-semibold leading-[1.05] tracking-[-0.01em] text-white md:text-[clamp(2rem,4vw,3.5rem)]"
                  >
                    {c.title}
                  </AnimatedText>
                  <AnimatedText
                    as="p"
                    variant="words"
                    className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg"
                    delay={0.1}
                  >
                    {c.body}
                  </AnimatedText>
                </div>
              </article>
            ))}
            <div className="border-t border-white/[0.08]" />
          </div>
        </div>
      </section>

      {/* ── Vision + Stats split ── */}
      <section className="border-t border-white/[0.06] px-4 py-32 sm:px-6 md:py-44 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <SectionEyebrow>The vision</SectionEyebrow>
              <AnimatedText
                as="h2"
                variant="chars"
                className="text-4xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(2.5rem,5vw,4.5rem)]"
              >
                AI that works for your business.
              </AnimatedText>
              <p className="mt-8 max-w-md text-base leading-relaxed text-white/60 md:text-lg">
                Our approach is practical and results-driven. We don&apos;t believe in AI for the sake of AI. Every solution is designed to solve a real problem, save time, and deliver measurable impact.
              </p>

              <ul className="mt-10">
                {VISION.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-baseline gap-4 border-t border-white/[0.08] py-4 text-sm text-white/75 md:text-base"
                  >
                    <span
                      aria-hidden
                      className="font-mono text-[10px] tracking-[0.3em] text-lab"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-7">
              <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2 md:gap-y-4">
                {STATS.map((s, i) => (
                  <FadeUp key={i} delay={i * 0.08}>
                    <div className="border-t border-white/[0.12] py-8">
                      <p className="text-5xl font-semibold tracking-tight text-white md:text-6xl">
                        {s.value}
                      </p>
                      <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-white/85">
                        {s.label}
                      </p>
                      <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">{s.sub}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="border-t border-white/[0.06] px-4 py-32 sm:px-6 md:py-44 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <FadeUp>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-lab">
              Start the conversation
            </p>
            <h2 className="text-5xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(3rem,7vw,6rem)]">
              Tell us where AI fits.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/65">
              Early enquiries get a free scoping call. We&apos;ll tell you up front whether AI is the right tool for your problem — or whether automation, dashboards, or a process fix would be cheaper and faster.
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`mailto:${contactEmail}?subject=FL%20AI%20Enquiry`}
                data-cursor="magnetic"
                data-cursor-strength="28"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition-colors hover:bg-white/90"
              >
                Email us <Mail size={15} />
              </Link>
              <Link
                href="/services/consultation"
                data-cursor="hover"
                className="px-4 py-4 text-sm text-white/70 transition-colors hover:text-white"
              >
                Or book a free systems audit →
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
