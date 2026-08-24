'use client';
import { ArrowDown } from 'lucide-react';

export default function ServicesScrollBtn() {
  return (
    <button
      onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-hairline text-navy text-sm font-bold hover:bg-canvas-card transition-colors uppercase tracking-widest"
    >
      Our Services <ArrowDown size={16} />
    </button>
  );
}
