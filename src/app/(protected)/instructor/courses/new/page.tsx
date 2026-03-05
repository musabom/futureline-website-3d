'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewInstructorCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [form, setForm] = useState({
    title: '', slug: '', shortDescription: '', fullDescription: '',
    deliveryType: 'ONLINE', category: '', level: 'Beginner',
    price: '0', discountPrice: '', durationHours: '',
    startDate: '', endDate: '', seatCapacity: '', location: '',
    status: 'DRAFT',
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
      <Link href="/instructor/courses" className="flex items-center gap-2 text-gray-500 hover:text-navy mb-6 text-sm">
        <ArrowLeft size={16} /> Back to My Courses
      </Link>
      <h1 className="text-2xl font-bold text-navy mb-2">Create New Course</h1>
      <p className="text-gray-500 text-sm mb-8">Your course will be submitted for admin approval before it goes live.</p>

      <form onSubmit={handleSubmit} className="card p-8 max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="input-field" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} className="input-field" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} className="input-field" rows={2} required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
            <textarea name="fullDescription" value={form.fullDescription} onChange={handleChange} className="input-field" rows={4} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Type</label>
            <select name="deliveryType" value={form.deliveryType} onChange={handleChange} className="input-field">
              <option value="ONLINE">Online</option>
              <option value="IN_PERSON">In-Person</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input name="category" value={form.category} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select name="level" value={form.level} onChange={handleChange} className="input-field">
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pricing</label>
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => handleFreeToggle(true)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                  isFree
                    ? 'bg-teal text-white border-teal'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-teal'
                }`}
              >
                Free
              </button>
              <button
                type="button"
                onClick={() => handleFreeToggle(false)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                  !isFree
                    ? 'bg-teal text-white border-teal'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-teal'
                }`}
              >
                Paid
              </button>
            </div>

            {isFree ? (
              <div className="px-4 py-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                This course will be available for free.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Price (OMR)</label>
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-teal/30 focus-within:border-teal">
                    <span className="px-3 bg-gray-50 border-r border-gray-200 flex items-center text-sm font-semibold text-gray-500 whitespace-nowrap">OMR</span>
                    <input
                      name="price"
                      type="number"
                      step="0.001"
                      min="0"
                      value={form.price}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 text-sm outline-none bg-white"
                      placeholder="0.000"
                      required={!isFree}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Discount Price (OMR) — optional</label>
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-teal/30 focus-within:border-teal">
                    <span className="px-3 bg-gray-50 border-r border-gray-200 flex items-center text-sm font-semibold text-gray-500 whitespace-nowrap">OMR</span>
                    <input
                      name="discountPrice"
                      type="number"
                      step="0.001"
                      min="0"
                      value={form.discountPrice}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 text-sm outline-none bg-white"
                      placeholder="0.000"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Hours)</label>
            <input name="durationHours" type="number" value={form.durationHours} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seat Capacity</label>
            <input name="seatCapacity" type="number" value={form.seatCapacity} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input name="location" value={form.location} onChange={handleChange} className="input-field" />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Submitting...' : 'Submit for Approval'}
          </button>
          <Link href="/instructor/courses" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
