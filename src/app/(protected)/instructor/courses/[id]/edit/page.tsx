'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditInstructorCoursePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isFree, setIsFree] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    fetch(`/api/instructor/courses/${params.id}`)
      .then(r => r.json())
      .then(course => {
        const free = course.price === 0;
        setIsFree(free);
        setForm({
          ...course,
          startDate: course.startDate ? new Date(course.startDate).toISOString().split('T')[0] : '',
          endDate: course.endDate ? new Date(course.endDate).toISOString().split('T')[0] : '',
          discountPrice: course.discountPrice || '',
          seatCapacity: course.seatCapacity || '',
          location: course.location || '',
        });
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
      if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
        alert('End date cannot be earlier than start date');
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/instructor/courses/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: isFree ? 0 : parseFloat(form.price) || 0,
          discountPrice: (!isFree && form.discountPrice) ? parseFloat(form.discountPrice) : null,
          durationHours: parseInt(form.durationHours) || 1,
          seatCapacity: form.seatCapacity ? parseInt(form.seatCapacity) : null,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          status: form.status, // Allow saving as DRAFT or ARCHIVED
        }),
      });
      if (res.ok) {
        router.push('/instructor/courses');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update course');
      }
    } catch {
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-12 text-gray-400">Loading...</div>;

  const canPublish = form.approvalStatus === 'APPROVED';

  return (
    <div>
      <Link href="/instructor/courses" className="flex items-center gap-2 text-gray-500 hover:text-navy mb-6 text-sm">
        <ArrowLeft size={16} /> Back to My Courses
      </Link>
      <h1 className="text-2xl font-bold text-navy mb-2">Edit Course</h1>
      <p className="text-gray-500 text-sm mb-8">
        {form.approvalStatus === 'PENDING' ? 'Your changes will be reviewed by an admin.' : 
         form.approvalStatus === 'REJECTED' ? 'Please address the rejection reason before resubmitting.' :
         'Course is approved and can be managed.'}
      </p>

      <form onSubmit={handleSubmit} className="card p-8 max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input name="title" value={form.title || ''} onChange={handleChange} className="input-field" required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <textarea name="shortDescription" value={form.shortDescription || ''} onChange={handleChange} className="input-field" rows={2} required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
            <textarea name="fullDescription" value={form.fullDescription || ''} onChange={handleChange} className="input-field" rows={4} required />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pricing</label>
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => handleFreeToggle(true)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                  isFree ? 'bg-teal text-white border-teal' : 'bg-white text-gray-500 border-gray-200 hover:border-teal'
                }`}
              >
                Free
              </button>
              <button
                type="button"
                onClick={() => handleFreeToggle(false)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                  !isFree ? 'bg-teal text-white border-teal' : 'bg-white text-gray-500 border-gray-200 hover:border-teal'
                }`}
              >
                Paid
              </button>
            </div>

            {!isFree && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Price (OMR)</label>
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-teal/30 focus-within:border-teal">
                    <span className="px-3 bg-gray-50 border-r border-gray-200 flex items-center text-sm font-semibold text-gray-500 whitespace-nowrap">OMR</span>
                    <input name="price" type="number" step="0.001" min="0" value={form.price || ''} onChange={handleChange} className="flex-1 px-3 py-2 text-sm outline-none bg-white" placeholder="0.000" required={!isFree} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Discount Price (OMR)</label>
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-teal/30 focus-within:border-teal">
                    <span className="px-3 bg-gray-50 border-r border-gray-200 flex items-center text-sm font-semibold text-gray-500 whitespace-nowrap">OMR</span>
                    <input name="discountPrice" type="number" step="0.001" min="0" value={form.discountPrice || ''} onChange={handleChange} className="flex-1 px-3 py-2 text-sm outline-none bg-white" placeholder="0.000" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={form.status || ''} onChange={handleChange} className="input-field">
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
              {canPublish && <option value="PUBLISHED">Published</option>}
            </select>
            {!canPublish && <p className="text-xs text-orange-500 mt-1">Admin approval required to publish</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Type</label>
            <select name="deliveryType" value={form.deliveryType || ''} onChange={handleChange} className="input-field">
              <option value="ONLINE">Online</option>
              <option value="IN_PERSON">In-Person</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/instructor/courses" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
