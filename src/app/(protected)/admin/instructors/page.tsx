'use client';
import { Fragment, useState, useEffect } from 'react';
import { Search, Users, BookOpen, ToggleLeft, ToggleRight, Percent, Save, Pencil, UserPlus, X } from 'lucide-react';

interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string | null;
  image: string | null;
  commissionRate: number;
  isActive: boolean;
  createdAt: string;
  _count: { courses: number };
  totalStudents: number;
}

// Shape of the Add-Practitioner modal form state.
type NewPractitionerForm = {
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  bio: string;
};

const EMPTY_NEW_FORM: NewPractitionerForm = {
  firstName: '',
  lastName: '',
  email: '',
  image: '',
  bio: '',
};

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRate, setEditRate] = useState<number>(70);
  const [saving, setSaving] = useState(false);
  // Bio + image editor — separate state from the commission editor
  // so admin can have both open on different rows without clobbering
  // each other. Bio and image are edited together since they're the
  // two profile-display fields used by the public "Who teaches" band.
  const [editingBioId, setEditingBioId] = useState<string | null>(null);
  const [editBio, setEditBio] = useState<string>('');
  const [editImage, setEditImage] = useState<string>('');
  const [savingBio, setSavingBio] = useState(false);

  // Add-Practitioner modal state.
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<NewPractitionerForm>(EMPTY_NEW_FORM);
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const openAddModal = () => {
    setAddForm(EMPTY_NEW_FORM);
    setAddError(null);
    setAddOpen(true);
  };
  const closeAddModal = () => {
    if (addSaving) return; // don't close mid-save
    setAddOpen(false);
    setAddError(null);
  };
  const updateAddField = (field: keyof NewPractitionerForm, value: string) => {
    setAddForm((prev) => ({ ...prev, [field]: value }));
  };
  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddSaving(true);
    setAddError(null);
    try {
      const res = await fetch('/api/admin/instructors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setAddError(body.error ?? 'Failed to add practitioner.');
        return;
      }
      closeAddModal();
      fetchInstructors();
    } catch {
      setAddError('Network error. Please try again.');
    } finally {
      setAddSaving(false);
    }
  };

  useEffect(() => { fetchInstructors(); }, []);

  const fetchInstructors = async () => {
    const res = await fetch('/api/admin/instructors');
    const data = await res.json();
    setInstructors(data);
    setLoading(false);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await fetch(`/api/admin/instructors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !currentStatus }),
    });
    fetchInstructors();
  };

  const saveCommission = async (id: string) => {
    setSaving(true);
    await fetch(`/api/admin/instructors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commissionRate: editRate }),
    });
    setEditingId(null);
    fetchInstructors();
    setSaving(false);
  };

  const openBioEditor = (instructor: Instructor) => {
    setEditingBioId(instructor.id);
    setEditBio(instructor.bio ?? '');
    setEditImage(instructor.image ?? '');
  };

  const cancelBioEditor = () => {
    setEditingBioId(null);
    setEditBio('');
    setEditImage('');
  };

  const saveBio = async (id: string) => {
    setSavingBio(true);
    // Empty string → null so the column stays clean (Prisma writes null
    // for an empty string, but the explicit cast makes intent obvious).
    const nextBio = editBio.trim() === '' ? null : editBio.trim();
    const nextImage = editImage.trim() === '' ? null : editImage.trim();
    await fetch(`/api/admin/instructors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio: nextBio, image: nextImage }),
    });
    setEditingBioId(null);
    setEditBio('');
    setEditImage('');
    fetchInstructors();
    setSavingBio(false);
  };

  const filtered = instructors.filter(i =>
    `${i.firstName} ${i.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Manage Instructors</h1>
          <p className="text-slate-400 text-sm mt-1">{instructors.length} instructors</p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg border border-teal-500/40 bg-teal-500/15 px-4 py-2 text-sm font-bold uppercase tracking-widest text-teal-300 hover:bg-teal-500/25 transition-colors"
        >
          <UserPlus size={16} />
          Add Practitioner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <Users size={24} className="text-teal-400" />
            </div>
            <div>
              <div className="text-3xl font-black text-white">{instructors.length}</div>
              <div className="text-sm text-slate-400">Total Instructors</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <BookOpen size={24} className="text-teal-400" />
            </div>
            <div>
              <div className="text-3xl font-black text-white">
                {instructors.reduce((sum, i) => sum + i._count.courses, 0)}
              </div>
              <div className="text-sm text-slate-400">Total Courses</div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <Percent size={24} className="text-teal-400" />
            </div>
            <div>
              <div className="text-3xl font-black text-white">
                {instructors.length > 0 ? Math.round(instructors.reduce((sum, i) => sum + i.commissionRate, 0) / instructors.length) : 0}%
              </div>
              <div className="text-sm text-slate-400">Avg. Instructor Share</div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.07] bg-slate-950/40 overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search instructors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 w-full pl-9"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/[0.06] bg-white/[0.02]">
              <tr>
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Instructor</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Courses</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Students</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Revenue Split</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-widest text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-600">No instructors found</td></tr>
              ) : (
                filtered.map((instructor) => (
                  <Fragment key={instructor.id}>
                  <tr className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200 text-sm">{instructor.firstName} {instructor.lastName}</div>
                      <div className="text-xs text-slate-500">{instructor.email}</div>
                      {/* Bio summary line — shows current bio (truncated) or
                          a placeholder. Click to expand the inline editor. */}
                      <button
                        type="button"
                        onClick={() => openBioEditor(instructor)}
                        className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-teal-400 transition-colors group"
                      >
                        <Pencil size={11} className="flex-shrink-0 opacity-60 group-hover:opacity-100" />
                        {instructor.bio
                          ? <span className="italic">{instructor.bio.length > 60 ? instructor.bio.slice(0, 60).trim() + '…' : instructor.bio}</span>
                          : <span className="uppercase tracking-widest font-bold">Add bio</span>}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{instructor._count.courses}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{instructor.totalStudents}</td>
                    <td className="px-6 py-4">
                      {editingId === instructor.id ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-slate-500">Instructor:</span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editRate}
                              onChange={e => setEditRate(Number(e.target.value))}
                              className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-slate-300 focus:outline-none focus:border-teal-500/50 w-16"
                            />
                            <span className="text-xs text-slate-500">%</span>
                          </div>
                          <span className="text-xs text-slate-500">You: {100 - editRate}%</span>
                          <button
                            onClick={() => saveCommission(instructor.id)}
                            disabled={saving}
                            className="p-1 text-teal-400 hover:bg-teal-500/10 rounded"
                          >
                            <Save size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingId(instructor.id); setEditRate(instructor.commissionRate); }}
                          className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          <span className="font-medium text-teal-400">{instructor.commissionRate}%</span>
                          <span className="text-slate-600"> / </span>
                          <span className="text-slate-500">{100 - instructor.commissionRate}% platform</span>
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        instructor.isActive
                          ? 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {instructor.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleActive(instructor.id, instructor.isActive)}
                        className={`p-2 rounded-lg transition-colors ${instructor.isActive ? 'text-teal-400 hover:bg-teal-500/10' : 'text-slate-500 hover:bg-white/5'}`}
                        title={instructor.isActive ? 'Disable instructor' : 'Enable instructor'}
                      >
                        {instructor.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                    </td>
                  </tr>
                  {/* Bio editor sub-row — only renders when this row's bio
                      is being edited. Full-width colspan textarea + Save /
                      Cancel. Used in the home-page "Who teaches" band on
                      /courses, and surfaces nowhere else. */}
                  {editingBioId === instructor.id && (
                    <tr className="border-b border-white/[0.04] bg-white/[0.015]">
                      <td colSpan={6} className="px-6 py-5">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-[160px_1fr]">
                          {/* Left: image URL input + live preview. */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                              Profile photo URL
                            </label>
                            <input
                              type="url"
                              value={editImage}
                              onChange={(e) => setEditImage(e.target.value)}
                              placeholder="https://…"
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50"
                            />
                            {/* Live preview — falls back to a soft hint when the
                                URL is empty or fails to load. */}
                            <div className="mt-3 flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
                              {editImage.trim() ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={editImage}
                                  alt="Preview"
                                  className="h-full w-full object-cover"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2'; }}
                                />
                              ) : (
                                <span className="text-[11px] text-slate-600">Preview</span>
                              )}
                            </div>
                          </div>
                          {/* Right: bio textarea. */}
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                              Bio
                            </label>
                            <textarea
                              value={editBio}
                              onChange={(e) => setEditBio(e.target.value)}
                              placeholder="e.g. AI Lead, ex-OmanTel. Built X for Y, Z, A. 8 years shipping production ML for clients in the region."
                              rows={6}
                              maxLength={2000}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 resize-y"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-4">
                          <p className="text-[11px] text-slate-500">
                            Shows in the <span className="text-slate-300">&quot;Who teaches&quot;</span> band on /courses. 1–2 sentences + a photo reads strongest.
                            <span className="ml-2 text-slate-600">{editBio.length}/2000</span>
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={cancelBioEditor}
                              disabled={savingBio}
                              className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-200 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => saveBio(instructor.id)}
                              disabled={savingBio}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/15 border border-teal-500/40 text-teal-400 text-xs font-bold uppercase tracking-widest hover:bg-teal-500/25 transition-colors disabled:opacity-50"
                            >
                              <Save size={13} />
                              {savingBio ? 'Saving…' : 'Save profile'}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm p-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Revenue Split Guide</h3>
        <p className="text-sm text-slate-500">
          The commission rate shows how much of each course sale goes to the instructor.
          For example, if set to 70%, the instructor receives 70% and FutureLine keeps 30%.
          This will apply when paid courses are enabled.
        </p>
      </div>

      {/* ── Add Practitioner modal ──────────────────────────────────
          Simple form for the critical fields: name, email, profile
          photo, bio. Role + password are handled server-side (role is
          forced to INSTRUCTOR; password is a hashed random secret —
          admin doesn't need to manage it). Backdrop click + Cancel
          both dismiss. Submitting closes the modal and refreshes the
          list. */}
      {addOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-practitioner-title"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <div
            onClick={closeAddModal}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />
          {/* Panel */}
          <form
            onSubmit={submitAdd}
            className="relative z-10 mx-4 w-full max-w-lg rounded-xl border border-white/[0.08] bg-slate-950 p-7 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.6)]"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 id="add-practitioner-title" className="text-xl font-black tracking-tight text-white">
                  Add Practitioner
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Creates a new instructor record that surfaces in the public &quot;Who teaches&quot; band on /courses.
                </p>
              </div>
              <button
                type="button"
                onClick={closeAddModal}
                disabled={addSaving}
                aria-label="Close"
                className="p-1.5 text-slate-500 hover:text-white transition-colors disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="np-first" className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  First name *
                </label>
                <input
                  id="np-first"
                  type="text"
                  value={addForm.firstName}
                  onChange={(e) => updateAddField('firstName', e.target.value)}
                  required
                  maxLength={50}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-teal-500/50 focus:outline-none"
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="np-last" className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Last name *
                </label>
                <input
                  id="np-last"
                  type="text"
                  value={addForm.lastName}
                  onChange={(e) => updateAddField('lastName', e.target.value)}
                  required
                  maxLength={50}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-teal-500/50 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="np-email" className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Email *
                </label>
                <input
                  id="np-email"
                  type="email"
                  value={addForm.email}
                  onChange={(e) => updateAddField('email', e.target.value)}
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-teal-500/50 focus:outline-none"
                  placeholder="sarah@example.com"
                />
                <p className="mt-1 text-[10px] text-slate-600">Used as the login email if they ever need to sign in.</p>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="np-image" className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Profile photo URL
                </label>
                <input
                  id="np-image"
                  type="url"
                  value={addForm.image}
                  onChange={(e) => updateAddField('image', e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-teal-500/50 focus:outline-none"
                  placeholder="https://… (paste a hosted image URL)"
                />
                {addForm.image.trim() && (
                  <div className="mt-2 flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={addForm.image}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2'; }}
                    />
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="np-bio" className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Bio
                </label>
                <textarea
                  id="np-bio"
                  value={addForm.bio}
                  onChange={(e) => updateAddField('bio', e.target.value)}
                  rows={3}
                  maxLength={2000}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-teal-500/50 focus:outline-none resize-y"
                  placeholder="1–2 sentences with employer + a credential reads strongest."
                />
                <p className="mt-1 text-[10px] text-slate-600">{addForm.bio.length}/2000</p>
              </div>
            </div>

            {addError && (
              <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {addError}
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeAddModal}
                disabled={addSaving}
                className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addSaving}
                className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-500/15 px-4 py-2 text-xs font-bold uppercase tracking-widest text-teal-300 hover:bg-teal-500/25 transition-colors disabled:opacity-50"
              >
                <UserPlus size={13} />
                {addSaving ? 'Adding…' : 'Add Practitioner'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
