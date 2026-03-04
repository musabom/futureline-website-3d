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
        <h1 className="text-2xl font-bold text-navy">Enrollments</h1>
        <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 text-sm">
          <Download size={18} /> Export CSV
        </button>
      </div>
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="input-field !pl-10" />
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Progress</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(e => (
              <tr key={e.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-navy">{e.user?.firstName} {e.user?.lastName}</div>
                  <div className="text-xs text-gray-400">{e.user?.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{e.course?.title}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-teal rounded-full h-2" style={{ width: `${e.progressPercentage}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{Math.round(e.progressPercentage)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${e.completed ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                    {e.completed ? 'Completed' : 'In Progress'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{new Date(e.createdAt).toLocaleDateString('en-GB')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
