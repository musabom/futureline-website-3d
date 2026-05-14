'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Word {
  text: string;
  className?: string;
}

const BOUNCE_DURATION = 1800;
const STAGGER        = 450;
const APART_DURATION = 3200;

export default function AnimatedWords({
  words,
  className,
}: {
  words: Word[];
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [bounceVisible, setBounceVisible] = useState(false);
  const [apartVisible,  setApartVisible]  = useState(false);

  // Phase 1 — bounce when section enters viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setBounceVisible(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Phase 2 — apart, fires once last bounce settles
  useEffect(() => {
    if (!bounceVisible) return;
    const delay = (words.length - 1) * STAGGER + BOUNCE_DURATION + 400;
    const t = setTimeout(() => setApartVisible(true), delay);
    return () => clearTimeout(t);
  }, [bounceVisible, words.length]);

  return (
    <span ref={ref} className={cn('inline', className)}>
      {words.map((word, i) => {
        const isFirst = i === 0;
        const isLast  = i === words.length - 1;

        const outerAnim = isFirst && apartVisible
          ? `wordApartLeft  ${APART_DURATION}ms ease-in-out forwards`
          : isLast && apartVisible
          ? `wordApartRight ${APART_DURATION}ms ease-in-out forwards`
          : undefined;

        return (
          <span
            key={i}
            className="inline-block"
            style={outerAnim ? { animation: outerAnim } : undefined}
          >
            <span
              className={cn('inline-block opacity-0', word.className)}
              style={
                bounceVisible
                  ? {
                      animation: `wordBounce ${BOUNCE_DURATION}ms ease forwards`,
                      animationDelay: `${i * STAGGER}ms`,
                    }
                  : undefined
              }
            >
              {word.text}
            </span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </span>
  );
}
