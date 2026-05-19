/**
 * BuildMockup — stylized abstract previews of built software, used in
 * the "Recent builds" tile strip on the Custom Software service page.
 *
 * These are not real product screenshots. They're CSS-only visual
 * "atmospheres" that suggest "this is a dashboard / mobile app / portal
 * / CRM" without claiming to be any specific client work. Purpose: give
 * a text-heavy service page some visual proof that we ship software.
 *
 * Four `kind` values map to four mockup compositions. Each is fully
 * decorative (aria-hidden) and brand-coloured via lab teal accents.
 */
'use client';

import { ArrowRight } from 'lucide-react';

type BuildKind = 'dashboard' | 'mobile' | 'portal' | 'crm';

function ChromeBar() {
  return (
    <div className="mb-4 flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full bg-white/15" />
      <span className="h-2 w-2 rounded-full bg-white/15" />
      <span className="h-2 w-2 rounded-full bg-white/15" />
      <span className="ml-2 h-2 flex-1 rounded-full bg-white/[0.04]" />
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="flex h-full flex-col">
      <ChromeBar />
      {/* KPI tiles */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded border border-white/[0.06] bg-white/[0.02] px-2 py-2"
          >
            <span className="block h-1 w-6 rounded-full bg-lab/60" />
            <span className="mt-1.5 block h-2 w-8 rounded-sm bg-white/45" />
            <span className="mt-1 block h-1 w-5 rounded-full bg-white/15" />
          </div>
        ))}
      </div>
      {/* Sparkline */}
      <div className="mb-3 rounded border border-white/[0.06] bg-white/[0.02] p-2">
        <svg viewBox="0 0 100 30" className="h-8 w-full" preserveAspectRatio="none">
          <path
            d="M0,22 Q15,18 25,20 T50,12 T75,15 T100,8"
            fill="none"
            stroke="rgb(24, 169, 153)"
            strokeWidth="1.5"
            opacity="0.85"
          />
          <path
            d="M0,22 Q15,18 25,20 T50,12 T75,15 T100,8 L100,30 L0,30 Z"
            fill="rgb(24, 169, 153)"
            opacity="0.12"
          />
        </svg>
      </div>
      {/* Table rows */}
      <div className="space-y-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lab/70" />
            <span className="h-1.5 flex-1 rounded-full bg-white/[0.06]" />
            <span className="h-1.5 w-8 rounded-full bg-white/[0.1]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileMockup() {
  return (
    <div className="flex h-full items-center justify-center">
      {/* Phone frame */}
      <div className="relative h-full max-h-[200px] w-[110px] overflow-hidden rounded-xl border border-white/[0.1] bg-black/40 p-2">
        {/* Notch */}
        <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-white/15" />
        {/* Status row */}
        <div className="mb-2 flex items-center justify-between">
          <span className="h-1 w-4 rounded-full bg-white/20" />
          <span className="h-1 w-3 rounded-full bg-white/20" />
        </div>
        {/* Header */}
        <div className="mb-2 rounded bg-white/[0.04] p-1.5">
          <span className="block h-1 w-12 rounded-full bg-lab/70" />
          <span className="mt-0.5 block h-1 w-8 rounded-full bg-white/20" />
        </div>
        {/* List items */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="mb-1.5 flex items-center gap-1.5 rounded border border-white/[0.05] bg-white/[0.02] px-1.5 py-1"
          >
            <span className="h-2 w-2 rounded-sm bg-lab/40" />
            <div className="flex-1 space-y-0.5">
              <span className="block h-1 w-full rounded-full bg-white/15" />
              <span className="block h-1 w-1/2 rounded-full bg-white/[0.06]" />
            </div>
          </div>
        ))}
        {/* CTA */}
        <div className="absolute bottom-2 left-2 right-2 rounded bg-lab/80 py-1.5 text-center">
          <span className="text-[7px] font-bold uppercase tracking-widest text-black">
            Submit
          </span>
        </div>
      </div>
    </div>
  );
}

function PortalMockup() {
  return (
    <div className="flex h-full flex-col">
      <ChromeBar />
      <div className="flex flex-1 gap-2">
        {/* Sidebar */}
        <div className="w-1/3 space-y-1.5 rounded border border-white/[0.06] bg-white/[0.02] p-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-sm bg-lab/40" />
              <span className="h-1 flex-1 rounded-full bg-white/15" />
            </div>
          ))}
        </div>
        {/* Main */}
        <div className="flex-1 space-y-1.5">
          <div className="rounded border border-white/[0.06] bg-white/[0.02] p-2">
            <span className="block h-1.5 w-2/3 rounded-full bg-lab/65" />
            <span className="mt-1.5 block h-1 w-full rounded-full bg-white/15" />
            <span className="mt-0.5 block h-1 w-1/2 rounded-full bg-white/[0.08]" />
            <div className="mt-2 flex items-center gap-1.5">
              <span className="rounded-full bg-lab/15 px-1.5 py-0.5 text-[7px] font-mono uppercase tracking-widest text-lab">
                Active
              </span>
              <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[7px] font-mono uppercase tracking-widest text-white/50">
                Draft
              </span>
            </div>
          </div>
          <div className="rounded border border-white/[0.06] bg-white/[0.02] p-2">
            <span className="block h-1 w-1/2 rounded-full bg-white/20" />
            <span className="mt-1 block h-1 w-full rounded-full bg-white/[0.08]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CrmMockup() {
  return (
    <div className="flex h-full flex-col">
      <ChromeBar />
      {/* Tabs */}
      <div className="mb-2 flex items-center gap-3 border-b border-white/[0.06] pb-1">
        <span className="block h-1 w-8 rounded-full bg-lab" />
        <span className="block h-1 w-6 rounded-full bg-white/15" />
        <span className="block h-1 w-7 rounded-full bg-white/15" />
      </div>
      {/* Table */}
      <div className="flex-1 space-y-1.5">
        {[
          { status: 'active' },
          { status: 'pending' },
          { status: 'active' },
          { status: 'closed' },
        ].map((row, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded border border-white/[0.05] bg-white/[0.02] px-2 py-1.5"
          >
            <span className="h-3 w-3 rounded-full bg-lab/35" />
            <div className="flex-1 space-y-0.5">
              <span className="block h-1 w-1/2 rounded-full bg-white/30" />
              <span className="block h-1 w-1/3 rounded-full bg-white/[0.08]" />
            </div>
            <span
              className={[
                'rounded-full px-1.5 py-0.5 text-[6px] font-mono uppercase tracking-widest',
                row.status === 'active'
                  ? 'bg-lab/15 text-lab'
                  : row.status === 'pending'
                    ? 'bg-amber-400/15 text-amber-400/80'
                    : 'bg-white/[0.06] text-white/40',
              ].join(' ')}
            >
              {row.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const MOCKUP_MAP: Record<BuildKind, () => React.ReactElement> = {
  dashboard: DashboardMockup,
  mobile: MobileMockup,
  portal: PortalMockup,
  crm: CrmMockup,
};

export function BuildTile({
  kind,
  title,
  subtitle,
  industry,
}: {
  kind: BuildKind;
  title: string;
  subtitle: string;
  industry: string;
}) {
  const Mockup = MOCKUP_MAP[kind];
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] transition-all duration-500 hover:border-lab/35 hover:bg-white/[0.04]">
      {/* Top accent line on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(24, 169, 153, 0.75) 50%, transparent 100%)',
        }}
      />
      <div
        aria-hidden
        className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.05] bg-gradient-to-br from-lab/[0.04] via-transparent to-transparent p-4"
      >
        <Mockup />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-lab/85">
          {industry}
        </p>
        <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">
          {title}
        </h3>
        <p className="mt-1.5 flex-1 text-sm leading-relaxed text-white/55">
          {subtitle}
        </p>
        <div className="mt-4 flex items-center gap-1.5 border-t border-white/[0.05] pt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors duration-300 group-hover:text-lab">
          Custom build
          <ArrowRight
            size={11}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </div>
  );
}
