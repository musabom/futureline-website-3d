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
          <h1 className="text-2xl font-bold text-navy">Manage Instructors</h1>
          <p className="text-gray-500 mt-1">{instructors.length} instructors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-navy">{instructors.length}</div>
              <div className="text-sm text-gray-500">Total Instructors</div>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-50 text-green-600">
              <BookOpen size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-navy">
                {instructors.reduce((sum, i) => sum + i._count.courses, 0)}
              </div>
              <div className="text-sm text-gray-500">Total Courses</div>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600">
              <Percent size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-navy">
                {instructors.length > 0 ? Math.round(instructors.reduce((sum, i) => sum + i.commissionRate, 0) / instructors.length) : 0}%
              </div>
              <div className="text-sm text-gray-500">Avg. Instructor Share</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search instructors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Instructor</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Courses</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Students</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Revenue Split</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No instructors found</td></tr>
              ) : (
                filtered.map((instructor) => (
                  <tr key={instructor.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-navy text-sm">{instructor.firstName} {instructor.lastName}</div>
                      <div className="text-xs text-gray-400">{instructor.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{instructor._count.courses}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{instructor.totalStudents}</td>
                    <td className="px-6 py-4">
                      {editingId === instructor.id ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-400">Instructor:</span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editRate}
                              onChange={e => setEditRate(Number(e.target.value))}
                              className="input-field w-16 text-sm !py-1"
                            />
                            <span className="text-xs text-gray-400">%</span>
                          </div>
                          <span className="text-xs text-gray-400">You: {100 - editRate}%</span>
                          <button
                            onClick={() => saveCommission(instructor.id)}
                            disabled={saving}
                            className="p-1 text-teal hover:bg-teal/10 rounded"
                          >
                            <Save size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingId(instructor.id); setEditRate(instructor.commissionRate); }}
                          className="text-sm text-gray-600 hover:text-navy"
                        >
                          <span className="font-medium">{instructor.commissionRate}%</span>
                          <span className="text-gray-400"> / </span>
                          <span className="text-gray-400">{100 - instructor.commissionRate}% platform</span>
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        instructor.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {instructor.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleActive(instructor.id, instructor.isActive)}
                        className={`p-2 rounded-lg ${instructor.isActive ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
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

      <div className="mt-6 card p-6 bg-gray-50">
        <h3 className="text-sm font-semibold text-navy mb-2">Revenue Split Guide</h3>
        <p className="text-sm text-gray-500">
          The commission rate shows how much of each course sale goes to the instructor. 
          For example, if set to 70%, the instructor receives 70% and FutureLine keeps 30%.
          This will apply when paid courses are enabled.
        </p>
      </div>
    </div>
  );
}
