'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const labelClass = 'block text-xs font-bold text-ink-muted uppercase tracking-widest mb-2';
const selectClass = 'input-field [&>option]:bg-canvas-alt';

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
        marketingVideoUrl: course.marketingVideoUrl || '',
        // Home-page highlight overrides. Stored on the Course as
        // `highlightBullets String[]` but we hydrate 4 individual
        // text-input fields here for a simpler form model. Packed back
        // into an array on submit.
        highlightStatValue: course.highlightStatValue || '',
        highlightStatLabel: course.highlightStatLabel || '',
        highlightBullet1: course.highlightBullets?.[0] || '',
        highlightBullet2: course.highlightBullets?.[1] || '',
        highlightBullet3: course.highlightBullets?.[2] || '',
        highlightBullet4: course.highlightBullets?.[3] || '',
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
      if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
        alert('End date cannot be earlier than start date');
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/admin/courses/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // Strip the form-only helper fields (highlightBullet1..4 are React
        // state shape, not real Course columns) BEFORE spreading. Prisma
        // throws on unknown fields. The packed `highlightBullets` array
        // is the real column.
        body: JSON.stringify((() => {
          const { highlightBullet1, highlightBullet2, highlightBullet3, highlightBullet4, ...rest } = form;
          return {
            ...rest,
            price: isFree ? 0 : parseFloat(form.price),
            discountPrice: (!isFree && form.discountPrice) ? parseFloat(form.discountPrice) : null,
            durationHours: parseInt(form.durationHours),
            seatCapacity: form.seatCapacity ? parseInt(form.seatCapacity) : null,
            startDate: form.startDate || null,
            endDate: form.endDate || null,
            instructorId: form.instructorId || null,
            highlightBullets: [
              highlightBullet1,
              highlightBullet2,
              highlightBullet3,
              highlightBullet4,
            ].filter((b: any) => typeof b === 'string' && b.trim().length > 0),
          };
        })()),
      });
      if (res.ok) {
        router.push('/admin/courses');
      } else {
        const body = await res.json().catch(() => ({}));
        alert(`Failed to update course: ${body.error ?? res.statusText}`);
      }
    } catch (e: any) {
      alert(`Failed to update course: ${e?.message ?? 'network error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-ink-muted text-sm font-medium animate-pulse">Loading course…</div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/courses" className="inline-flex items-center gap-2 text-ink-muted hover:text-teal-400 text-xs font-bold uppercase tracking-widest mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Courses
      </Link>
      <h1 className="text-2xl font-black text-navy tracking-tight mb-8">Edit Course</h1>

      <form onSubmit={handleSubmit} className="rounded-xl border border-hairline bg-canvas-card backdrop-blur-sm p-8 max-w-4xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelClass}>Title</label>
            <input name="title" value={form.title || ''} onChange={handleChange} className="input-field" required />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Slug</label>
            <input name="slug" value={form.slug || ''} onChange={handleChange} className="input-field" required />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Short Description</label>
            <textarea name="shortDescription" value={form.shortDescription || ''} onChange={handleChange} className="input-field" rows={2} required />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Full Description</label>
            <textarea name="fullDescription" value={form.fullDescription || ''} onChange={handleChange} className="input-field" rows={4} required />
          </div>
          <div>
            <label className={labelClass}>Delivery Type</label>
            <select name="deliveryType" value={form.deliveryType || ''} onChange={handleChange} className={selectClass}>
              <option value="ONLINE">Online</option>
              <option value="IN_PERSON">In-Person</option>
              <option value="HYBRID">Hybrid</option>
            </select>
            <p className="text-xs text-ink-muted mt-1.5">Where the course runs.</p>
          </div>
          <div>
            <label className={labelClass}>Course Format</label>
            <select name="courseFormat" value={form.courseFormat || 'COHORT'} onChange={handleChange} className={selectClass}>
              <option value="COHORT">Live cohort (fixed dates)</option>
              <option value="SELF_PACED">Self-paced / recorded</option>
              <option value="WORKSHOP">Workshop (one-time event)</option>
            </select>
            <p className="text-xs text-ink-muted mt-1.5">How the course runs in time. Self-paced courses skip dates.</p>
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input name="category" value={form.category || ''} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className={labelClass}>Level</label>
            <select name="level" value={form.level || ''} onChange={handleChange} className={selectClass}>
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
                  isFree ? 'bg-teal-500/20 border-teal-500/40 text-teal-300' : 'border-hairline text-ink-muted hover:border-hairline hover:text-ink-muted'
                }`}>Free</button>
              <button type="button" onClick={() => handleFreeToggle(false)}
                className={`px-5 py-2 rounded-lg text-sm font-bold border transition-all ${
                  !isFree ? 'bg-teal-500/20 border-teal-500/40 text-teal-300' : 'border-hairline text-ink-muted hover:border-hairline hover:text-ink-muted'
                }`}>Paid</button>
            </div>
            {isFree ? (
              <div className="px-4 py-3 bg-teal-500/10 border border-teal-500/20 text-teal-300 rounded-lg text-sm font-medium">
                This course will be available for free.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-ink-muted mb-1.5">Price (OMR)</label>
                  <div className="flex rounded-lg border border-hairline overflow-hidden focus-within:border-teal-500/50 bg-canvas-card">
                    <span className="px-3 border-r border-hairline flex items-center text-xs font-bold text-ink-muted whitespace-nowrap">OMR</span>
                    <input name="price" type="number" step="0.001" min="0" value={form.price || ''} onChange={handleChange}
                      className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent text-navy placeholder:text-ink-muted"
                      placeholder="0.000" required={!isFree} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink-muted mb-1.5">Discount Price (OMR) — optional</label>
                  <div className="flex rounded-lg border border-hairline overflow-hidden focus-within:border-teal-500/50 bg-canvas-card">
                    <span className="px-3 border-r border-hairline flex items-center text-xs font-bold text-ink-muted whitespace-nowrap">OMR</span>
                    <input name="discountPrice" type="number" step="0.001" min="0" value={form.discountPrice || ''} onChange={handleChange}
                      className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent text-navy placeholder:text-ink-muted"
                      placeholder="0.000" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Duration (Hours)</label>
            <input name="durationHours" type="number" value={form.durationHours || ''} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className={labelClass}>Instructor</label>
            <select name="instructorId" value={form.instructorId || ''} onChange={handleChange} className={selectClass}>
              <option value="">Select instructor</option>
              {instructors.map((i: any) => <option key={i.id} value={i.id}>{i.firstName} {i.lastName}</option>)}
            </select>
          </div>
          {/* Schedule fields — only render for COHORT/WORKSHOP formats.
              Self-paced courses skip them entirely. For COHORT/WORKSHOP,
              admin first picks the schedule status (Confirmed / TBC);
              dates only show when SCHEDULED. */}
          {form.courseFormat !== 'SELF_PACED' && (
            <>
              <div>
                <label className={labelClass}>Schedule Status</label>
                <select name="scheduleStatus" value={form.scheduleStatus || 'SCHEDULED'} onChange={handleChange} className={selectClass}>
                  <option value="SCHEDULED">Scheduled (dates confirmed)</option>
                  <option value="TBC">TBC (dates announced soon)</option>
                  <option value="COMPLETED">Past cohort (next one TBA)</option>
                </select>
                <p className="text-xs text-ink-muted mt-1.5">Catalog renders the right tag based on this.</p>
              </div>
              <div className="hidden md:block" />
              {form.scheduleStatus === 'SCHEDULED' && (
                <>
                  <div>
                    <label className={labelClass}>Start Date</label>
                    <input name="startDate" type="date" value={form.startDate || ''} onChange={handleChange} className="input-field" />
                  </div>
                  <div>
                    <label className={labelClass}>End Date</label>
                    <input name="endDate" type="date" value={form.endDate || ''} onChange={handleChange} className="input-field" />
                  </div>
                </>
              )}
            </>
          )}
          <div>
            <label className={labelClass}>Seat Capacity</label>
            <input name="seatCapacity" type="number" value={form.seatCapacity || ''} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input name="location" value={form.location || ''} onChange={handleChange} className="input-field" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Marketing Video URL (optional)</label>
            <input name="marketingVideoUrl" value={form.marketingVideoUrl || ''} onChange={handleChange} className="input-field" placeholder="YouTube or Vimeo URL for course preview" />
            <p className="text-xs text-ink-muted mt-1.5">Paste a Vimeo or YouTube link that will display on the course detail page</p>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select name="status" value={form.status || ''} onChange={handleChange} className={selectClass}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          {/* Feature on home — maps to the 3 admin-controlled positions in
              the home page NeuralPathway scene. Only one course per slot;
              assigning to a slot another course holds will transparently
              clear the prior holder (newest assignment wins). */}
          <div>
            <label className={labelClass}>Feature on home page</label>
            <select name="featuredSlot" value={form.featuredSlot ?? ''} onChange={handleChange} className={selectClass}>
              <option value="">Not featured</option>
              <option value="1">Featured — Position 1</option>
              <option value="2">Featured — Position 2</option>
              <option value="3">Featured — Position 3</option>
            </select>
            <p className="text-xs text-ink-muted mt-1.5">Shows on the home page Academy scene. Only one course per position.</p>
          </div>
        </div>

        {/* ── Home-page "What you'll learn" overrides ──────────────
            Optional. Only rendered when this course is in a featured
            slot. If left blank, the slot's hardcoded default bullets
            in NeuralPathway.tsx are used.  Grouped under a collapsed
            <details> so it doesn't clutter the form for the 99% of
            courses that won't be featured. */}
        <details className="rounded-lg border border-hairline bg-canvas-card p-5 group">
          <summary className="cursor-pointer text-sm font-bold text-ink-muted uppercase tracking-widest list-none flex items-center justify-between">
            Home-page feature highlights <span className="text-xs text-ink-muted normal-case tracking-normal font-normal">(optional — used when featured)</span>
            <span className="text-ink-muted transition-transform group-open:rotate-45">+</span>
          </summary>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Stat value</label>
              <input
                name="highlightStatValue"
                value={form.highlightStatValue || ''}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. 8 wks, Live, 10 hrs"
                maxLength={40}
              />
            </div>
            <div>
              <label className={labelClass}>Stat label</label>
              <input
                name="highlightStatLabel"
                value={form.highlightStatLabel || ''}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. Cohort length, Format"
                maxLength={40}
              />
            </div>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="md:col-span-2">
                <label className={labelClass}>Bullet {n}</label>
                <input
                  name={`highlightBullet${n}`}
                  value={form[`highlightBullet${n}`] || ''}
                  onChange={handleChange}
                  className="input-field"
                  placeholder={n === 1 ? 'e.g. Neural-network foundations' : ''}
                  maxLength={120}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-ink-muted mt-4">These appear on the home page Academy scene&apos;s right-hand &quot;What you&apos;ll learn&quot; card when this course is featured. Leave blank to inherit the slot&apos;s defaults.</p>
        </details>

        <div className="flex gap-4 pt-4 border-t border-hairline">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
          <Link href="/admin/courses" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
