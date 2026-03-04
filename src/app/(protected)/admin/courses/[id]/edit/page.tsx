'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [isFree, setIsFree] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/courses/${params.id}`).then(r => r.json()),
      fetch('/api/admin/users?role=INSTRUCTOR').then(r => r.json()),
    ]).then(([course, insts]) => {
      const free = course.price === 0;
      setIsFree(free);
      setForm({
        ...course,
        startDate: course.startDate ? new Date(course.startDate).toISOString().split('T')[0] : '',
        endDate: course.endDate ? new Date(course.endDate).toISOString().split('T')[0] : '',
        discountPrice: course.discountPrice || '',
        seatCapacity: course.seatCapacity || '',
        instructorId: course.instructorId || '',
        location: course.location || '',
      });
      setInstructors(insts);
      setFetching(false);
    });
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFreeToggle = (free: boolean) => {
    setIsFree(free);
    if (free) {
      setForm((prev: any) => ({ ...prev, price: 0, discountPrice: '' }));
    } else {
      setForm((prev: any) => ({ ...prev, price: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/courses/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: isFree ? 0 : parseFloat(form.price),
          discountPrice: (!isFree && form.discountPrice) ? parseFloat(form.discountPrice) : null,
          durationHours: parseInt(form.durationHours),
          seatCapacity: form.seatCapacity ? parseInt(form.seatCapacity) : null,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          instructorId: form.instructorId || null,
        }),
      });
      if (res.ok) router.push('/admin/courses');
      else alert('Failed to update course');
    } catch {
      alert('Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  return (
    <div>
      <Link href="/admin/courses" className="flex items-center gap-2 text-gray-500 hover:text-navy mb-6 text-sm">
        <ArrowLeft size={16} /> Back to Courses
      </Link>
      <h1 className="text-2xl font-bold text-navy mb-8">Edit Course</h1>

      <form onSubmit={handleSubmit} className="card p-8 max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input name="title" value={form.title || ''} onChange={handleChange} className="input-field" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input name="slug" value={form.slug || ''} onChange={handleChange} className="input-field" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <textarea name="shortDescription" value={form.shortDescription || ''} onChange={handleChange} className="input-field" rows={2} required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
            <textarea name="fullDescription" value={form.fullDescription || ''} onChange={handleChange} className="input-field" rows={4} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Type</label>
            <select name="deliveryType" value={form.deliveryType || ''} onChange={handleChange} className="input-field">
              <option value="ONLINE">Online</option>
              <option value="IN_PERSON">In-Person</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input name="category" value={form.category || ''} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select name="level" value={form.level || ''} onChange={handleChange} className="input-field">
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
                      value={form.price || ''}
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
                      value={form.discountPrice || ''}
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
            <input name="durationHours" type="number" value={form.durationHours || ''} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
            <select name="instructorId" value={form.instructorId || ''} onChange={handleChange} className="input-field">
              <option value="">Select instructor</option>
              {instructors.map((i: any) => (
                <option key={i.id} value={i.id}>{i.firstName} {i.lastName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input name="startDate" type="date" value={form.startDate || ''} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input name="endDate" type="date" value={form.endDate || ''} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seat Capacity</label>
            <input name="seatCapacity" type="number" value={form.seatCapacity || ''} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input name="location" value={form.location || ''} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={form.status || ''} onChange={handleChange} className="input-field">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/admin/courses" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
