'use client';
import { useState, useEffect } from 'react';
import { Search, Users, BookOpen, ToggleLeft, ToggleRight, Percent, Save } from 'lucide-react';

interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string | null;
  commissionRate: number;
  isActive: boolean;
  createdAt: string;
  _count: { courses: number };
  totalStudents: number;
}

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRate, setEditRate] = useState<number>(70);
  const [saving, setSaving] = useState(false);

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
                  <tr key={instructor.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200 text-sm">{instructor.firstName} {instructor.lastName}</div>
                      <div className="text-xs text-slate-500">{instructor.email}</div>
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
    </div>
  );
}
