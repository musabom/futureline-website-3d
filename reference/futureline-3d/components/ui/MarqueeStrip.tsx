/**
 * MarqueeStrip — looping horizontal ticker between sections.
 * ---------------------------------------------------------------------------
 * Pattern is dead-simple and bulletproof:
 *   - Render the items array TWICE side-by-side inside a flex row.
 *   - Animate the row's transform: translateX(0) → translateX(-50%) on a
 *     CSS keyframe.
 *   - Because the items appear twice, the loop is seamless: when the row
 *     reaches -50%, the second copy is in the exact position the first copy
 *     was at 0%, so the loop point is invisible.
 *
 * Why CSS animation (not GSAP):
 *   - It's a constant linear scroll — no easing, no scroll-coupling needed.
 *   - CSS keyframes are GPU-composited and burn zero JS frames.
 *
 * Variants exposed:
 *   - direction:   'left' (default) or 'right'
 *   - speed:       seconds per full cycle (default 28; lower = faster)
 *   - separator:   visual character between items (default '✦')
 *   - className:   passes through to the outer <div>
 *
 * Accessibility:
 *   - The marquee is decorative — aria-hidden so screen readers skip it.
 *   - prefers-reduced-motion → animation paused via media query in <style>.
 * ---------------------------------------------------------------------------
 */
'use client'

interface MarqueeStripProps {
  items: string[]
  speed?: number
  direction?: 'left' | 'right'
  separator?: string
  className?: string
}

export function MarqueeStrip({
  items,
  speed = 28,
  direction = 'left',
  separator = '✦',
  className = '',
}: MarqueeStripProps) {
  const animationName =
    direction === 'left' ? 'marquee-left' : 'marquee-right'

  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden border-y border-white/10 bg-black py-8 ${className}`}
    >
      <div
        className="flex w-max gap-12 whitespace-nowrap will-change-transform"
        style={{
          animation: `${animationName} ${speed}s linear infinite`,
        }}
      >
        {/* Render the items list TWICE so the -50% loop point is seamless. */}
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center gap-12 pr-12"
          >
            {items.map((label, i) => (
              <span
                key={`${copy}-${i}`}
                className="flex shrink-0 items-center gap-12 text-3xl font-medium uppercase tracking-tight text-white/55 md:text-5xl"
              >
                <span>{label}</span>
                <span className="text-brand-accent/70">{separator}</span>
              </span>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-right {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*='animation'] {
            animation: none !important;
            transform: translateX(-25%);
          }
        }
      `}</style>
    </div>
  )
}
