'use client';
import { useState, useEffect } from 'react';
import { Search, Download, Filter, Eye, ChevronRight, Phone, Mail, Clock, Tag, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

const STAGES = [
  { value: 'all', label: 'All Stages', color: 'bg-gray-100 text-gray-700' },
  { value: 'NEW', label: 'New', color: 'bg-blue-100 text-blue-700' },
  { value: 'CONTACTED', label: 'Contacted', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'OFFER_SENT', label: 'Offer Sent', color: 'bg-purple-100 text-purple-700' },
  { value: 'FOLLOW_UP', label: 'Follow Up', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'NEGOTIATING', label: 'Negotiating', color: 'bg-orange-100 text-orange-700' },
  { value: 'WON', label: 'Won', color: 'bg-green-100 text-green-700' },
  { value: 'LOST', label: 'Lost', color: 'bg-red-100 text-red-700' },
];

const PRIORITIES: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-blue-100 text-blue-600',
  HIGH: 'bg-orange-100 text-orange-600',
  URGENT: 'bg-red-100 text-red-600',
};

function getStageColor(stage: string) {
  return STAGES.find(s => s.value === stage)?.color || 'bg-gray-100 text-gray-700';
}

function getStageLabel(stage: string) {
  return STAGES.find(s => s.value === stage)?.label || stage;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [view, setView] = useState<'table' | 'pipeline'>('pipeline');
  const [loading, setLoading] = useState(true);

  const fetchLeads = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (stageFilter !== 'all') params.set('stage', stageFilter);
    if (sourceFilter !== 'all') params.set('source', sourceFilter);
    if (search) params.set('search', search);
    fetch(`/api/admin/leads?${params}`).then(r => r.json()).then(data => {
      if (Array.isArray(data)) setLeads(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchLeads(); }, [stageFilter, sourceFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const sources = ['all', ...Array.from(new Set(leads.map(l => l.source || 'FL Tourism')))];

  const filtered = leads.filter(l => {
    if (!search) return true;
    return (
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase()) ||
      l.tourType?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const stageCounts = STAGES.filter(s => s.value !== 'all').reduce((acc, s) => {
    acc[s.value] = leads.filter(l => l.stage === s.value).length;
    return acc;
  }, {} as Record<string, number>);

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Interest', 'Source', 'Stage', 'Priority', 'Message', 'Date'];
    const rows = filtered.map(l => [
      l.name, l.email, l.phone || '', l.tourType,
      l.source || 'FL Tourism', l.stage, l.priority,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      new Date(l.createdAt).toLocaleDateString('en-GB'),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'leads.csv'; a.click();
  };

  const updateLeadStage = async (leadId: string, newStage: string) => {
    await fetch(`/api/admin/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: newStage }),
    });
    fetchLeads();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy">CRM Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">{leads.length} total leads</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setView('pipeline')} className={`px-3 py-1.5 text-sm ${view === 'pipeline' ? 'bg-navy text-white' : 'bg-white text-gray-600'}`}>Pipeline</button>
            <button onClick={() => setView('table')} className={`px-3 py-1.5 text-sm ${view === 'table' ? 'bg-navy text-white' : 'bg-white text-gray-600'}`}>Table</button>
          </div>
          <Link href="/admin/templates" className="btn-secondary text-sm">Templates</Link>
          <Link href="/admin/automation" className="btn-secondary text-sm">Automation</Link>
          <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 text-sm">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3 mb-6">
        {STAGES.filter(s => s.value !== 'all').map(s => (
          <button key={s.value} onClick={() => setStageFilter(stageFilter === s.value ? 'all' : s.value)}
            className={`rounded-lg p-3 text-center transition border-2 ${stageFilter === s.value ? 'border-navy' : 'border-transparent'} ${s.color}`}>
            <div className="text-2xl font-bold">{stageCounts[s.value] || 0}</div>
            <div className="text-xs font-medium mt-1">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="input-field !pl-10" />
        </form>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="input-field min-w-[160px]">
          {sources.map(s => (
            <option key={s} value={s}>{s === 'all' ? 'All Sources' : s}</option>
          ))}
        </select>
      </div>

      {view === 'pipeline' ? (
        <div className="grid grid-cols-7 gap-3">
          {STAGES.filter(s => s.value !== 'all').map(stage => {
            const stageLeads = filtered.filter(l => l.stage === stage.value);
            return (
              <div key={stage.value} className="bg-gray-50 rounded-lg p-3 min-h-[300px]">
                <div className={`text-xs font-semibold uppercase px-2 py-1 rounded mb-3 text-center ${stage.color}`}>
                  {stage.label} ({stageLeads.length})
                </div>
                <div className="space-y-2">
                  {stageLeads.map(lead => (
                    <Link key={lead.id} href={`/admin/leads/${lead.id}`}
                      className="block bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer">
                      <div className="font-medium text-sm text-navy truncate">{lead.name}</div>
                      <div className="text-xs text-gray-500 truncate mt-1">{lead.email}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${PRIORITIES[lead.priority] || ''}`}>
                          {lead.priority}
                        </span>
                        <span className="text-[10px] text-gray-400">{lead.tourType}</span>
                      </div>
                      {lead.nextFollowUpAt && (
                        <div className="flex items-center gap-1 mt-2 text-[10px] text-orange-600">
                          <Clock size={10} />
                          Follow up: {new Date(lead.nextFollowUpAt).toLocaleDateString('en-GB')}
                        </div>
                      )}
                    </Link>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="text-xs text-gray-400 text-center py-4">No leads</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Interest</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Source</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stage</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No leads found</td></tr>
              ) : (
                filtered.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3"><span className="font-medium text-navy">{l.name}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{l.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{l.tourType}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-teal/10 text-teal">{l.source}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select value={l.stage} onChange={e => updateLeadStage(l.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded border-0 cursor-pointer ${getStageColor(l.stage)}`}>
                        {STAGES.filter(s => s.value !== 'all').map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${PRIORITIES[l.priority] || ''}`}>{l.priority}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(l.createdAt).toLocaleDateString('en-GB')}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/leads/${l.id}`} className="text-teal hover:text-navy">
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
