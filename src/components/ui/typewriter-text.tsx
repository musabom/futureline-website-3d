'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function TypewriterText({
  text,
  className,
  speed = 38,
  delay = 0,
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}) {
  const [index, setIndex]     = useState(0);
  const [started, setStarted] = useState(delay === 0);
  const [done, setDone]       = useState(false);

  useEffect(() => {
    if (delay === 0) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started || done) return;
    if (index >= text.length) { setDone(true); return; }
    const t = setTimeout(() => setIndex((i) => i + 1), speed);
    return () => clearTimeout(t);
  }, [started, index, text, speed, done]);

  return (
    <span className={cn('inline', className)}>
      <span>{text.slice(0, index)}</span>
      {!done && (
        <span className="inline-block w-[2px] h-[1em] bg-current align-middle ml-[1px] animate-[blink_0.8s_step-end_infinite]" />
      )}
    </span>
  );
}
