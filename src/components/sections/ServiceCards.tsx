/**
 * ServiceCards — marketing-style cards for the four FutureLine services.
 *
 * Sits directly after the hero so a first-time visitor immediately sees
 * what FutureLine actually offers, before any brand-experience moments.
 * Editorial card style (not the reference's numbered rows): each card is
 * a self-contained click target with a short pain hook + value prop.
 */
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AnimatedText } from '@/components/ui/AnimatedText';
import { FadeUp } from '@/components/motion/FadeUp';

interface ServiceCardData {
  num: string;
  name: string;
  headline: string;
  body: string;
  href: string;
}

const SERVICES: ServiceCardData[] = [
  {
    num: '01',
    name: 'Digitalisation',
    headline: 'Paper out. Systems in.',
    body:
      'Replace paper trails and disconnected spreadsheets with unified digital workflows. One source of truth. Live in weeks.',
    href: '/services/digitalisation',
  },
  {
    num: '02',
    name: 'Custom Software',
    headline: 'Software that fits.',
    body:
      'Purpose-built platforms shaped around your team — no recurring licence fees, no workarounds, no vendor lock-in.',
    href: '/services/custom-software',
  },
  {
    num: '03',
    name: 'Automations',
    headline: 'Robots do the boring.',
    body:
      'AI-powered workflows that route approvals, sync data, and write reports — freeing your team for work that matters.',
    href: '/services/automations',
  },
  {
    num: '04',
    name: 'Consultation',
    headline: 'Honest second opinion.',
    body:
      'A plain-English audit of your systems. No commission, no vendor bias — just an evidence-based read on what to fix first.',
    href: '/services/consultation',
  },
];

function ServiceCard({ data }: { data: ServiceCardData }) {
  return (
    <Link
      href={data.href}
      data-cursor="hover"
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-lab/40 hover:bg-white/[0.04]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-lab-glow opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative">
        <div className="mb-10 flex items-center justify-between">
          <span className="font-mono text-xs tracking-[0.3em] text-lab">{data.num}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/45 transition-colors group-hover:text-white/65">
            {data.name}
          </span>
        </div>

        <h3 className="text-3xl font-semibold leading-[1.05] tracking-[-0.01em] text-white md:text-4xl">
          {data.headline}
        </h3>

        <p className="mt-6 text-base leading-relaxed text-white/60 md:text-lg">{data.body}</p>

        <div className="mt-10 flex items-center justify-between border-t border-white/[0.08] pt-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
            Learn more
          </span>
          <ArrowRight
            size={15}
            className="text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-lab"
          />
        </div>
      </div>
    </Link>
  );
}

export function ServiceCards() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative border-y border-white/[0.06] bg-brand-bg px-4 py-28 sm:px-6 md:py-40 lg:px-8"
    >
      {/* Subtle ambient backdrop — radial teal glow centered behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-32 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-lab/[0.04] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-14 md:mb-20">
          <p className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.4em] text-lab">
            <span
              aria-hidden
              className="block h-1.5 w-1.5 rounded-full bg-lab shadow-[0_0_10px_2px_rgba(24,169,153,0.55)]"
            />
            What we do
          </p>
          <AnimatedText
            as="h2"
            variant="chars"
            id="services-heading"
            className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.02em] text-white md:text-[clamp(3rem,7vw,6.5rem)]"
          >
            Four ways to build.
          </AnimatedText>
          <AnimatedText
            as="p"
            variant="words"
            className="mt-8 max-w-xl text-lg leading-relaxed text-white/65 md:text-xl"
            delay={0.15}
          >
            Pick the one that matches where you&apos;re stuck. We start with a free audit either way.
          </AnimatedText>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((s, i) => (
            <FadeUp key={s.num} delay={i * 0.08}>
              <ServiceCard data={s} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
