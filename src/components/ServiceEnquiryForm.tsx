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

  if (status === 'sent') {
    return (
      <div className="text-center py-8">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Enquiry Submitted!</h3>
        <p className="text-gray-300 mb-6">Our team will review your request and be in touch soon.</p>
        <button onClick={() => setStatus('idle')} className="text-teal font-semibold hover:underline">
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">First Name *</label>
          <input
            type="text"
            required
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
            placeholder="First name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Last Name *</label>
          <input
            type="text"
            required
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
            placeholder="Last name"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Email *</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Service Interest *</label>
        <select
          required
          value={form.tourType}
          onChange={(e) => setForm({ ...form, tourType: e.target.value })}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors"
        >
          <option value="" className="text-gray-900">Select a service</option>
          <option value="Digitalisation" className="text-gray-900">Digitalisation</option>
          <option value="Workflow & Governance" className="text-gray-900">Workflow & Governance</option>
          <option value="Custom Dashboards" className="text-gray-900">Custom Dashboards</option>
          <option value="Process Automation" className="text-gray-900">Process Automation</option>
          <option value="Consulting" className="text-gray-900">Consulting</option>
          <option value="Other" className="text-gray-900">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Message *</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors resize-none"
          placeholder="Tell us about your project or challenge..."
        />
      </div>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full bg-teal hover:bg-teal/90 text-white py-3.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <Send size={16} />
        {status === 'sending' ? 'Submitting...' : 'Submit Enquiry'}
      </button>
      {status === 'error' && (
        <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
