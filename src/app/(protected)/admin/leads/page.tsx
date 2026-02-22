'use client';
import { useState, useEffect } from 'react';
import { Search, Download, Filter } from 'lucide-react';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');

  useEffect(() => {
    fetch('/api/admin/leads').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setLeads(data);
    });
  }, []);

  const sources = ['all', ...Array.from(new Set(leads.map(l => l.source || 'FL Tourism')))];

  const filtered = leads.filter(l => {
    const matchesSearch =
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase()) ||
      l.tourType?.toLowerCase().includes(search.toLowerCase()) ||
      l.message?.toLowerCase().includes(search.toLowerCase());
    const matchesSource = sourceFilter === 'all' || (l.source || 'FL Tourism') === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Tour Type', 'Message', 'Source', 'Date'];
    const rows = filtered.map(l => [
      l.name, l.email, l.tourType, `"${(l.message || '').replace(/"/g, '""')}"`,
      l.source || 'FL Tourism',
      new Date(l.createdAt).toLocaleDateString('en-GB'),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'leads.csv'; a.click();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy">Leads</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} total enquiries</p>
        </div>
        <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 text-sm">
          <Download size={18} /> Export CSV
        </button>
      </div>
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="input-field !pl-10" />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="input-field !pl-10 min-w-[160px]">
              {sources.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All Sources' : s}</option>
              ))}
            </select>
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tour Type</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Source</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Message</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">No leads found</td>
              </tr>
            ) : (
              filtered.map(l => (
                <tr key={l.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-navy">{l.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{l.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{l.tourType}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-teal/10 text-teal">{l.source || 'FL Tourism'}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{l.message}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(l.createdAt).toLocaleDateString('en-GB')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
