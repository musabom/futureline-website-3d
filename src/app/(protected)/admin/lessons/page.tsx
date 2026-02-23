'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ courseId: '', moduleTitle: '', lessonTitle: '', videoUrl: '', content: '', resources: '', orderIndex: 1 });

  useEffect(() => {
    fetch('/api/admin/lessons').then(r => r.json()).then(setLessons);
    fetch('/api/admin/courses').then(r => r.json()).then(setCourses);
  }, []);

  const fetchLessons = async () => {
    const res = await fetch('/api/admin/lessons');
    setLessons(await res.json());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing ? `/api/admin/lessons/${editing.id}` : '/api/admin/lessons';
    const method = editing ? 'PUT' : 'POST';
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, orderIndex: Number(form.orderIndex) }) });
    setShowForm(false);
    setEditing(null);
    setForm({ courseId: '', moduleTitle: '', lessonTitle: '', videoUrl: '', content: '', resources: '', orderIndex: 1 });
    fetchLessons();
  };

  const deleteLesson = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    await fetch(`/api/admin/lessons/${id}`, { method: 'DELETE' });
    fetchLessons();
  };

  const startEdit = (lesson: any) => {
    setForm({ courseId: lesson.courseId, moduleTitle: lesson.moduleTitle, lessonTitle: lesson.lessonTitle, videoUrl: lesson.videoUrl || '', content: lesson.content || '', resources: lesson.resources || '', orderIndex: lesson.orderIndex });
    setEditing(lesson);
    setShowForm(true);
  };

  const filtered = lessons.filter(l => l.lessonTitle.toLowerCase().includes(search.toLowerCase()) || l.moduleTitle.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-navy">Manage Lessons</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ courseId: '', moduleTitle: '', lessonTitle: '', videoUrl: '', content: '', resources: '', orderIndex: 1 }); }} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> Add Lesson
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-8 space-y-4">
          <h2 className="font-bold text-navy">{editing ? 'Edit Lesson' : 'New Lesson'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select name="courseId" value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})} className="input-field" required>
              <option value="">Select Course</option>
              {courses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <input name="moduleTitle" placeholder="Module Title" value={form.moduleTitle} onChange={e => setForm({...form, moduleTitle: e.target.value})} className="input-field" required />
            <input name="lessonTitle" placeholder="Lesson Title" value={form.lessonTitle} onChange={e => setForm({...form, lessonTitle: e.target.value})} className="input-field" required />
            <input name="orderIndex" type="number" placeholder="Order" value={form.orderIndex} onChange={e => setForm({...form, orderIndex: Number(e.target.value)})} className="input-field" required />
            <input name="videoUrl" placeholder="YouTube or Vimeo URL (optional)" value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} className="input-field" />
            <input name="resources" placeholder="Resources (optional)" value={form.resources} onChange={e => setForm({...form, resources: e.target.value})} className="input-field" />
            <textarea name="content" placeholder="Lesson Content" value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="input-field md:col-span-2" rows={4} />
          </div>
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
            <input type="text" placeholder="Search lessons..." value={search} onChange={e => setSearch(e.target.value)} className="input-field !pl-10" />
          </div>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Module</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Lesson</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Order</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(l => (
              <tr key={l.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 text-sm text-gray-600">{l.course?.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{l.moduleTitle}</td>
                <td className="px-6 py-4 text-sm font-medium text-navy">{l.lessonTitle}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{l.orderIndex}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => startEdit(l)} className="p-2 text-gray-400 hover:text-teal"><Edit size={16} /></button>
                  <button onClick={() => deleteLesson(l.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
