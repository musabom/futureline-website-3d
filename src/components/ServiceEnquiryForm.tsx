'use client';
import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function ServiceEnquiryForm() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', tourType: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'FL Services' }),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ firstName: '', lastName: '', email: '', tourType: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-white/[0.04] border border-white/[0.1] rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-colors text-sm';

  if (status === 'sent') {
    return (
      <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-10 text-center">
        <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} className="text-teal-400" />
        </div>
        <h3 className="text-xl font-black text-white mb-2 tracking-tight">Enquiry Submitted!</h3>
        <p className="text-slate-400 text-sm mb-6">Our team will review your request and be in touch soon.</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-teal-400 text-sm font-bold hover:text-teal-300 transition-colors uppercase tracking-widest"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">First Name *</label>
          <input
            type="text"
            required
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className={inputClass}
            placeholder="First name"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Last Name *</label>
          <input
            type="text"
            required
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className={inputClass}
            placeholder="Last name"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email *</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass}
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Service Interest *</label>
        <select
          required
          value={form.tourType}
          onChange={(e) => setForm({ ...form, tourType: e.target.value })}
          className={`${inputClass} [&>option]:bg-slate-900 [&>option]:text-white`}
        >
          <option value="">Select a service</option>
          <option value="Digitalisation">Digitalisation</option>
          <option value="Workflow & Governance">Workflow &amp; Governance</option>
          <option value="Custom Dashboards">Custom Dashboards</option>
          <option value="Process Automation">Process Automation</option>
          <option value="Consulting">Consulting</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Message *</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`}
          placeholder="Tell us about your project or challenge..."
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:opacity-90 text-white py-3.5 rounded-lg font-bold transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 text-sm uppercase tracking-widest"
      >
        <Send size={15} />
        {status === 'sending' ? 'Submitting…' : 'Submit Enquiry'}
      </button>

      {status === 'error' && (
        <p className="text-red-400 text-xs text-center pt-1">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
