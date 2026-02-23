'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowLeft, X, FileText, Check } from 'lucide-react';
import Link from 'next/link';

const TEMPLATE_TYPES = ['WELCOME', 'PROPOSAL', 'FOLLOW_UP', 'CLOSING', 'THANK_YOU', 'CUSTOM'];

const AVAILABLE_VARS = [
  { key: '{{name}}', desc: 'Lead name' },
  { key: '{{email}}', desc: 'Lead email' },
  { key: '{{service}}', desc: 'Service/tour interest' },
  { key: '{{company}}', desc: 'Company name (FutureLine)' },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', type: 'WELCOME', subject: '', body: '', variables: '' });
  const [loading, setLoading] = useState(true);

  const fetchTemplates = () => {
    setLoading(true);
    fetch('/api/admin/templates').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setTemplates(data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchTemplates(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', type: 'WELCOME', subject: '', body: '', variables: '' });
    setShowForm(true);
  };

  const openEdit = (t: any) => {
    setEditing(t);
    setForm({ name: t.name, type: t.type, subject: t.subject, body: t.body, variables: t.variables || '' });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await fetch(`/api/admin/templates/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } else {
      await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    fetchTemplates();
  };

  const deleteTemplate = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    await fetch(`/api/admin/templates/${id}`, { method: 'DELETE' });
    fetchTemplates();
  };

  const toggleActive = async (t: any) => {
    await fetch(`/api/admin/templates/${t.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !t.isActive }),
    });
    fetchTemplates();
  };

  const typeColors: Record<string, string> = {
    WELCOME: 'bg-green-100 text-green-700',
    PROPOSAL: 'bg-purple-100 text-purple-700',
    FOLLOW_UP: 'bg-yellow-100 text-yellow-700',
    CLOSING: 'bg-blue-100 text-blue-700',
    THANK_YOU: 'bg-teal-100 text-teal-700',
    CUSTOM: 'bg-gray-100 text-gray-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/leads" className="text-gray-400 hover:text-navy"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-2xl font-bold text-navy">Email Templates</h1>
            <p className="text-sm text-gray-500 mt-1">Create reusable message templates for your funnel</p>
          </div>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> New Template
        </button>
      </div>

      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">Available Variables</h4>
        <div className="flex flex-wrap gap-3">
          {AVAILABLE_VARS.map(v => (
            <div key={v.key} className="bg-white rounded px-3 py-1.5 text-sm border border-blue-100">
              <code className="text-blue-600 font-mono text-xs">{v.key}</code>
              <span className="text-gray-500 ml-2 text-xs">{v.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy">{editing ? 'Edit Template' : 'New Template'}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Template Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="e.g. Welcome Email" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-field">
                  {TEMPLATE_TYPES.map(t => (
                    <option key={t} value={t}>{t.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Subject Line</label>
              <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="input-field" placeholder="e.g. Hi {{name}}, here's your personalised offer" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Message Body</label>
              <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} className="input-field" rows={8}
                placeholder="Dear {{name}},&#10;&#10;Thank you for your interest in {{service}}...&#10;&#10;Best regards,&#10;FutureLine Team" required />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
              <button type="submit" className="btn-primary text-sm">{editing ? 'Update' : 'Create'} Template</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {templates.map(t => (
          <div key={t.id} className={`card p-5 ${!t.isActive ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-navy">{t.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[t.type] || typeColors.CUSTOM}`}>
                    {t.type.replace('_', ' ')}
                  </span>
                  {!t.isActive && <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500">Inactive</span>}
                </div>
                <p className="text-sm text-gray-600 mb-1"><strong>Subject:</strong> {t.subject}</p>
                <p className="text-sm text-gray-500 line-clamp-2">{t.body}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button onClick={() => toggleActive(t)} className={`p-1.5 rounded ${t.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`} title={t.isActive ? 'Deactivate' : 'Activate'}>
                  <Check size={16} />
                </button>
                <button onClick={() => openEdit(t)} className="p-1.5 rounded text-gray-400 hover:bg-gray-50 hover:text-navy"><Edit2 size={16} /></button>
                <button onClick={() => deleteTemplate(t.id)} className="p-1.5 rounded text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
        {templates.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-400">
            <FileText size={48} className="mx-auto mb-3 opacity-50" />
            <p>No templates yet. Create your first template to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
