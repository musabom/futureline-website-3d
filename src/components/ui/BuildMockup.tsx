/**
 * BuildMockup — stylized abstract previews of built software + a
 * click-through detail modal with long-form marketing copy.
 *
 * The tiles are not real product screenshots. They're CSS-only visual
 * "atmospheres" suggesting a build TYPE (dashboard / mobile / portal
 * / crm). Clicking a tile opens a modal with full marketing copy
 * explaining how that build helps organizations.
 */
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, X, Check } from 'lucide-react';
import Link from 'next/link';

type BuildKind = 'dashboard' | 'mobile' | 'portal' | 'crm';

export interface BuildTileData {
  title: string;
  subtitle: string;
  industry: string;
  kind: BuildKind;
  detail?: {
    lead: string;
    whoItsFor: string;
    replaces: string;
    features: string[];
    results: string[];
  };
}

// ── Mockup compositions ──────────────────────────────────────────────

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
      <div className="relative h-full max-h-[200px] w-[110px] overflow-hidden rounded-xl border border-white/[0.1] bg-black/40 p-2">
        <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-white/15" />
        <div className="mb-2 flex items-center justify-between">
          <span className="h-1 w-4 rounded-full bg-white/20" />
          <span className="h-1 w-3 rounded-full bg-white/20" />
        </div>
        <div className="mb-2 rounded bg-white/[0.04] p-1.5">
          <span className="block h-1 w-12 rounded-full bg-lab/70" />
          <span className="mt-0.5 block h-1 w-8 rounded-full bg-white/20" />
        </div>
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
        <div className="w-1/3 space-y-1.5 rounded border border-white/[0.06] bg-white/[0.02] p-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-sm bg-lab/40" />
              <span className="h-1 flex-1 rounded-full bg-white/15" />
            </div>
          ))}
        </div>
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
      <div className="mb-2 flex items-center gap-3 border-b border-white/[0.06] pb-1">
        <span className="block h-1 w-8 rounded-full bg-lab" />
        <span className="block h-1 w-6 rounded-full bg-white/15" />
        <span className="block h-1 w-7 rounded-full bg-white/15" />
      </div>
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

// ── BuildTile (the card itself) ──────────────────────────────────────

function BuildTileBody({
  kind,
  title,
  subtitle,
  industry,
  clickable,
}: {
  kind: BuildKind;
  title: string;
  subtitle: string;
  industry: string;
  clickable: boolean;
}) {
  const Mockup = MOCKUP_MAP[kind];
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] text-left transition-all duration-500 hover:border-lab/35 hover:bg-white/[0.04]">
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
          {clickable ? 'See the build' : 'Custom build'}
          <ArrowRight
            size={11}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </div>
  );
}

// Stand-alone (non-clickable) wrapper, kept for backward compatibility.
export function BuildTile(props: {
  kind: BuildKind;
  title: string;
  subtitle: string;
  industry: string;
}) {
  return <BuildTileBody {...props} clickable={false} />;
}

// ── Detail modal ─────────────────────────────────────────────────────

function BuildDetailModal({
  tile,
  onClose,
}: {
  tile: BuildTileData;
  onClose: () => void;
}) {
  const Mockup = MOCKUP_MAP[tile.kind];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (!tile.detail) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="build-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
    >
      {/* Backdrop scrim */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/75 backdrop-blur-sm"
        style={{
          animation: 'build-modal-fade-in 220ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />

      {/* Panel */}
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#070707] shadow-[0_50px_140px_-20px_rgba(0,0,0,0.85),0_0_40px_-10px_rgba(24,169,153,0.25)]"
        style={{
          animation: 'build-modal-pop 320ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <button
          autoFocus
          onClick={onClose}
          aria-label="Close"
          data-cursor="hover"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/70 backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-black/85 hover:text-white"
        >
          <X size={16} strokeWidth={2.25} />
        </button>

        {/* Hero strip — mockup + identity */}
        <div className="grid grid-cols-1 gap-6 border-b border-white/[0.08] p-7 md:grid-cols-12 md:p-10">
          <div className="md:col-span-5">
            <div
              aria-hidden
              className="aspect-[16/10] overflow-hidden rounded-lg border border-white/[0.08] bg-gradient-to-br from-lab/[0.06] via-transparent to-transparent p-4"
            >
              <Mockup />
            </div>
          </div>
          <div className="md:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lab">
              {tile.industry} · Example build
            </p>
            <h2
              id="build-modal-title"
              className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl"
            >
              {tile.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/75 md:text-lg">
              {tile.detail.lead}
            </p>
          </div>
        </div>

        {/* Who it's for */}
        <div className="grid grid-cols-1 gap-6 border-b border-white/[0.06] p-7 md:grid-cols-12 md:p-10">
          <div className="md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lab">
              Who it’s for
            </p>
          </div>
          <p className="text-base leading-relaxed text-white/75 md:col-span-9 md:text-lg">
            {tile.detail.whoItsFor}
          </p>
        </div>

        {/* Replaces */}
        <div className="grid grid-cols-1 gap-6 border-b border-white/[0.06] p-7 md:grid-cols-12 md:p-10">
          <div className="md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lab">
              Replaces
            </p>
          </div>
          <p className="text-base leading-relaxed text-white/65 md:col-span-9 md:text-lg">
            {tile.detail.replaces}
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-6 border-b border-white/[0.06] p-7 md:grid-cols-12 md:p-10">
          <div className="md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lab">
              What it does
            </p>
          </div>
          <ul className="space-y-3 md:col-span-9">
            {tile.detail.features.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-base leading-relaxed text-white/85 md:text-lg"
              >
                <span
                  aria-hidden
                  className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-lab/40 bg-lab/10 text-lab"
                >
                  <Check size={11} strokeWidth={2.5} />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 gap-6 border-b border-white/[0.06] p-7 md:grid-cols-12 md:p-10">
          <div className="md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-lab">
              Typical results
            </p>
          </div>
          <ul className="space-y-3 md:col-span-9">
            {tile.detail.results.map((r, i) => (
              <li
                key={i}
                className="border-l-2 border-lab/40 pl-4 text-base leading-relaxed text-white/85 md:text-lg"
              >
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-7 md:p-10">
          <p className="max-w-md text-sm leading-relaxed text-white/55 md:text-base">
            This is one example. Your build will be shaped around your team —
            not this template.
          </p>
          <Link
            href="/audit"
            onClick={onClose}
            data-cursor="magnetic"
            data-cursor-strength="22"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90"
          >
            Get a free audit
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes build-modal-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes build-modal-pop {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>,
    document.body,
  );
}

// ── Grid wrapper (handles tile-click → modal state) ──────────────────

export function RecentBuildsGrid({ tiles }: { tiles: BuildTileData[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const active = activeIdx !== null ? tiles[activeIdx] : null;

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile, i) => {
          const clickable = !!tile.detail;
          if (!clickable) {
            return (
              <div key={i}>
                <BuildTileBody {...tile} clickable={false} />
              </div>
            );
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              data-cursor="hover"
              className="block h-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-lab/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-xl"
              aria-label={`See the ${tile.title} build`}
            >
              <BuildTileBody {...tile} clickable />
            </button>
          );
        })}
      </div>

      {active && active.detail && (
        <BuildDetailModal tile={active} onClose={() => setActiveIdx(null)} />
      )}
    </>
  );
}
