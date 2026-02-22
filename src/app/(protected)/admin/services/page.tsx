'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', category: '', pricingModel: '', featured: false, status: 'ACTIVE' });

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    const res = await fetch('/api/admin/services');
    setServices(await res.json());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/admin/services/${editing.id}` : '/api/admin/services';
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShowForm(false);
    setEditing(null);
    setForm({ title: '', description: '', category: '', pricingModel: '', featured: false, status: 'ACTIVE' });
    fetchServices();
  };

  const deleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    fetchServices();
  };

  const startEdit = (service: any) => {
    setForm(service);
    setEditing(service);
    setShowForm(true);
  };

  const filtered = services.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-navy">Manage Services</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ title: '', description: '', category: '', pricingModel: '', featured: false, status: 'ACTIVE' }); }} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> Add Service
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-8 space-y-4">
          <h2 className="font-bold text-navy">{editing ? 'Edit Service' : 'New Service'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" required />
            <input name="category" placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field" required />
            <textarea name="description" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field md:col-span-2" rows={3} required />
            <input name="pricingModel" placeholder="Pricing Model" value={form.pricingModel} onChange={e => setForm({...form, pricingModel: e.target.value})} className="input-field" />
            <select name="status" value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-field">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} />
            Featured
          </label>
          <div className="flex gap-4">
            <button type="submit" className="btn-primary text-sm">{editing ? 'Save' : 'Create'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-secondary text-sm">Cancel</button>
          </div>
        </form>
      )}

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
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Category</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Featured</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(s => (
              <tr key={s.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 text-sm font-medium text-navy">{s.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{s.category}</td>
                <td className="px-6 py-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{s.status}</span></td>
                <td className="px-6 py-4 text-sm text-gray-600">{s.featured ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => startEdit(s)} className="p-2 text-gray-400 hover:text-teal"><Edit size={16} /></button>
                  <button onClick={() => deleteService(s.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
