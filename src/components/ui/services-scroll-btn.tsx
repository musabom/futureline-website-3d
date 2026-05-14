'use client';
import { ArrowDown } from 'lucide-react';

export default function ServicesScrollBtn() {
  return (
    <button
      onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-white/20 text-white text-sm font-bold hover:bg-white/10 transition-colors uppercase tracking-widest"
    >
      Our Services <ArrowDown size={16} />
    </button>
  );
}
