'use client';
import { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Check, X } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('');
  const [editingRateId, setEditingRateId] = useState<string | null>(null);
  const [editRateValue, setEditRateValue] = useState('');
  const [savingRate, setSavingRate] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    setUsers(await res.json());
  };

  const updateRole = async (id: string) => {
    const user = users.find(u => u.id === id);
    await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, role: editRole }),
    });
    setEditingId(null);
    fetchUsers();
  };

  const updateCommissionRate = async (id: string) => {
    setSavingRate(true);
    const user = users.find(u => u.id === id);
    await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...user, commissionRate: parseFloat(editRateValue) }),
    });
    setEditingRateId(null);
    setSavingRate(false);
    fetchUsers();
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-black text-white tracking-tight mb-8">Manage Users</h1>
      <div className="rounded-xl border border-white/[0.07] bg-slate-950/40 overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 w-full pl-9"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/[0.06] bg-white/[0.02]">
              <tr>
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Name</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Email</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Role</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Commission</th>
                <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-500">Joined</th>
                <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-widest text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-200">{u.firstName} {u.lastName}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{u.email}</td>
                  <td className="px-6 py-4">
                    {editingId === u.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={editRole}
                          onChange={e => setEditRole(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-teal-500/50 w-32"
                        >
                          <option value="CUSTOMER">Customer</option>
                          <option value="INSTRUCTOR">Instructor</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                        <button onClick={() => updateRole(u.id)} className="text-xs text-teal-400 font-semibold">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-xs text-slate-500">Cancel</button>
                      </div>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        u.role === 'INSTRUCTOR' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-teal-500/10 text-teal-400 border-teal-500/20'
                      }`}>{u.role}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {u.role === 'INSTRUCTOR' ? (
                      editingRateId === u.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editRateValue}
                            onChange={e => setEditRateValue(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') updateCommissionRate(u.id);
                              if (e.key === 'Escape') setEditingRateId(null);
                            }}
                            className="bg-white/5 border border-white/10 rounded-lg px-2 py-0.5 text-xs text-slate-300 focus:outline-none focus:border-teal-500/50 w-16"
                            autoFocus
                          />
                          <span className="text-xs text-slate-500">%</span>
                          <button onClick={() => updateCommissionRate(u.id)} disabled={savingRate} className="p-1 text-teal-400 hover:bg-teal-500/10 rounded">
                            <Check size={12} />
                          </button>
                          <button onClick={() => setEditingRateId(null)} className="p-1 text-slate-500 hover:text-slate-300 rounded">
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingRateId(u.id); setEditRateValue(String(u.commissionRate ?? 70)); }}
                          className="text-xs font-semibold text-teal-400 hover:underline"
                          title="Click to edit commission rate"
                        >
                          {u.commissionRate ?? 70}%
                        </button>
                      )
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(u.createdAt).toLocaleDateString('en-GB')}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setEditingId(u.id); setEditRole(u.role); }} className="p-2 text-slate-500 hover:text-teal-400 transition-colors"><Edit size={16} /></button>
                    <button onClick={() => deleteUser(u.id)} className="p-2 text-slate-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
