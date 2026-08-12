'use client';
import { useState, useEffect } from 'react';
import { Brain, Save } from 'lucide-react';

export default function AISettingsPage() {
  const [settings, setSettings] = useState({ enabled: true, welcomeMessage: '' });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings/ai').then(r => r.json()).then(data => {
      if (data) setSettings(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/settings/ai', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: settings.enabled, welcomeMessage: settings.welcomeMessage }),
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">AI Settings</h1>
      </div>
      <form onSubmit={handleSubmit} className="rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm p-8 max-w-2xl space-y-6">
        <div className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Brain className="text-white" size={22} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-white">AI Recommendation Engine</div>
            <div className="text-sm text-slate-400">Enable AI-powered course recommendations</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={e => setSettings({...settings, enabled: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Welcome Message</label>
          <textarea
            value={settings.welcomeMessage}
            onChange={e => setSettings({...settings, welcomeMessage: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50"
            rows={3}
            placeholder="Message shown on AI recommendation page"
          />
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
            <Save size={16} /> {loading ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && <span className="text-sm text-teal-400 font-semibold">Settings saved!</span>}
        </div>
      </form>
    </div>
  );
}
