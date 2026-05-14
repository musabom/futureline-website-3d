'use client';
import { useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { BookOpen, Clock, Loader2 } from 'lucide-react';

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
        body: JSON.stringify({
          goal,
          skillLevel,
          deliveryPref,
          budget: budget ? Number(budget) : undefined,
        }),
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

  return (
    <div>
      <form onSubmit={handleSubmit} className="mx-auto grid max-w-2xl grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="fl-label" htmlFor="ai-goal">What is your goal?</label>
          <input
            id="ai-goal"
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Learn AI, Become a web developer, Improve cybersecurity skills"
            className="fl-input"
            required
          />
        </div>
        <div>
          <label className="fl-label" htmlFor="ai-skill">Your skill level</label>
          <select
            id="ai-skill"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            className="fl-select"
            required
          >
            <option value="">Select level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="fl-label" htmlFor="ai-delivery">Delivery preference</label>
          <select
            id="ai-delivery"
            value={deliveryPref}
            onChange={(e) => setDeliveryPref(e.target.value)}
            className="fl-select"
          >
            <option value="">No preference</option>
            <option value="ONLINE">Online</option>
            <option value="IN_PERSON">In-Person</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>
        <div>
          <label className="fl-label" htmlFor="ai-budget">Maximum budget</label>
          <input
            id="ai-budget"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g., 500"
            className="fl-input"
          />
        </div>
        <div className="flex items-end md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="fl-submit"
            data-cursor="magnetic"
            data-cursor-strength="22"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Analysing…
              </>
            ) : (
              'Get recommendations'
            )}
          </button>
        </div>
      </form>

      {searched && (
        <div className="mt-14">
          {results.length === 0 ? (
            <p className="text-center text-sm text-white/55">
              No matching courses found. Try adjusting your preferences.
            </p>
          ) : (
            <>
              <div className="mb-10 flex items-center justify-center gap-3">
                <div className="h-px w-10 bg-academy" />
                <h3 className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/85">
                  Recommended for you
                </h3>
                <div className="h-px w-10 bg-academy" />
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {results.map((course) => (
                  <Link
                    href={`/courses/${course.slug}`}
                    key={course.id}
                    data-cursor="hover"
                    className="group flex flex-col overflow-hidden rounded-md border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-academy/40 hover:bg-white/[0.04]"
                  >
                    <div className="relative flex h-28 items-center justify-center border-b border-white/[0.06] bg-gradient-to-br from-academy/10 via-black to-black">
                      <BookOpen className="text-white/15" size={28} />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="rounded border border-academy/30 bg-academy/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-academy">
                          {course.deliveryType.replace('_', ' ')}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                          {course.level}
                        </span>
                      </div>
                      <h4 className="mb-2 text-sm font-semibold leading-snug text-white transition-colors group-hover:text-academy-light">
                        {course.title}
                      </h4>
                      <p className="mb-4 line-clamp-2 flex-1 text-xs leading-relaxed text-white/55">
                        {course.shortDescription}
                      </p>
                      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                        <span className="text-sm font-semibold text-white">
                          {course.price > 0 ? formatPrice(course.discountPrice ?? course.price) : 'Free'}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-white/40">
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
