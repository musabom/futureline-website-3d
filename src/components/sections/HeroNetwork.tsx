/**
 * HeroNetwork — a glowing neon-blue "plexus" that sits BEHIND the hero video.
 *
 * A real, continuously animated <canvas>: nodes drift, lines connect nearby
 * nodes, and everything pulses. Tuned for performance — the first version
 * ran the page into single-digit FPS:
 *
 *  - Glow is a pre-rendered radial-gradient sprite stamped with drawImage,
 *    NOT ctx.shadowBlur (shadowBlur re-computes a Gaussian blur per draw call
 *    per frame and was the single biggest cost on the page).
 *  - Distance culling compares squared distances (no sqrt until a pair is
 *    actually linked).
 *  - Renders at DPR 1 — these are soft glow dots; retina resolution is
 *    invisible here but quadruples the fill cost.
 *  - Pauses the rAF loop entirely when the hero is scrolled off screen or
 *    the tab is hidden (IntersectionObserver + visibilitychange).
 *
 * Honours prefers-reduced-motion by painting a single static frame.
 */
'use client';

import { useEffect, useRef } from 'react';

export function HeroNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Shorter link radius → fewer, cleaner connections (denser webs looked
    // busy and distracting over the figure).
    const LINK = 140;
    const LINK2 = LINK * LINK;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    type Node = { x: number; y: number; vx: number; vy: number; r: number; ph: number };
    let nodes: Node[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let onScreen = true;

    // Pre-rendered glow sprite: bright blue-white core with a soft halo.
    // Stamped at varying scale/alpha per node — zero blur work at runtime.
    const SPRITE = 64; // px, diameter of the sprite canvas
    const sprite = document.createElement('canvas');
    sprite.width = SPRITE;
    sprite.height = SPRITE;
    {
      const sctx = sprite.getContext('2d')!;
      const g = sctx.createRadialGradient(
        SPRITE / 2, SPRITE / 2, 0,
        SPRITE / 2, SPRITE / 2, SPRITE / 2,
      );
      // Softer glow: gentler core and a more gradual cyan-blue falloff, so
      // the nodes read as soft points of light rather than hard bright dots.
      g.addColorStop(0, 'rgba(224,244,255,0.9)');
      g.addColorStop(0.22, 'rgba(150,205,255,0.5)');
      g.addColorStop(0.5, 'rgba(80,150,255,0.18)');
      g.addColorStop(1, 'rgba(80,150,255,0)');
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, SPRITE, SPRITE);
    }

    function build() {
      const parent = canvas!.parentElement;
      const rect = parent
        ? parent.getBoundingClientRect()
        : { width: window.innerWidth, height: window.innerHeight };
      w = rect.width;
      h = rect.height;
      // DPR 1 on purpose — soft glow dots don't benefit from retina, and
      // rendering at DPR 2 quadruples the pixels pushed per frame.
      canvas!.width = Math.floor(w);
      canvas!.height = Math.floor(h);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      // Roughly half the previous density (and a lower cap) — fewer nodes
      // means far fewer lines, for a cleaner, less busy web.
      const count = Math.max(20, Math.min(64, Math.floor((w * h) / 20000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: rand(-0.14, 0.14),
        vy: rand(-0.14, 0.14),
        r: rand(0.7, 1.6),
        ph: Math.random() * Math.PI * 2,
      }));
    }

    function frame(t: number) {
      ctx!.clearRect(0, 0, w, h);

      // Connecting lines — squared-distance cull, alpha fades with distance.
      ctx!.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK2) {
            ctx!.strokeStyle = `rgba(96,165,255,${((1 - d2 / LINK2) * 0.24).toFixed(3)})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      // Glowing nodes — sprite stamps, pulsing via alpha + scale.
      for (const n of nodes) {
        const tw = 0.6 + 0.4 * Math.sin(t / 850 + n.ph);
        // Smaller stamps and a dimmer pulse → small, soft glowing nodes.
        const size = n.r * 7 * (0.75 + 0.25 * tw);
        ctx!.globalAlpha = 0.3 + 0.3 * tw;
        ctx!.drawImage(sprite, n.x - size / 2, n.y - size / 2, size, size);

        if (!reduced) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20) n.x = w + 20;
          else if (n.x > w + 20) n.x = -20;
          if (n.y < -20) n.y = h + 20;
          else if (n.y > h + 20) n.y = -20;
        }
      }
      ctx!.globalAlpha = 1;
    }

    function loop(t: number) {
      frame(t);
      if (running) raf = requestAnimationFrame(loop);
    }

    /** Start/stop the loop based on visibility — never animate unseen. */
    function sync() {
      const shouldRun = !reduced && onScreen && !document.hidden;
      if (shouldRun && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    }

    build();
    frame(0); // static first paint (also the only paint under reduced motion)
    sync();

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: '100px' },
    );
    io.observe(canvas);

    const onVis = () => sync();
    document.addEventListener('visibilitychange', onVis);

    const onResize = () => {
      build();
      frame(performance.now());
    };
    window.addEventListener('resize', onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      // Lower opacity for a subtle, background presence. A radial keep-out
      // mask clears the central elliptical column — the robot's face/body,
      // the "FutureLine" title, the sub-copy and the CTA — and ramps the web
      // up toward the left/right edges and corners, so the connections add
      // depth around the scene without crossing over the main design.
      className="pointer-events-none absolute inset-0 h-full w-full opacity-50"
      style={{
        maskImage:
          'radial-gradient(ellipse 52% 72% at 50% 45%, transparent 52%, rgba(0,0,0,0.55) 76%, #000 100%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 52% 72% at 50% 45%, transparent 52%, rgba(0,0,0,0.55) 76%, #000 100%)',
      }}
    />
  );
}
