/**
 * HeroNetwork — a glowing cyan/blue "plexus" that sits BEHIND the hero video.
 *
 * A real, continuously animated <canvas>: nodes drift, lines connect nearby
 * nodes, and everything twinkles every frame. It is NOT an image and never
 * freezes — it renders on requestAnimationFrame. It layers under the robot
 * video (lower z-index), so the network reads around and behind the figure.
 *
 * Honours prefers-reduced-motion by painting a single static frame instead
 * of animating.
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const LINK = 165; // px: connect nodes closer than this
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    type Node = { x: number; y: number; vx: number; vy: number; r: number; ph: number };
    let nodes: Node[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;

    function build() {
      const parent = canvas!.parentElement;
      const rect = parent
        ? parent.getBoundingClientRect()
        : { width: window.innerWidth, height: window.innerHeight };
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Node count scales with area — denser for the reference constellation.
      const count = Math.max(48, Math.min(150, Math.floor((w * h) / 11000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: rand(-0.16, 0.16),
        vy: rand(-0.16, 0.16),
        r: rand(0.8, 2.1),
        ph: Math.random() * Math.PI * 2,
      }));
    }

    function frame(t: number) {
      ctx!.clearRect(0, 0, w, h);

      // Connecting lines — alpha fades with distance.
      ctx!.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            ctx!.strokeStyle = `rgba(96,165,255,${(1 - d / LINK) * 0.42})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      // Glowing neon-blue nodes — bright blue-white core + soft glow halo,
      // pulsing in brightness/size.
      ctx!.shadowColor = 'rgba(66,140,255,1)';
      for (const n of nodes) {
        const tw = 0.6 + 0.4 * Math.sin(t / 850 + n.ph);
        ctx!.shadowBlur = 15 * tw;
        ctx!.fillStyle = `rgba(205,226,255,${0.7 + 0.3 * tw})`;
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fill();

        if (!reduced) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20) n.x = w + 20;
          else if (n.x > w + 20) n.x = -20;
          if (n.y < -20) n.y = h + 20;
          else if (n.y > h + 20) n.y = -20;
        }
      }
      ctx!.shadowBlur = 0;

      if (!reduced) raf = requestAnimationFrame(frame);
    }

    build();
    if (reduced) frame(0);
    else raf = requestAnimationFrame(frame);

    const onResize = () => {
      cancelAnimationFrame(raf);
      build();
      if (reduced) frame(0);
      else raf = requestAnimationFrame(frame);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      // Full-bleed constellation; the robot video above (mix-blend-lighten,
      // full opacity) occludes it where the figure is bright, so it reads as
      // sitting behind the robot without needing a centre mask.
      className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
    />
  );
}
