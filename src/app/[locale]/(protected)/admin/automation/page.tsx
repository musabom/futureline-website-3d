'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowLeft, X, Zap, Clock, ArrowRight, ToggleLeft, ToggleRight, Play } from 'lucide-react';
import { Link } from '@/i18n/routing';

const TRIGGER_TYPES = [
  { value: 'STAGE_CHANGE', label: 'Lead stage changes' },
  { value: 'DAYS_INACTIVE', label: 'Days without contact' },
  { value: 'NEW_LEAD', label: 'New lead created' },
  { value: 'FOLLOW_UP_DUE', label: 'Follow-up date reached' },
];

const ACTION_TYPES = [
  { value: 'CHANGE_STAGE', label: 'Move to stage' },
  { value: 'SEND_TEMPLATE', label: 'Send email template' },
  { value: 'SET_PRIORITY', label: 'Change priority' },
  { value: 'ADD_TAG', label: 'Add tag' },
  { value: 'NOTIFY_TEAM', label: 'Notify team' },
  { value: 'SCHEDULE_FOLLOW_UP', label: 'Schedule follow-up' },
];

const STAGES = ['NEW', 'CONTACTED', 'OFFER_SENT', 'FOLLOW_UP', 'NEGOTIATING', 'WON', 'LOST'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export default function AutomationPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState('NEW_LEAD');
  const [triggerStage, setTriggerStage] = useState('NEW');
  const [triggerDays, setTriggerDays] = useState(3);
  const [actionType, setActionType] = useState('CHANGE_STAGE');
  const [actionStage, setActionStage] = useState('CONTACTED');
  const [actionTemplateId, setActionTemplateId] = useState('');
  const [actionPriority, setActionPriority] = useState('HIGH');
  const [actionTag, setActionTag] = useState('');
  const [actionFollowUpDays, setActionFollowUpDays] = useState(3);
  const [delayHours, setDelayHours] = useState(0);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/automation').then(r => r.json()),
      fetch('/api/admin/templates').then(r => r.json()),
    ]).then(([rulesData, templatesData]) => {
      if (Array.isArray(rulesData)) setRules(rulesData);
      if (Array.isArray(templatesData)) setTemplates(templatesData);
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setName(''); setDescription(''); setTriggerType('NEW_LEAD');
    setTriggerStage('NEW'); setTriggerDays(3); setActionType('CHANGE_STAGE');
    setActionStage('CONTACTED'); setActionTemplateId(''); setActionPriority('HIGH');
    setActionTag(''); setActionFollowUpDays(3); setDelayHours(0);
  };

  const openCreate = () => {
    setEditing(null);
    resetForm();
    setShowForm(true);
  };

  const openEdit = (r: any) => {
    setEditing(r);
    setName(r.name);
    setDescription(r.description || '');
    setTriggerType(r.triggerType);
    setDelayHours(r.delayHours);
    setActionType(r.actionType);

    const tc = r.triggerConfig as any;
    if (tc?.stage) setTriggerStage(tc.stage);
    if (tc?.days) setTriggerDays(tc.days);

    const ac = r.actionConfig as any;
    if (ac?.stage) setActionStage(ac.stage);
    if (ac?.templateId) setActionTemplateId(ac.templateId);
    if (ac?.priority) setActionPriority(ac.priority);
    if (ac?.tag) setActionTag(ac.tag);
    if (ac?.followUpDays) setActionFollowUpDays(ac.followUpDays);

    setShowForm(true);
  };

  const buildConfig = () => {
    let triggerConfig: any = {};
    if (triggerType === 'STAGE_CHANGE') triggerConfig = { stage: triggerStage };
    if (triggerType === 'DAYS_INACTIVE') triggerConfig = { days: triggerDays };

    let actionConfig: any = {};
    if (actionType === 'CHANGE_STAGE') actionConfig = { stage: actionStage };
    if (actionType === 'SEND_TEMPLATE') actionConfig = { templateId: actionTemplateId };
    if (actionType === 'SET_PRIORITY') actionConfig = { priority: actionPriority };
    if (actionType === 'ADD_TAG') actionConfig = { tag: actionTag };
    if (actionType === 'SCHEDULE_FOLLOW_UP') actionConfig = { followUpDays: actionFollowUpDays };

    return { triggerConfig, actionConfig };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { triggerConfig, actionConfig } = buildConfig();
    const payload = { name, description, triggerType, triggerConfig, actionType, actionConfig, delayHours };

    if (editing) {
      await fetch(`/api/admin/automation/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch('/api/admin/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    setShowForm(false);
    fetchData();
  };

  const deleteRule = async (id: string) => {
    if (!confirm('Delete this automation rule?')) return;
    await fetch(`/api/admin/automation/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const toggleActive = async (r: any) => {
    await fetch(`/api/admin/automation/${r.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !r.isActive }),
    });
    fetchData();
  };

  const describeTrigger = (r: any) => {
    const tc = r.triggerConfig as any;
    switch (r.triggerType) {
      case 'NEW_LEAD': return 'When a new lead is created';
      case 'STAGE_CHANGE': return `When lead moves to ${tc?.stage || '?'}`;
      case 'DAYS_INACTIVE': return `After ${tc?.days || '?'} days without contact`;
      case 'FOLLOW_UP_DUE': return 'When follow-up date is reached';
      default: return r.triggerType;
    }
  };

  const describeAction = (r: any) => {
    const ac = r.actionConfig as any;
    switch (r.actionType) {
      case 'CHANGE_STAGE': return `Move lead to ${ac?.stage || '?'}`;
      case 'SEND_TEMPLATE': {
        const tmpl = templates.find(t => t.id === ac?.templateId);
        return `Send "${tmpl?.name || 'template'}"`;
      }
      case 'SET_PRIORITY': return `Set priority to ${ac?.priority || '?'}`;
      case 'ADD_TAG': return `Add tag "${ac?.tag || '?'}"`;
      case 'NOTIFY_TEAM': return 'Notify team';
      case 'SCHEDULE_FOLLOW_UP': return `Schedule follow-up in ${ac?.followUpDays || '?'} days`;
      default: return r.actionType;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/admin/leads" className="text-ink-muted hover:text-navy transition-colors"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="text-2xl font-black text-navy tracking-tight">Automation Rules</h1>
            <p className="text-sm text-ink-muted mt-1">Set up automated actions for your marketing funnel</p>
          </div>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-navy text-sm font-bold hover:opacity-90 transition-opacity">
          <Plus size={16} /> New Rule
        </button>
      </div>

      <div className="mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
        <div className="flex items-start gap-3">
          <Zap size={16} className="text-yellow-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-yellow-400">Automation Ready</h4>
            <p className="text-xs text-yellow-400/70 mt-1">
              Rules are saved and ready to activate. Connect an email service (e.g. SendGrid, Resend) to enable automatic email sending.
              Stage changes, priority updates, and follow-up scheduling will work immediately.
            </p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="rounded-xl border border-hairline bg-canvas-card backdrop-blur-sm p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy">{editing ? 'Edit Rule' : 'New Automation Rule'}</h3>
            <button onClick={() => setShowForm(false)} className="text-ink-muted hover:text-navy transition-colors"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">Rule Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50" placeholder="e.g. Follow up on cold leads" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">Description</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50" placeholder="What this rule does..." />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                <h4 className="text-sm font-semibold text-blue-400 mb-3">When (Trigger)</h4>
                <div className="space-y-3">
                  <select value={triggerType} onChange={e => setTriggerType(e.target.value)} className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted focus:outline-none focus:border-teal-500/50">
                    {TRIGGER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  {triggerType === 'STAGE_CHANGE' && (
                    <select value={triggerStage} onChange={e => setTriggerStage(e.target.value)} className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted focus:outline-none focus:border-teal-500/50">
                      {STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  )}
                  {triggerType === 'DAYS_INACTIVE' && (
                    <div className="flex items-center gap-2">
                      <input type="number" value={triggerDays} onChange={e => setTriggerDays(parseInt(e.target.value))} className="bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted focus:outline-none focus:border-teal-500/50 w-20" min={1} />
                      <span className="text-sm text-ink-muted">days</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-teal-500/20 bg-teal-500/10 p-4">
                <h4 className="text-sm font-semibold text-teal-400 mb-3">Then (Action)</h4>
                <div className="space-y-3">
                  <select value={actionType} onChange={e => setActionType(e.target.value)} className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted focus:outline-none focus:border-teal-500/50">
                    {ACTION_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                  {actionType === 'CHANGE_STAGE' && (
                    <select value={actionStage} onChange={e => setActionStage(e.target.value)} className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted focus:outline-none focus:border-teal-500/50">
                      {STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  )}
                  {actionType === 'SEND_TEMPLATE' && (
                    <select value={actionTemplateId} onChange={e => setActionTemplateId(e.target.value)} className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted focus:outline-none focus:border-teal-500/50">
                      <option value="">Select template...</option>
                      {templates.filter(t => t.isActive).map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  )}
                  {actionType === 'SET_PRIORITY' && (
                    <select value={actionPriority} onChange={e => setActionPriority(e.target.value)} className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted focus:outline-none focus:border-teal-500/50">
                      {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  )}
                  {actionType === 'ADD_TAG' && (
                    <input type="text" value={actionTag} onChange={e => setActionTag(e.target.value)} className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50" placeholder="Tag name..." />
                  )}
                  {actionType === 'SCHEDULE_FOLLOW_UP' && (
                    <div className="flex items-center gap-2">
                      <input type="number" value={actionFollowUpDays} onChange={e => setActionFollowUpDays(parseInt(e.target.value))} className="bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted focus:outline-none focus:border-teal-500/50 w-20" min={1} />
                      <span className="text-sm text-ink-muted">days from now</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">Delay (hours before action executes)</label>
              <div className="flex items-center gap-2">
                <input type="number" value={delayHours} onChange={e => setDelayHours(parseInt(e.target.value))} className="bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted focus:outline-none focus:border-teal-500/50 w-24" min={0} />
                <span className="text-sm text-ink-muted">hours</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-hairline text-ink-muted text-sm font-medium hover:bg-canvas-card transition-colors">Cancel</button>
              <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-navy text-sm font-bold hover:opacity-90 transition-opacity">{editing ? 'Update' : 'Create'} Rule</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {rules.map(r => (
          <div key={r.id} className={`rounded-xl border border-hairline bg-canvas-card backdrop-blur-sm p-5 ${!r.isActive ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Zap size={16} className={r.isActive ? 'text-yellow-400' : 'text-ink-muted'} />
                  <h3 className="font-semibold text-navy">{r.name}</h3>
                  {!r.isActive && <span className="px-2 py-0.5 rounded-lg border border-hairline text-xs bg-canvas-card text-ink-muted">Paused</span>}
                </div>
                {r.description && <p className="text-sm text-ink-muted mb-2">{r.description}</p>}
                <div className="flex items-center gap-2 text-sm">
                  <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-1 rounded-lg text-xs">{describeTrigger(r)}</span>
                  <ArrowRight size={14} className="text-ink-muted" />
                  {r.delayHours > 0 && (
                    <>
                      <span className="bg-canvas-card border border-hairline text-ink-muted px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                        <Clock size={12} /> Wait {r.delayHours}h
                      </span>
                      <ArrowRight size={14} className="text-ink-muted" />
                    </>
                  )}
                  <span className="bg-teal-500/10 border border-teal-500/20 text-teal-400 px-2 py-1 rounded-lg text-xs">{describeAction(r)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button onClick={() => toggleActive(r)} className={`p-1.5 rounded-lg transition-colors ${r.isActive ? 'text-teal-400 hover:bg-teal-500/10' : 'text-ink-muted hover:bg-canvas-card'}`}>
                  {r.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
                <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg text-ink-muted hover:bg-canvas-card hover:text-navy transition-colors"><Edit2 size={16} /></button>
                <button onClick={() => deleteRule(r.id)} className="p-1.5 rounded-lg text-ink-muted hover:bg-red-500/10 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
        {rules.length === 0 && !loading && (
          <div className="text-center py-12 text-ink-muted">
            <Zap size={48} className="mx-auto mb-3 opacity-30" />
            <p>No automation rules yet. Create your first rule to automate your funnel.</p>
          </div>
        )}
      </div>
    </div>
  );
}
