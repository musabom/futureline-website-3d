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

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">What is your goal?</label>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Learn AI, Become a web developer, Improve cybersecurity skills"
            className="input-field"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Your skill level</label>
          <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className="input-field" required>
            <option value="">Select level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Delivery preference</label>
          <select value={deliveryPref} onChange={(e) => setDeliveryPref(e.target.value)} className="input-field">
            <option value="">No preference</option>
            <option value="ONLINE">Online</option>
            <option value="IN_PERSON">In-Person</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Maximum budget</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g., 500"
            className="input-field"
          />
        </div>
        <div className="flex items-end">
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="animate-spin" size={18} /> Analysing...</> : 'Get Recommendations'}
          </button>
        </div>
      </form>

      {searched && (
        <div className="mt-10">
          {results.length === 0 ? (
            <p className="text-center text-gray-500">No matching courses found. Try adjusting your preferences.</p>
          ) : (
            <>
              <h3 className="text-xl font-bold text-navy mb-6 text-center">Recommended For You</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.map((course) => (
                  <Link href={`/courses/${course.slug}`} key={course.id} className="card overflow-hidden group">
                    <div className="h-32 bg-brand-gradient flex items-center justify-center">
                      <BookOpen className="text-white/50" size={32} />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-0.5 bg-teal/10 text-teal rounded-full">
                          {course.deliveryType.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-400">{course.level}</span>
                      </div>
                      <h4 className="font-bold text-navy mb-2 group-hover:text-teal transition-colors">{course.title}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{course.shortDescription}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-navy">
                          {formatPrice(course.discountPrice ?? course.price)}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> {course.durationHours}h</span>
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
