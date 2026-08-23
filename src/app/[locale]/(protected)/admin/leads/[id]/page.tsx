'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Mail, Phone, Clock, Tag, User, MessageSquare,
  FileText, Send, Calendar, ChevronDown, Trash2, Plus
} from 'lucide-react';
import { Link } from '@/i18n/routing';

const STAGES = [
  { value: 'NEW', label: 'New', color: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
  { value: 'CONTACTED', label: 'Contacted', color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' },
  { value: 'OFFER_SENT', label: 'Offer Sent', color: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
  { value: 'FOLLOW_UP', label: 'Follow Up', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' },
  { value: 'NEGOTIATING', label: 'Negotiating', color: 'bg-orange-500/10 border-orange-500/20 text-orange-400' },
  { value: 'WON', label: 'Won', color: 'bg-teal-500/10 border-teal-500/20 text-teal-400' },
  { value: 'LOST', label: 'Lost', color: 'bg-red-500/10 border-red-500/20 text-red-400' },
];

const PRIORITIES = [
  { value: 'LOW', label: 'Low', color: 'bg-canvas-card text-ink-muted' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-500/10 text-blue-400' },
  { value: 'HIGH', label: 'High', color: 'bg-yellow-500/10 text-yellow-400' },
  { value: 'URGENT', label: 'Urgent', color: 'bg-red-500/10 text-red-400' },
];

const ACTIVITY_ICONS: Record<string, string> = {
  LEAD_CREATED: '🆕',
  STAGE_CHANGE: '📋',
  PRIORITY_CHANGE: '⚡',
  NOTE_ADDED: '📝',
  EMAIL_SENT: '📧',
  CALL: '📞',
  MESSAGE: '💬',
  OFFER_PREPARED: '📑',
  FOLLOW_UP_SCHEDULED: '⏰',
};

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [composedSubject, setComposedSubject] = useState('');
  const [composedBody, setComposedBody] = useState('');
  const [activityType, setActivityType] = useState('');
  const [activityDesc, setActivityDesc] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLead = () => {
    fetch(`/api/admin/leads/${params.id}`)
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data && data.id) setLead(data);
        setLoading(false);
      })
      .catch(() => setLoading(false)); // never leave the page stuck on the spinner
  };

  useEffect(() => {
    fetchLead();
    fetch('/api/admin/templates').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setTemplates(data);
    });
  }, [params.id]);

  const updateField = async (field: string, value: any) => {
    await fetch(`/api/admin/leads/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    });
    fetchLead();
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    await fetch(`/api/admin/leads/${params.id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newNote }),
    });
    setNewNote('');
    fetchLead();
  };

  const logActivity = async (type: string, description: string, metadata?: any) => {
    await fetch(`/api/admin/leads/${params.id}/activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, description, metadata }),
    });
    fetchLead();
  };

  const applyTemplate = (templateId: string) => {
    const tmpl = templates.find(t => t.id === templateId);
    if (!tmpl || !lead) return;
    setSelectedTemplate(templateId);
    let subject = tmpl.subject;
    let body = tmpl.body;
    const fullName = `${lead.firstName} ${lead.lastName}`.trim();
    subject = subject.replace(/\{\{name\}\}/g, fullName);
    subject = subject.replace(/\{\{email\}\}/g, lead.email);
    subject = subject.replace(/\{\{service\}\}/g, lead.tourType);
    body = body.replace(/\{\{name\}\}/g, fullName);
    body = body.replace(/\{\{email\}\}/g, lead.email);
    body = body.replace(/\{\{service\}\}/g, lead.tourType);
    setComposedSubject(subject);
    setComposedBody(body);
  };

  const handleComposeAction = async () => {
    await logActivity('EMAIL_SENT', `Email prepared: ${composedSubject}`, {
      subject: composedSubject,
      body: composedBody,
      templateId: selectedTemplate,
    });
    setShowCompose(false);
    setComposedSubject('');
    setComposedBody('');
    setSelectedTemplate('');
  };

  const handleLogActivity = async () => {
    if (!activityType || !activityDesc) return;
    await logActivity(activityType, activityDesc);
    setActivityType('');
    setActivityDesc('');
  };

  const deleteLead = async () => {
    if (!confirm('Are you sure you want to delete this lead? This cannot be undone.')) return;
    await fetch(`/api/admin/leads/${params.id}`, { method: 'DELETE' });
    router.push('/admin/leads');
  };

  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full" />
    </div>
  );
  if (!lead) return <div className="text-center py-12 text-ink-muted">Lead not found</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/leads" className="text-ink-muted hover:text-navy transition-colors"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-2xl font-black text-navy tracking-tight">{lead.firstName} {lead.lastName}</h1>
            {lead.company && <p className="text-sm text-ink-muted">{lead.company}</p>}
            <p className="text-sm text-ink-muted">{lead.email} {lead.phone && `· ${lead.phone}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowCompose(!showCompose)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-navy text-sm font-bold hover:opacity-90 transition-opacity">
            <Send size={14} /> Compose
          </button>
          <button onClick={deleteLead} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {showCompose && (
            <div className="rounded-xl border border-hairline bg-canvas-card backdrop-blur-sm p-5">
              <h3 className="font-semibold text-navy mb-4">Compose Message</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">Use Template</label>
                  <select value={selectedTemplate} onChange={e => applyTemplate(e.target.value)} className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50">
                    <option value="">Select a template...</option>
                    {templates.filter(t => t.isActive).map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.type})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">Subject</label>
                  <input type="text" value={composedSubject} onChange={e => setComposedSubject(e.target.value)} className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50" placeholder="Email subject..." />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">Message Body</label>
                  <textarea value={composedBody} onChange={e => setComposedBody(e.target.value)} className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50" rows={6} placeholder="Write your message..." />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-ink-muted">Message will be logged as activity. Connect email service to send automatically.</p>
                  <div className="flex gap-2">
                    <button onClick={() => setShowCompose(false)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-hairline text-ink-muted text-sm font-medium hover:bg-canvas-card transition-colors">Cancel</button>
                    <button onClick={handleComposeAction} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-navy text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50" disabled={!composedSubject}>
                      Log as Prepared
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-hairline bg-canvas-card backdrop-blur-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-navy">Pipeline Stage</h3>
            </div>
            <div className="flex gap-1">
              {STAGES.map((s) => (
                <button key={s.value} onClick={() => updateField('stage', s.value)}
                  className={`flex-1 py-2 text-xs font-medium rounded-lg border transition ${lead.stage === s.value ? s.color + ' ring-2 ring-offset-1 ring-offset-slate-950 ring-white/20' : 'bg-canvas-card border-hairline text-ink-muted hover:bg-canvas-card'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-hairline bg-canvas-card backdrop-blur-sm p-5">
            <h3 className="font-semibold text-navy mb-3">Original Message</h3>
            <div className="bg-canvas-card border border-hairline rounded-lg p-4">
              <div className="flex items-center gap-4 mb-3 text-sm text-ink-muted">
                <span><strong className="text-ink-muted">Interest:</strong> {lead.tourType}</span>
                <span><strong className="text-ink-muted">Source:</strong> {lead.source}</span>
                <span><strong className="text-ink-muted">Date:</strong> {new Date(lead.createdAt).toLocaleDateString('en-GB')}</span>
              </div>
              <p className="text-ink-muted whitespace-pre-wrap text-sm">{lead.message}</p>
            </div>
          </div>

          <div className="rounded-xl border border-hairline bg-canvas-card backdrop-blur-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-navy">Log Activity</h3>
            </div>
            <div className="flex gap-2">
              <select value={activityType} onChange={e => setActivityType(e.target.value)} className="bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted focus:outline-none focus:border-teal-500/50 w-40">
                <option value="">Type...</option>
                <option value="CALL">Phone Call</option>
                <option value="EMAIL_SENT">Email Sent</option>
                <option value="MESSAGE">Message</option>
                <option value="OFFER_PREPARED">Offer Prepared</option>
                <option value="FOLLOW_UP_SCHEDULED">Follow-Up Set</option>
              </select>
              <input type="text" value={activityDesc} onChange={e => setActivityDesc(e.target.value)} className="flex-1 bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50" placeholder="Describe the activity..." />
              <button onClick={handleLogActivity} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-navy text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50" disabled={!activityType || !activityDesc}>Log</button>
            </div>
          </div>

          <div className="rounded-xl border border-hairline bg-canvas-card backdrop-blur-sm p-5">
            <h3 className="font-semibold text-navy mb-4">Notes</h3>
            <div className="flex gap-2 mb-4">
              <input type="text" value={newNote} onChange={e => setNewNote(e.target.value)} className="flex-1 bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50"
                placeholder="Add a note..." onKeyDown={e => e.key === 'Enter' && addNote()} />
              <button onClick={addNote} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-navy text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50" disabled={!newNote.trim()}>
                <Plus size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {lead.notes?.map((note: any) => (
                <div key={note.id} className="bg-canvas-card border border-hairline rounded-lg p-3">
                  <p className="text-sm text-ink-muted">{note.content}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-ink-muted">
                    <span>{note.author ? `${note.author.firstName} ${note.author.lastName}`.trim() : 'System'}</span>
                    <span>·</span>
                    <span>{new Date(note.createdAt).toLocaleString('en-GB')}</span>
                  </div>
                </div>
              ))}
              {(!lead.notes || lead.notes.length === 0) && (
                <p className="text-sm text-ink-muted text-center py-4">No notes yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-hairline bg-canvas-card backdrop-blur-sm p-5">
            <h3 className="font-semibold text-navy mb-4">Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">Priority</label>
                <select value={lead.priority} onChange={e => updateField('priority', e.target.value)} className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted focus:outline-none focus:border-teal-500/50">
                  {PRIORITIES.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">Deal Value</label>
                <input type="number" value={lead.value || ''} onChange={e => updateField('value', e.target.value ? parseFloat(e.target.value) : null)}
                  className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50" placeholder="e.g. 2500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">Tags</label>
                <input type="text" value={lead.tags || ''} onChange={e => updateField('tags', e.target.value)}
                  className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50" placeholder="tourism, premium, repeat" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">Next Follow-Up</label>
                <input type="date" value={lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt).toISOString().split('T')[0] : ''}
                  onChange={e => updateField('nextFollowUpAt', e.target.value || null)} className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted focus:outline-none focus:border-teal-500/50" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">Last Contacted</label>
                <p className="text-sm text-ink-muted">
                  {lead.lastContactedAt ? new Date(lead.lastContactedAt).toLocaleString('en-GB') : 'Never'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-hairline bg-canvas-card backdrop-blur-sm p-5">
            <h3 className="font-semibold text-navy mb-4">Activity Timeline</h3>
            <div className="space-y-3">
              {lead.activities?.map((a: any) => (
                <div key={a.id} className="flex gap-3">
                  <div className="text-lg leading-none mt-0.5">{ACTIVITY_ICONS[a.type] || '📌'}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink-muted">{a.description}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{new Date(a.createdAt).toLocaleString('en-GB')}</p>
                  </div>
                </div>
              ))}
              {(!lead.activities || lead.activities.length === 0) && (
                <p className="text-sm text-ink-muted text-center py-4">No activity yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
