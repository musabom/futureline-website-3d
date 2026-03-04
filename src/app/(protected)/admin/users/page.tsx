'use client';
import { useState, useEffect } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('');

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
      <h1 className="text-2xl font-bold text-navy mb-8">Manage Users</h1>
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="input-field !pl-10" />
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 text-sm font-medium text-navy">{u.firstName} {u.lastName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                <td className="px-6 py-4">
                  {editingId === u.id ? (
                    <div className="flex items-center gap-2">
                      <select value={editRole} onChange={e => setEditRole(e.target.value)} className="input-field !py-1 !px-2 text-xs w-32">
                        <option value="CUSTOMER">Customer</option>
                        <option value="INSTRUCTOR">Instructor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <button onClick={() => updateRole(u.id)} className="text-xs text-teal font-semibold">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-xs text-gray-400">Cancel</button>
                    </div>
                  ) : (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      u.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' :
                      u.role === 'INSTRUCTOR' ? 'bg-blue-50 text-blue-600' :
                      'bg-green-50 text-green-600'
                    }`}>{u.role}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{new Date(u.createdAt).toLocaleDateString('en-GB')}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => { setEditingId(u.id); setEditRole(u.role); }} className="p-2 text-gray-400 hover:text-teal"><Edit size={16} /></button>
                  <button onClick={() => deleteUser(u.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
