'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star } from 'lucide-react';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', role: '', content: '', rating: 5, featured: false });

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    const res = await fetch('/api/admin/testimonials');
    setTestimonials(await res.json());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/admin/testimonials/${editing.id}` : '/api/admin/testimonials';
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, rating: Number(form.rating) }) });
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', role: '', content: '', rating: 5, featured: false });
    fetchTestimonials();
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    fetchTestimonials();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-navy">Manage Testimonials</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', role: '', content: '', rating: 5, featured: false }); }} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-8 space-y-4">
          <h2 className="font-bold text-navy">{editing ? 'Edit' : 'New'} Testimonial</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" required />
            <input placeholder="Role/Title" value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="input-field" required />
            <textarea placeholder="Content" value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="input-field md:col-span-2" rows={3} required />
            <select value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})} className="input-field">
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Stars</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} /> Featured
          </label>
          <div className="flex gap-4">
            <button type="submit" className="btn-primary text-sm">{editing ? 'Save' : 'Create'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map(t => (
          <div key={t.id} className="card p-6">
            <div className="flex gap-1 mb-3">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="text-yellow-400 fill-yellow-400" size={14} />
              ))}
            </div>
            <p className="text-sm text-gray-600 mb-4">&ldquo;{t.content}&rdquo;</p>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-navy">{t.name}</div>
                <div className="text-xs text-gray-400">{t.role}</div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(t); setForm(t); setShowForm(true); }} className="p-1 text-gray-400 hover:text-teal"><Edit size={14} /></button>
                <button onClick={() => deleteTestimonial(t.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
