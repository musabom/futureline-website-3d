'use client';
import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function ServiceEnquiryForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    tourType: '',
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

  if (status === 'sent') {
    return (
      <div className="rounded-md border border-lab/30 bg-lab/[0.04] p-10 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-lab/30 bg-lab/10">
          <CheckCircle size={24} className="text-lab" />
        </div>
        <h3 className="mb-2 text-2xl font-semibold tracking-[-0.01em] text-navy">
          Enquiry submitted.
        </h3>
        <p className="mb-8 text-sm leading-relaxed text-ink-muted">
          Our team will review your request and be in touch within one business day.
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
          <label className="fl-label" htmlFor="se-firstName">First name *</label>
          <input
            id="se-firstName"
            type="text"
            required
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="fl-input"
            placeholder="First name"
          />
        </div>
        <div>
          <label className="fl-label" htmlFor="se-lastName">Last name *</label>
          <input
            id="se-lastName"
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
        <label className="fl-label" htmlFor="se-email">Email *</label>
        <input
          id="se-email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="fl-input"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="fl-label" htmlFor="se-service">Service interest *</label>
        <select
          id="se-service"
          required
          value={form.tourType}
          onChange={(e) => setForm({ ...form, tourType: e.target.value })}
          className="fl-select"
        >
          <option value="">Select a service</option>
          <option value="Digitalisation">Digitalisation</option>
          <option value="Custom Software">Custom Software</option>
          <option value="Automations">Automations</option>
          <option value="Consultation">Consultation</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="fl-label" htmlFor="se-message">Message *</label>
        <textarea
          id="se-message"
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="fl-textarea"
          placeholder="Tell us what's slowing you down."
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="fl-submit"
        data-cursor="magnetic"
        data-cursor-strength="20"
      >
        <Send size={15} />
        {status === 'sending' ? 'Submitting…' : 'Submit enquiry'}
      </button>

      {status === 'error' && (
        <p className="pt-1 text-center text-xs text-red-400/90">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
