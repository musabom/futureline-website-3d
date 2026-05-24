import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowRight } from 'lucide-react';
import ServiceEnquiryForm from '@/components/ServiceEnquiryForm';
import HeroRibbon3D from '@/components/sections/HeroRibbon3DLazy';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { BrandedHeading } from '@/components/ui/BrandedHeading';
import { MarqueeStrip } from '@/components/ui/MarqueeStrip';
import { FadeUp } from '@/components/motion/FadeUp';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';

export const dynamic = 'force-dynamic';

// Title → slug map for our four hero services. Other DB services render
// as cards without click-through.
const SERVICE_SLUGS: Record<string, string> = {
  'Digitalisation': '/services/digitalisation',
  'Custom Software': '/services/custom-software',
  'Automations': '/services/automations',
  'Consultation': '/services/consultation',
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { status: 'ACTIVE' },
    orderBy: [{ featured: 'desc' }, { createdAt: 'asc' }],
  });

  return (
    <main className="bg-brand-bg">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        {/* Dark canvas backdrop with the signature 3D ribbon on the right side. */}
        <div className="absolute inset-y-0 right-0 z-0 w-full md:w-1/2">
          <HeroRibbon3D color="#18A999" tilt={0.32} bloom={0.75} />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black via-black/85 to-transparent md:via-black/55"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-32 sm:px-6 md:py-44 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-7">
              <p className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.4em] text-lab">
                <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-lab shadow-[0_0_10px_2px_rgba(24,169,153,0.55)]" />
                FL · Lab
              </p>
              <BrandedHeading as="h1" size="xl">
                Systems that earn their keep.
              </BrandedHeading>
              <AnimatedText
                as="p"
                variant="words"
                className="mt-8 max-w-xl text-lg leading-relaxed text-white/65 md:text-xl"
                delay={0.2}
              >
                Four ways we build the digital infrastructure that lets your business scale without breaking. Done in weeks, not years. No recurring licence tax.
              </AnimatedText>
              <FadeUp delay={0.4}>
                <div className="mt-12 flex flex-wrap items-center gap-3">
                  <Link
                    href="#services-grid"
                    data-cursor="magnetic"
                    data-cursor-strength="22"
                    className="rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90"
                  >
                    Browse services
                  </Link>
                  <Link
                    href="/audit"
                    data-cursor="hover"
                    className="px-3 py-3 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    Get a free audit →
                  </Link>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      <MarqueeStrip
        items={[
          'Digitalisation',
          'Custom Software',
          'Automations',
          'Consultation',
          'Systems Built for Scale',
        ]}
        speed={32}
      />

      {/* ── Services grid (editorial cards) ── */}
      <section id="services-grid" className="px-4 py-32 sm:px-6 md:py-44 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-3xl text-center md:mb-24">
            <SectionEyebrow>Available now</SectionEyebrow>
            <BrandedHeading as="h2" size="xl">
              Our services.
            </BrandedHeading>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl">
              Pick the one that matches where you&apos;re stuck. We start with a free audit either way.
            </p>
          </div>

          {services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/40">No services listed yet</p>
              <p className="mt-3 text-sm text-white/55">Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, i) => {
                const slug = SERVICE_SLUGS[service.title];
                const num = String(i + 1).padStart(2, '0');

                const cardClass =
                  'group relative flex h-full flex-col overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.02] p-7 backdrop-blur-sm transition-colors duration-300 hover:border-lab/40 hover:bg-white/[0.04]';

                const inner = (
                  <>
                    <div className="mb-8 flex items-baseline justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-lab">{num}</span>
                      {service.featured && (
                        <span className="rounded-full border border-lab/30 bg-lab/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.25em] text-lab">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-semibold leading-[1.05] tracking-[-0.01em] text-white transition-colors group-hover:text-lab-light">
                      {service.title}
                    </h3>
                    <p className="mt-5 flex-1 text-sm leading-relaxed text-white/55">
                      {service.description}
                    </p>
                    <div className="mt-8 flex items-center justify-between border-t border-white/[0.06] pt-5">
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                        {service.pricingModel ?? 'Learn more'}
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-white/30 transition-all group-hover:translate-x-1 group-hover:text-lab"
                      />
                    </div>
                  </>
                );

                return slug ? (
                  <Link key={service.id} href={slug} className={cardClass} data-cursor="hover">
                    {inner}
                  </Link>
                ) : (
                  <div key={service.id} className={cardClass}>
                    {inner}
                  </div>
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
              <SectionEyebrow>Get in touch</SectionEyebrow>
              <BrandedHeading as="h2" size="lg" className="mt-3">
                Tell us what&apos;s slowing you down.
              </BrandedHeading>
              <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/60">
                Send a quick brief. We&apos;ll come back with an honest read on whether we can help — and the smallest first move that moves the needle.
              </p>
            </div>
          </FadeUp>
          <ServiceEnquiryForm />
        </div>
      </section>
    </main>
  );
}
