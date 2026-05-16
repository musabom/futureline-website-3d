/**
 * ServiceDetailLayout — shared editorial template for the 4 service detail pages.
 *
 * Each service page (digitalisation, custom-software, automations, consultation)
 * imports this layout and provides its own data. Keeps content in step with the
 * home-page design language (mono eyebrows, AnimatedText reveals, hairline
 * dividers, brand-teal accents) without 4× the duplication.
 */
'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { ChevronDown, Check, X, Layers } from 'lucide-react';
import HeroRibbon3D from './HeroRibbon3DLazy';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { FadeUp } from '@/components/motion/FadeUp';
import { MarqueeStrip } from '@/components/ui/MarqueeStrip';

export interface ServiceDetailData {
  eyebrow: string; // e.g. "FL · Lab · Digitalisation"
  pageNumber: string; // e.g. "01"
  heading: string; // hero H1 (kept short — uses AnimatedText)
  subhead: string;
  marqueeItems: string[];
  painPoints: {
    stat: string;
    headline: string;
    body: string;
  }[];
  process: {
    when: string; // e.g. "Week 1"
    title: string;
    body: string;
  }[];
  deliverables: string[];
  industries?: {
    name: string;
    pain: string;
  }[];
  /**
   * Optional "Off-the-shelf vs. built for you" comparison block.
   * Renders between the deliverables and stats sections.
   */
  compare?: {
    eyebrow?: string;
    headline: string;
    intro?: string;
    leftHeader?: string;  // defaults to "Off-the-shelf SaaS"
    rightHeader?: string; // defaults to "FutureLine custom build"
    rows: { label: string; saas: string; futureline: string }[];
  };
  stats?: {
    value: string;
    label: string;
    sub: string;
  }[];
  faqs?: { q: string; a: string }[];
  cta?: {
    eyebrow?: string;
    headline: string;
    sub: string;
    primary: { label: string; href: string };
    secondary?: { label: string; href: string };
  };
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  return (
    <div className="border-t border-white/[0.08]">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-start justify-between gap-6 py-6 text-left"
        data-cursor="hover"
      >
        <span className="text-base font-medium leading-snug text-white md:text-lg">{q}</span>
        <ChevronDown
          size={18}
          className="mt-1 flex-shrink-0 text-white/45 transition-transform duration-300 group-hover:text-lab"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      <div
        role="region"
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? `${innerRef.current?.scrollHeight ?? 600}px` : '0px' }}
      >
        <div ref={innerRef}>
          <p className="pb-6 pr-12 text-sm leading-relaxed text-white/60 md:text-base">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function ServiceDetailLayout({ data }: { data: ServiceDetailData }) {
  return (
    <main className="bg-brand-bg">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-y-0 right-0 z-0 w-full md:w-1/2">
          <HeroRibbon3D color="#18A999" tilt={0.35} bloom={0.75} />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black via-black/85 to-transparent md:via-black/55"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.4em] text-lab">
                <span
                  aria-hidden="true"
                  className="block h-1.5 w-1.5 rounded-full bg-lab shadow-[0_0_10px_2px_rgba(24,169,153,0.55)]"
                />
                {data.eyebrow}
              </p>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-white/45">
                {data.pageNumber}
              </p>
              <AnimatedText
                as="h1"
                variant="chars"
                className="text-5xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(3.5rem,8vw,6.5rem)]"
              >
                {data.heading}
              </AnimatedText>
              <AnimatedText
                as="p"
                variant="words"
                className="mt-8 max-w-xl text-lg leading-relaxed text-white/65 md:text-xl"
                delay={0.2}
              >
                {data.subhead}
              </AnimatedText>
              <FadeUp delay={0.4}>
                <div className="mt-12 flex flex-wrap items-center gap-3">
                  <Link
                    href="/services/consultation"
                    data-cursor="magnetic"
                    data-cursor-strength="22"
                    className="rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90"
                  >
                    Get a free systems audit
                  </Link>
                  <Link
                    href="/services"
                    data-cursor="hover"
                    className="px-3 py-3 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    All services →
                  </Link>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      <MarqueeStrip items={data.marqueeItems} speed={30} />

      {/* ── Pain points (numbered editorial rows) ── */}
      <section className="px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 md:mb-14">
            <SectionEyebrow>Why it matters</SectionEyebrow>
            <AnimatedText
              as="h2"
              variant="chars"
              className="max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(2.5rem,6vw,5rem)]"
            >
              The cost of staying manual.
            </AnimatedText>
          </div>

          <div className="space-y-0">
            {data.painPoints.map((p, i) => (
              <article
                key={i}
                className="relative grid grid-cols-12 gap-6 border-t border-white/[0.08] py-9 md:gap-12 md:py-12"
              >
                <div className="col-span-12 md:col-span-3">
                  <p className="font-mono text-sm tracking-[0.3em] text-lab">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                    {p.stat}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-9">
                  <AnimatedText
                    as="h3"
                    variant="chars"
                    className="text-3xl font-semibold leading-[1.05] tracking-[-0.01em] text-white md:text-[clamp(1.75rem,3.5vw,3.25rem)]"
                  >
                    {p.headline}
                  </AnimatedText>
                  <AnimatedText
                    as="p"
                    variant="words"
                    className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg"
                    delay={0.1}
                  >
                    {p.body}
                  </AnimatedText>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process / how we work ── */}
      <section className="border-t border-white/[0.06] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 md:mb-14">
            <SectionEyebrow>How we work</SectionEyebrow>
            <AnimatedText
              as="h2"
              variant="chars"
              className="max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(2.5rem,6vw,5rem)]"
            >
              Live in weeks.
            </AnimatedText>
          </div>

          <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2 lg:grid-cols-4">
            {data.process.map((step, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="border-t border-white/[0.12] py-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-lab">
                    {step.when}
                  </p>
                  <h3 className="mt-5 text-2xl font-semibold tracking-[-0.01em] text-white">
                    {String(i + 1).padStart(2, '0')} · {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/55">{step.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Deliverables ── */}
      <section className="border-t border-white/[0.06] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-5">
              <SectionEyebrow>What you get</SectionEyebrow>
              <AnimatedText
                as="h2"
                variant="chars"
                className="text-4xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(2.5rem,5vw,4.5rem)]"
              >
                Built to last.
              </AnimatedText>
              <p className="mt-8 max-w-md text-base leading-relaxed text-white/55 md:text-lg">
                Every system ships with what you actually need on day one — not bolted-on later, not behind a future upsell.
              </p>
            </div>
            <ul className="md:col-span-7">
              {data.deliverables.map((item, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-4 border-t border-white/[0.08] py-5 text-base text-white/80 md:text-lg"
                >
                  <span
                    aria-hidden
                    className="font-mono text-xs tracking-[0.3em] text-lab"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Compare (optional): "Off-the-shelf vs. built for you" ── */}
      {data.compare && data.compare.rows.length > 0 && (
        <section className="border-t border-white/[0.06] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl md:mb-14">
              <SectionEyebrow>{data.compare.eyebrow ?? 'Why not just buy SaaS?'}</SectionEyebrow>
              <AnimatedText
                as="h2"
                variant="chars"
                className="text-4xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(2.5rem,5vw,4.5rem)]"
              >
                {data.compare.headline}
              </AnimatedText>
              {data.compare.intro && (
                <AnimatedText
                  as="p"
                  variant="words"
                  className="mt-8 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg"
                  delay={0.15}
                >
                  {data.compare.intro}
                </AnimatedText>
              )}
            </div>

            {/* Compare grid — each row is a category, with the SaaS reality
                on the left (faded white, ❌) and the FutureLine outcome on
                the right (brand teal, ✓). */}
            <div className="overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.015]">
              {/* Column headers — sticky on tall screens so the user always
                  knows which column is which while reading rows. */}
              <div className="sticky top-0 z-10 grid grid-cols-12 gap-4 border-b border-white/[0.12] bg-black/90 px-6 py-6 backdrop-blur-md md:px-10 md:py-7">
                <div className="col-span-12 md:col-span-3">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/55"
                    >
                      <Layers size={15} strokeWidth={2} />
                    </span>
                    <p className="text-base font-semibold tracking-tight text-white/75 md:text-xl">
                      Category
                    </p>
                  </div>
                </div>
                <div className="col-span-6 md:col-span-4">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white/55"
                    >
                      <X size={16} strokeWidth={2.5} />
                    </span>
                    <p className="text-base font-semibold tracking-tight text-white/70 md:text-xl">
                      {data.compare.leftHeader ?? 'Off-the-shelf SaaS'}
                    </p>
                  </div>
                </div>
                <div className="col-span-6 md:col-span-5">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-lab/40 bg-lab/15 text-lab"
                      style={{ boxShadow: '0 0 18px rgba(24, 169, 153, 0.4)' }}
                    >
                      <Check size={16} strokeWidth={2.5} />
                    </span>
                    <p className="text-base font-semibold tracking-tight text-white md:text-xl">
                      {data.compare.rightHeader ?? 'FutureLine custom build'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rows — category label is now prominent, numbered prefix
                  anchors the eye, FutureLine column gets a left teal hairline
                  so the "answer" column reads as the highlighted one. */}
              {data.compare.rows.map((row, i) => (
                <FadeUp key={i} delay={i * 0.05}>
                  <div className="grid grid-cols-12 items-start gap-4 border-b border-white/[0.06] px-6 py-7 last:border-b-0 md:px-10 md:py-9">
                    <div className="col-span-12 md:col-span-3">
                      <div className="flex items-baseline gap-3">
                        <span
                          aria-hidden
                          className="font-mono text-[11px] tracking-[0.25em] text-lab/70"
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h4 className="text-base font-semibold tracking-tight text-white md:text-lg">
                          {row.label}
                        </h4>
                      </div>
                    </div>
                    <div className="col-span-6 md:col-span-4">
                      <p className="text-sm leading-relaxed text-white/55 md:text-base">
                        {row.saas}
                      </p>
                    </div>
                    <div className="relative col-span-6 md:col-span-5">
                      <span
                        aria-hidden
                        className="absolute -left-4 top-1 hidden h-[calc(100%-0.5rem)] w-px bg-gradient-to-b from-lab/40 via-lab/15 to-transparent md:block"
                      />
                      <p className="text-sm font-medium leading-relaxed text-white md:text-base">
                        {row.futureline}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Stats (optional) ── */}
      {data.stats && data.stats.length > 0 && (
        <section className="border-t border-white/[0.06] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionEyebrow>By the numbers</SectionEyebrow>
            <AnimatedText
              as="h2"
              variant="chars"
              className="max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(2.5rem,6vw,5rem)]"
            >
              What clients gain.
            </AnimatedText>
            <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
              {data.stats.map((s, i) => (
                <FadeUp key={i} delay={i * 0.08}>
                  <div className="border-t border-white/[0.12] pt-6">
                    <p className="text-6xl font-semibold tracking-tight text-white md:text-7xl">
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
        </section>
      )}

      {/* ── Industries (optional) ── */}
      {data.industries && data.industries.length > 0 && (
        <section className="border-t border-white/[0.06] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionEyebrow>Where it fits</SectionEyebrow>
            <AnimatedText
              as="h2"
              variant="chars"
              className="max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(2.5rem,5vw,4.5rem)]"
            >
              Built for your industry.
            </AnimatedText>
            {/* Industries grid — 2 cols on md+ (not 3) so wider cards
                give the substantial pain copy room to breathe. For an
                odd card count (5, 7, 9...), the last card spans both
                columns and centers, avoiding the empty-cell look. */}
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {data.industries.map((ind, i) => {
                const isLastOdd =
                  data.industries!.length % 2 === 1 &&
                  i === data.industries!.length - 1;
                return (
                  <FadeUp
                    key={i}
                    delay={i * 0.06}
                    className={isLastOdd ? 'md:col-span-2' : ''}
                  >
                    <div
                      className={[
                        'h-full rounded-md border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-lab/30 hover:bg-white/[0.04]',
                        isLastOdd ? 'md:mx-auto md:max-w-xl' : '',
                      ].join(' ')}
                    >
                      <h3 className="text-base font-semibold tracking-tight text-white">{ind.name}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/55">{ind.pain}</p>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ (optional) ── */}
      {data.faqs && data.faqs.length > 0 && (
        <section className="border-t border-white/[0.06] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <SectionEyebrow>Common questions</SectionEyebrow>
            <AnimatedText
              as="h2"
              variant="chars"
              className="text-4xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(2.5rem,5vw,4rem)]"
            >
              Things we hear.
            </AnimatedText>
            <div className="mt-10">
              {data.faqs.map((f, i) => (
                <FaqItem key={i} q={f.q} a={f.a} />
              ))}
              <div className="border-t border-white/[0.08]" />
            </div>
          </div>
        </section>
      )}

      {/* ── Closing CTA ── */}
      <section className="border-t border-white/[0.06] px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <FadeUp>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-lab">
              {data.cta?.eyebrow ?? '05 — Start'}
            </p>
            <h2 className="text-5xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(3rem,7vw,6rem)]">
              {data.cta?.headline ?? 'Ready when you are.'}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/65">
              {data.cta?.sub ?? "A free systems audit. No commitment. Just an honest look at what's slowing you down."}
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={data.cta?.primary.href ?? '/services/consultation'}
                data-cursor="magnetic"
                data-cursor-strength="28"
                className="rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition-colors hover:bg-white/90"
              >
                {data.cta?.primary.label ?? 'Get a free audit'}
              </Link>
              {data.cta?.secondary && (
                <Link
                  href={data.cta.secondary.href}
                  data-cursor="hover"
                  className="px-4 py-4 text-sm text-white/70 transition-colors hover:text-white"
                >
                  {data.cta.secondary.label} →
                </Link>
              )}
            </div>
          </FadeUp>
        </div>
      </section>
    </main>
  );
}
