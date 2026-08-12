/**
 * /v2 — staging route for the light redesign.
 *
 * Noindexed and unlinked. New sections are built and reviewed here while the
 * live home page stays untouched; the cutover swaps this composition into
 * (public)/page.tsx and deletes this route.
 *
 * Right now it renders the design-system proof: tokens, glass, elevation,
 * aurora, grids and the gradient wordmark treatment, so the light layer can
 * be verified before any section is built on top of it.
 */
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'v2 — light redesign staging',
  robots: { index: false, follow: false },
};

function Swatch({ name, className, hex }: { name: string; className: string; hex: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`h-12 w-12 shrink-0 rounded-xl border border-hairline ${className}`} />
      <div className="min-w-0">
        <div className="font-display text-sm font-semibold text-ink">{name}</div>
        <div className="font-mono text-xs text-ink-muted">{hex}</div>
      </div>
    </div>
  );
}

export default function V2Page() {
  return (
    <main className="fl-light relative min-h-screen overflow-hidden bg-canvas text-ink">
      {/* Decorative background layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0 fl-tech-grid" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-40 h-[520px] w-[520px] -translate-x-1/2 rounded-full fl-aurora animate-orbit-spin"
      />

      <div className="relative mx-auto max-w-5xl px-6 py-24">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-teal">
          Light design system
        </p>
        <h1 className="mb-4 font-display text-6xl font-bold tracking-tight md:text-8xl">
          <span className="fl-text-gradient animate-gradient-flow">FutureLine</span>
        </h1>
        <p className="mb-16 max-w-xl text-lg text-ink-muted">
          Stage 3 proof: brand tokens on a light canvas, glass surfaces, brand-tinted
          elevation, and the animated gradient wordmark — all scoped so the existing
          dark pages are untouched.
        </p>

        {/* Palette */}
        <h2 className="mb-5 font-display text-2xl font-semibold">Palette</h2>
        <div className="mb-16 grid grid-cols-2 gap-5 md:grid-cols-4">
          <Swatch name="Navy / ink" className="bg-navy" hex="#0F1E3D" />
          <Swatch name="Teal" className="bg-teal" hex="#18A999" />
          <Swatch name="Mint" className="bg-mint" hex="#2DD4BF" />
          <Swatch name="Canvas" className="bg-canvas" hex="#F7FAFA" />
          <Swatch name="Canvas alt" className="bg-canvas-alt" hex="#EEF5F4" />
          <Swatch name="Card" className="bg-canvas-card" hex="#FFFFFF" />
          <Swatch name="Ink muted" className="bg-ink-muted" hex="#5B6B78" />
          <Swatch name="Hairline" className="bg-hairline" hex="rgba(15,30,61,.10)" />
        </div>

        {/* Surfaces */}
        <h2 className="mb-5 font-display text-2xl font-semibold">Surfaces</h2>
        <div className="mb-16 grid gap-5 md:grid-cols-3">
          <div className="fl-glass fl-elev-2 rounded-card p-6">
            <div className="font-display font-semibold">Glass</div>
            <p className="mt-1 text-sm text-ink-muted">
              Blur with saturation, so it stays colourful over the aurora.
            </p>
          </div>
          <div className="rounded-card border border-hairline bg-canvas-card p-6 fl-elev-1">
            <div className="font-display font-semibold">Card · elevation 1</div>
            <p className="mt-1 text-sm text-ink-muted">Resting state for content cards.</p>
          </div>
          <div className="rounded-card border border-hairline bg-canvas-card p-6 fl-elev-3">
            <div className="font-display font-semibold">Card · elevation 3</div>
            <p className="mt-1 text-sm text-ink-muted">Teal-tinted lift, not grey.</p>
          </div>
        </div>

        {/* Typography */}
        <h2 className="mb-5 font-display text-2xl font-semibold">Typography</h2>
        <div className="mb-16 space-y-3 rounded-card border border-hairline bg-canvas-card p-6">
          <p className="font-display text-3xl font-bold">Space Grotesk — display</p>
          <p className="text-base text-ink-muted">
            Inter — body copy. The quick brown fox jumps over the lazy dog.
          </p>
          <p dir="rtl" lang="ar" className="font-arabic text-2xl">
            أن يكون الجميع قائدًا في الذكاء الاصطناعي.
          </p>
          <p dir="rtl" lang="ar" className="font-arabic text-base text-ink-muted">
            نحوّل الذكاء الاصطناعي من حديثٍ يُقال إلى عملٍ يُنجَز.
          </p>
        </div>

        {/* Motion */}
        <h2 className="mb-5 font-display text-2xl font-semibold">Motion</h2>
        <div className="mb-24 flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-canvas-card px-4 py-2 text-sm fl-elev-1">
            <span className="h-2 w-2 rounded-full bg-teal animate-pulse-ring" />
            pulse-ring
          </span>
          <span className="inline-flex animate-chip-bob items-center rounded-pill border border-hairline bg-canvas-card px-4 py-2 text-sm fl-elev-1">
            chip-bob
          </span>
          <span className="relative inline-flex overflow-hidden rounded-pill bg-gradient-to-r from-navy via-teal to-mint px-6 py-3 text-sm font-semibold text-white">
            sheen
            <span
              aria-hidden
              className="absolute inset-y-0 left-[-70%] w-[45%] -skew-x-12 animate-sheen bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />
          </span>
        </div>

        {/* Grid floor */}
        <div className="relative h-56 overflow-hidden rounded-panel border border-hairline">
          <div aria-hidden className="pointer-events-none absolute inset-x-[-22%] bottom-0 h-[70%] fl-grid-floor" />
          <div className="relative flex h-full items-end justify-center pb-6">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-ink-muted">
              grid floor
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
