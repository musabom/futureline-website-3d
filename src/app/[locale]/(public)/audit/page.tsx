import type { Metadata } from 'next';
import AuditEnquiryForm from '@/components/AuditEnquiryForm';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { BrandedHeading } from '@/components/ui/BrandedHeading';
import { FadeUp } from '@/components/motion/FadeUp';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Get a free systems audit — FutureLine',
  description:
    'Tell us what slows you down. We come back with an honest read on what to fix first. No commitment, no pitch deck, no obligation.',
};

const WHAT_YOU_GET = [
  {
    title: 'A 30-minute call',
    body: 'We map your day-to-day, identify the biggest manual touchpoints, and ask the questions a vendor demo never will.',
  },
  {
    title: 'A written read',
    body: 'A short report — plain English — on the three highest-leverage fixes, the rough cost of each, and what they would save.',
  },
  {
    title: 'No pitch deck',
    body: 'If the answer is "you don\'t need us", we\'ll say so. No commission, no upsell, no commitment.',
  },
];

export default function AuditPage() {
  return (
    <main className="bg-brand-bg">
      <section className="relative px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        {/* Subtle ambient teal glow behind the hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-lab/[0.05] blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
            {/* Left — pitch */}
            <div className="lg:col-span-6">
              <SectionEyebrow>Free systems audit</SectionEyebrow>
              <BrandedHeading as="h1" size="xl">
                Tell us what slows you down.
              </BrandedHeading>
              <AnimatedText
                as="p"
                variant="words"
                className="mt-8 max-w-lg text-base leading-relaxed text-white/70 md:text-lg"
                delay={0.15}
              >
                Fill in your name and email and we&apos;ll come back with the smallest first move that pays for itself.
              </AnimatedText>

              <div className="mt-14 space-y-7">
                {WHAT_YOU_GET.map((item, i) => (
                  <FadeUp key={i} delay={i * 0.08}>
                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-lab/40 bg-lab/10 text-lab">
                        <CheckCircle2 size={14} strokeWidth={2.25} />
                      </span>
                      <div>
                        <h3 className="text-base font-semibold tracking-tight text-white md:text-lg">
                          {item.title}
                        </h3>
                        <p className="mt-1 max-w-sm text-sm leading-relaxed text-white/60 md:text-base">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-6">
              <FadeUp>
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-md md:p-9">
                  <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.32em] text-lab">
                    Request a free audit
                  </p>
                  <BrandedHeading as="h2" size="sm" className="mb-7">
                    Start with your details.
                  </BrandedHeading>
                  <AuditEnquiryForm />
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
