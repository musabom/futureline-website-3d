'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const labelClass = 'block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2';
const selectClass = 'input-field [&>option]:bg-slate-900';

export default function NewInstructorCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [form, setForm] = useState({
    title: '', slug: '', shortDescription: '', fullDescription: '',
    deliveryType: 'ONLINE', category: '', level: 'Beginner',
    price: '0', discountPrice: '', durationHours: '',
    startDate: '', endDate: '', seatCapacity: '', location: '',
    status: 'DRAFT', marketingVideoUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'title' ? { slug: slugify(value) } : {}),
    }));
  };

  const handleFreeToggle = (free: boolean) => {
    setIsFree(free);
    if (free) {
      setForm(prev => ({ ...prev, price: '0', discountPrice: '' }));
    } else {
      setForm(prev => ({ ...prev, price: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
        alert('End date cannot be earlier than start date');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/instructor/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: isFree ? 0 : parseFloat(form.price) || 0,
          discountPrice: (!isFree && form.discountPrice) ? parseFloat(form.discountPrice) : null,
          durationHours: parseInt(form.durationHours) || 1,
          seatCapacity: form.seatCapacity ? parseInt(form.seatCapacity) : null,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
        }),
      });
      if (res.ok) {
        router.push('/instructor/courses');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create course');
      }
    } catch {
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link href="/instructor/courses" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-400 text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to My Courses
      </Link>
      <h1 className="text-2xl font-black text-white tracking-tight mb-1">Create New Course</h1>
      <p className="text-slate-500 text-sm mb-8">Your course will be submitted for admin approval before it goes live.</p>

      <form onSubmit={handleSubmit} className="rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm p-8 max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelClass}>Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="input-field" required />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} className="input-field" required />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Short Description</label>
            <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} className="input-field" rows={2} required />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Full Description</label>
            <textarea name="fullDescription" value={form.fullDescription} onChange={handleChange} className="input-field" rows={4} required />
          </div>
          <div>
            <label className={labelClass}>Delivery Type</label>
            <select name="deliveryType" value={form.deliveryType} onChange={handleChange} className={selectClass}>
              <option value="ONLINE">Online</option>
              <option value="IN_PERSON">In-Person</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input name="category" value={form.category} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className={labelClass}>Level</label>
            <select name="level" value={form.level} onChange={handleChange} className={selectClass}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Pricing */}
          <div className="md:col-span-2">
            <label className={labelClass}>Pricing</label>
            <div className="flex gap-3 mb-4">
              <button type="button" onClick={() => handleFreeToggle(true)}
                className={`px-5 py-2 rounded-lg text-sm font-bold border transition-all ${
                  isFree ? 'bg-teal-500/20 border-teal-500/40 text-teal-300' : 'border-white/[0.1] text-slate-500 hover:border-white/20 hover:text-slate-300'
                }`}>Free</button>
              <button type="button" onClick={() => handleFreeToggle(false)}
                className={`px-5 py-2 rounded-lg text-sm font-bold border transition-all ${
                  !isFree ? 'bg-teal-500/20 border-teal-500/40 text-teal-300' : 'border-white/[0.1] text-slate-500 hover:border-white/20 hover:text-slate-300'
                }`}>Paid</button>
            </div>
            {isFree ? (
              <div className="px-4 py-3 bg-teal-500/10 border border-teal-500/20 text-teal-300 rounded-lg text-sm font-medium">
                This course will be available for free.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Price (OMR)</label>
                  <div className="flex rounded-lg border border-white/[0.1] overflow-hidden focus-within:border-teal-500/50 bg-white/[0.04]">
                    <span className="px-3 border-r border-white/[0.08] flex items-center text-xs font-bold text-slate-500 whitespace-nowrap">OMR</span>
                    <input name="price" type="number" step="0.001" min="0" value={form.price} onChange={handleChange}
                      className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent text-white placeholder:text-slate-600"
                      placeholder="0.000" required={!isFree} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Discount Price (OMR) — optional</label>
                  <div className="flex rounded-lg border border-white/[0.1] overflow-hidden focus-within:border-teal-500/50 bg-white/[0.04]">
                    <span className="px-3 border-r border-white/[0.08] flex items-center text-xs font-bold text-slate-500 whitespace-nowrap">OMR</span>
                    <input name="discountPrice" type="number" step="0.001" min="0" value={form.discountPrice} onChange={handleChange}
                      className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent text-white placeholder:text-slate-600"
                      placeholder="0.000" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Duration (Hours)</label>
            <input name="durationHours" type="number" value={form.durationHours} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className={labelClass}>Start Date</label>
            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className={labelClass}>End Date</label>
            <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className={labelClass}>Seat Capacity</label>
            <input name="seatCapacity" type="number" value={form.seatCapacity} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input name="location" value={form.location} onChange={handleChange} className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Marketing Video URL (optional)</label>
            <input name="marketingVideoUrl" value={form.marketingVideoUrl} onChange={handleChange} className="input-field" placeholder="YouTube or Vimeo URL for course preview" />
            <p className="text-xs text-slate-600 mt-1.5">Paste a Vimeo or YouTube link that will display on the course detail page</p>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-white/[0.06]">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Submitting…' : 'Submit for Approval'}
          </button>
          <Link href="/instructor/courses" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
