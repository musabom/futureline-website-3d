/**
 * AuditEnquiryForm — focused lead-capture for the "Get a free systems audit"
 * funnel. Lower-friction than ServiceEnquiryForm: no service-picker (the
 * audit is the entry point, not a service choice), no required message —
 * just first name, last name, email, and an optional one-liner.
 *
 * Posts to /api/leads with source='FL Audit Request' so submissions show
 * up in /admin/leads tagged distinctly from generic service enquiries.
 */
'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function AuditEnquiryForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          message: form.message.trim() || 'No detail provided — requested a systems audit.',
          tourType: 'Systems Audit',
          source: 'FL Audit Request',
        }),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          phone: '',
          message: '',
        });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="rounded-lg border border-lab/30 bg-lab/[0.04] p-10 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-lab/30 bg-lab/10">
          <CheckCircle size={24} className="text-lab" />
        </div>
        <h3 className="mb-2 text-2xl font-semibold tracking-[-0.01em] text-white">
          Audit request received.
        </h3>
        <p className="mb-8 text-sm leading-relaxed text-white/60">
          We&apos;ll review your details and be in touch within one business day to schedule a 30-minute call.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="font-mono text-[11px] uppercase tracking-[0.3em] text-lab transition-colors hover:text-lab-light"
          data-cursor="hover"
        >
          Submit another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="fl-label" htmlFor="ae-firstName">First name *</label>
          <input
            id="ae-firstName"
            type="text"
            required
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="fl-input"
            placeholder="First name"
          />
        </div>
        <div>
          <label className="fl-label" htmlFor="ae-lastName">Last name *</label>
          <input
            id="ae-lastName"
            type="text"
            required
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="fl-input"
            placeholder="Last name"
          />
        </div>
      </div>

      <div>
        <label className="fl-label" htmlFor="ae-email">Email *</label>
        <input
          id="ae-email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="fl-input"
          placeholder="you@example.com"
        />
      </div>

      {/* Company + Phone — both optional. Help the sales team qualify the
          lead but don't gate the submission on them. */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="fl-label" htmlFor="ae-company">
            Company <span className="text-white/40">(optional)</span>
          </label>
          <input
            id="ae-company"
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="fl-input"
            placeholder="Acme Co."
          />
        </div>
        <div>
          <label className="fl-label" htmlFor="ae-phone">
            Phone <span className="text-white/40">(optional)</span>
          </label>
          <input
            id="ae-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="fl-input"
            placeholder="+968 9765 3461"
          />
        </div>
      </div>

      <div>
        <label className="fl-label" htmlFor="ae-message">
          What slows you down? <span className="text-white/40">(optional)</span>
        </label>
        <textarea
          id="ae-message"
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="fl-textarea"
          placeholder="One line is enough. Paper trails, spreadsheet chaos, manual approvals…"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="fl-submit"
        data-cursor="magnetic"
        data-cursor-strength="22"
      >
        <Send size={15} />
        {status === 'sending' ? 'Submitting…' : 'Request my free audit'}
      </button>

      {status === 'error' && (
        <p className="pt-1 text-center text-xs text-red-400/90">
          Something went wrong. Please try again.
        </p>
      )}

      <p className="pt-2 text-center text-[11px] leading-relaxed text-white/45">
        No commitment. No pitch deck. We&apos;ll come back with an honest read on what to fix first.
      </p>
    </form>
  );
}
