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
      <h1 className="text-2xl font-bold text-navy mb-8">AI Settings</h1>
      <form onSubmit={handleSubmit} className="card p-8 max-w-2xl space-y-6">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center">
            <Brain className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-navy">AI Recommendation Engine</div>
            <div className="text-sm text-gray-500">Enable AI-powered course recommendations</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={e => setSettings({...settings, enabled: e.target.checked})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Welcome Message</label>
          <textarea
            value={settings.welcomeMessage}
            onChange={e => setSettings({...settings, welcomeMessage: e.target.value})}
            className="input-field"
            rows={3}
            placeholder="Message shown on AI recommendation page"
          />
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            <Save size={18} /> {loading ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && <span className="text-sm text-green-600 font-semibold">Settings saved!</span>}
        </div>
      </form>
    </div>
  );
}
