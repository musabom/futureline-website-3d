'use client';
import { useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { BookOpen, Clock, ArrowRight, Loader2 } from 'lucide-react';

interface RecommendedCourse {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  deliveryType: string;
  level: string;
  price: number;
  discountPrice: number | null;
  durationHours: number;
  category: string;
  matchScore: number;
}

export default function AIRecommendationForm() {
  const [goal, setGoal] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [deliveryPref, setDeliveryPref] = useState('');
  const [budget, setBudget] = useState('');
  const [results, setResults] = useState<RecommendedCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, skillLevel, deliveryPref, budget: budget ? Number(budget) : undefined }),
      });
      const data = await res.json();
      setResults(data.recommendations || []);
      setSearched(true);
    } catch {
      alert('Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500/20 focus:border-teal-500/50 transition-colors text-sm [&>option]:bg-slate-900';

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">What is your goal?</label>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Learn AI, Become a web developer, Improve cybersecurity skills"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Your skill level</label>
          <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className={inputClass} required>
            <option value="">Select level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Delivery preference</label>
          <select value={deliveryPref} onChange={(e) => setDeliveryPref(e.target.value)} className={inputClass}>
            <option value="">No preference</option>
            <option value="ONLINE">Online</option>
            <option value="IN_PERSON">In-Person</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Maximum budget</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g., 500"
            className={inputClass}
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            {loading ? <><Loader2 className="animate-spin" size={16} /> Analysing…</> : 'Get Recommendations'}
          </button>
        </div>
      </form>

      {searched && (
        <div className="mt-10">
          {results.length === 0 ? (
            <p className="text-center text-slate-500 text-sm">No matching courses found. Try adjusting your preferences.</p>
          ) : (
            <>
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-8 h-0.5 bg-[#18a999]" />
                <h3 className="text-xl font-black text-white tracking-tight">Recommended For You</h3>
                <div className="w-8 h-0.5 bg-[#18a999]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {results.map((course) => (
                  <Link
                    href={`/courses/${course.slug}`}
                    key={course.id}
                    className="group rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm hover:border-[#18a999]/30 hover:shadow-xl hover:shadow-[#18a999]/[0.08] transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    <div className="h-32 bg-gradient-to-br from-teal-900/60 via-slate-900 to-slate-950 flex items-center justify-center relative">
                      <BookOpen className="text-white/10" size={32} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded uppercase tracking-widest">
                          {course.deliveryType.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">{course.level}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-2 group-hover:text-teal-300 transition-colors leading-snug">{course.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mb-4 flex-1 leading-relaxed">{course.shortDescription}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                        <span className="font-black text-white text-sm">
                          {course.price > 0 ? formatPrice(course.discountPrice ?? course.price) : 'Free'}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock size={11} /> {course.durationHours}h
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
