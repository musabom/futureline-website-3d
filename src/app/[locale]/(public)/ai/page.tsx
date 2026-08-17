import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getBrandSettings } from '@/lib/brand';
import HeroRibbon3D from '@/components/sections/HeroRibbon3DLazy';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { BrandedHeading } from '@/components/ui/BrandedHeading';
import { MarqueeStrip } from '@/components/ui/MarqueeStrip';
import { FadeUp } from '@/components/motion/FadeUp';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('ai');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      type: 'website',
      url: '/ai',
    },
  };
}




export default async function AIPage() {
  const t = await getTranslations('ai');
  const brand = await getBrandSettings();
  const contactEmail = brand.contactEmail;
  const capabilities = t.raw('capabilities') as { title: string; body: string }[];
  const visionPoints = t.raw('visionPoints') as string[];
  const stats = t.raw('stats') as { value: string; label: string; sub: string }[];

  return (
    <main className="bg-canvas">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div className="absolute inset-y-0 right-0 z-0 w-full md:w-1/2">
          <HeroRibbon3D color="#18A999" tilt={0.32} bloom={0.78} />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-canvas via-canvas/85 to-transparent md:via-canvas/55"
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
              <BrandedHeading as="h1" size="xl">
                {t('heading')}
              </BrandedHeading>
              <AnimatedText
                as="p"
                variant="words"
                className="mt-8 max-w-xl text-lg leading-relaxed text-ink md:text-xl"
                delay={0.2}
              >
                {t('lede')}
              </AnimatedText>
              <p className="mt-4 max-w-xl text-sm text-ink-muted">
                {t('developing')}
              </p>
              <FadeUp delay={0.4}>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Link
                    href={`mailto:${contactEmail}?subject=FL%20AI%20Enquiry`}
                    data-cursor="magnetic"
                    data-cursor-strength="22"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-colors hover:bg-canvas-card"
                  >
                    {t('getInTouch')} <Mail size={15} />
                  </Link>
                  <Link
                    href="/courses"
                    data-cursor="hover"
                    className="inline-flex items-center gap-1 px-3 py-3 text-sm text-ink transition-colors hover:text-navy"
                  >
                    {t('exploreCourses')} <ArrowRight size={14} />
                  </Link>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      <MarqueeStrip
        items={t.raw('marquee') as string[]}
        speed={32}
      />

      {/* ── Capabilities (numbered editorial rows) ── */}
      <section className="px-4 py-32 sm:px-6 md:py-44 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 md:mb-24">
            <SectionEyebrow>{t('capEyebrow')}</SectionEyebrow>
            <BrandedHeading as="h2" size="lg">
              {t('capHeading')}
            </BrandedHeading>
            <AnimatedText
              as="p"
              variant="words"
              className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted md:text-xl"
              delay={0.15}
            >
              {t('capLede')}
            </AnimatedText>
          </div>

          <div className="space-y-0">
            {capabilities.map((c, i) => (
              <article
                key={i}
                className="relative grid grid-cols-12 gap-6 border-t border-hairline py-12 md:gap-12 md:py-16"
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
                    className="text-3xl font-semibold leading-[1.05] tracking-[-0.01em] text-navy md:text-[clamp(2rem,4vw,3.5rem)]"
                  >
                    {c.title}
                  </AnimatedText>
                  <AnimatedText
                    as="p"
                    variant="words"
                    className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg"
                    delay={0.1}
                  >
                    {c.body}
                  </AnimatedText>
                </div>
              </article>
            ))}
            <div className="border-t border-hairline" />
          </div>
        </div>
      </section>

      {/* ── Vision + Stats split ── */}
      <section className="border-t border-hairline px-4 py-32 sm:px-6 md:py-44 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <SectionEyebrow>{t('visionEyebrow')}</SectionEyebrow>
              <BrandedHeading as="h2" size="lg">
                {t('visionHeading')}
              </BrandedHeading>
              <p className="mt-8 max-w-md text-base leading-relaxed text-ink-muted md:text-lg">
                {t('visionBody')}
              </p>

              <ul className="mt-10">
                {visionPoints.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-baseline gap-4 border-t border-hairline py-4 text-sm text-ink md:text-base"
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
                {stats.map((s, i) => (
                  <FadeUp key={i} delay={i * 0.08}>
                    <div className="border-t border-hairline py-8">
                      <p className="text-5xl font-semibold tracking-tight text-navy md:text-6xl">
                        {s.value}
                      </p>
                      <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-ink">
                        {s.label}
                      </p>
                      <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">{s.sub}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ── */}
      <section className="border-t border-hairline px-4 py-32 sm:px-6 md:py-44 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <FadeUp>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-lab">
              {t('ctaEyebrow')}
            </p>
            <BrandedHeading as="h2" size="xl">
              {t('ctaHeading')}
            </BrandedHeading>
            <p className="mx-auto mt-6 max-w-xl text-lg text-ink">
              {t('ctaBody')}
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`mailto:${contactEmail}?subject=FL%20AI%20Enquiry`}
                data-cursor="magnetic"
                data-cursor-strength="28"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition-colors hover:bg-canvas-card"
              >
                {t('emailUs')} <Mail size={15} />
              </Link>
              <Link
                href="/services/consultation"
                data-cursor="hover"
                className="px-4 py-4 text-sm text-ink transition-colors hover:text-navy"
              >
                {t('bookAudit')}
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
