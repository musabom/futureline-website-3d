'use client';
import { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/enrollments').then(r => r.json()).then(setEnrollments);
  }, []);

  const filtered = enrollments.filter(e =>
    `${e.user?.firstName || ''} ${e.user?.lastName || ''}`.toLowerCase().includes(search.toLowerCase()) ||
    e.course?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['Student Name', 'Email', 'Course', 'Progress', 'Completed', 'Date'];
    const rows = filtered.map(e => [
      `${e.user?.firstName || ''} ${e.user?.lastName || ''}`.trim(), e.user?.email, e.course?.title,
      `${Math.round(e.progressPercentage)}%`, e.completed ? 'Yes' : 'No',
      new Date(e.createdAt).toLocaleDateString('en-GB'),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'enrollments.csv'; a.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">Enrollments</h1>
        <button onClick={exportCSV} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-colors">
          <Download size={18} /> Export CSV
        </button>
      </div>
      <div className="rounded-xl border border-white/[0.07] bg-slate-950/40 overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 w-full pl-9"
            />
          </div>
        </div>
        <table className="w-full">
          <thead className="border-b border-white/[0.06] bg-white/[0.02]">
            <tr>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Student</th>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Course</th>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Progress</th>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Status</th>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-200">{e.user?.firstName} {e.user?.lastName}</div>
                  <div className="text-xs text-slate-500">{e.user?.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{e.course?.title}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-white/10 rounded-full h-2">
                      <div className="bg-teal-500 rounded-full h-2" style={{ width: `${e.progressPercentage}%` }} />
                    </div>
                    <span className="text-xs text-slate-500">{Math.round(e.progressPercentage)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                    e.completed
                      ? 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {e.completed ? 'Completed' : 'In Progress'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{new Date(e.createdAt).toLocaleDateString('en-GB')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
