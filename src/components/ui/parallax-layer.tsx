'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxLayerProps {
  children: React.ReactNode;
  /** 0 = moves with scroll (no effect), 1 = completely fixed. 0.4 is a good default. */
  speed?: number;
  className?: string;
}

export default function ParallaxLayer({ children, speed = 0.4, className }: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ticking = false;

    const update = () => {
      el.style.transform = `translateY(${window.scrollY * speed}px)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return (
    <div ref={ref} style={{ willChange: 'transform' }} className={cn(className)}>
      {children}
    </div>
  );
}
