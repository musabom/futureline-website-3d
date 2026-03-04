'use client';
import { useState, useEffect } from 'react';
import { Palette, Save, Mail } from 'lucide-react';

export default function BrandSettingsPage() {
  const [settings, setSettings] = useState({ companyName: '', tagline: '', primaryColor: '', accentColor: '', logo: '', contactEmail: '', tourismEmail: '' });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings/brand').then(r => r.json()).then(data => {
      if (data) setSettings(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/admin/settings/brand', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: settings.companyName,
        tagline: settings.tagline,
        primaryColor: settings.primaryColor,
        accentColor: settings.accentColor,
        logo: settings.logo,
        contactEmail: settings.contactEmail,
        tourismEmail: settings.tourismEmail,
      }),
    });
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">Brand Settings</h1>
      <form onSubmit={handleSubmit} className="card p-8 max-w-2xl space-y-6">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-4">
          <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center">
            <Palette className="text-white" size={24} />
          </div>
          <div>
            <div className="font-semibold text-navy">Brand Identity</div>
            <div className="text-sm text-gray-500">Customize your platform appearance</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input value={settings.companyName} onChange={e => setSettings({...settings, companyName: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input value={settings.tagline} onChange={e => setSettings({...settings, tagline: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={settings.primaryColor} onChange={e => setSettings({...settings, primaryColor: e.target.value})} className="w-10 h-10 rounded cursor-pointer" />
              <input value={settings.primaryColor} onChange={e => setSettings({...settings, primaryColor: e.target.value})} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={settings.accentColor} onChange={e => setSettings({...settings, accentColor: e.target.value})} className="w-10 h-10 rounded cursor-pointer" />
              <input value={settings.accentColor} onChange={e => setSettings({...settings, accentColor: e.target.value})} className="input-field" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input value={settings.logo || ''} onChange={e => setSettings({...settings, logo: e.target.value})} className="input-field" placeholder="https://..." />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-2">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
            <div className="w-12 h-12 bg-brand-gradient rounded-xl flex items-center justify-center">
              <Mail className="text-white" size={24} />
            </div>
            <div>
              <div className="font-semibold text-navy">Contact Emails</div>
              <div className="text-sm text-gray-500">Public-facing email addresses shown on your website</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email (Services)</label>
              <input type="email" value={settings.contactEmail} onChange={e => setSettings({...settings, contactEmail: e.target.value})} className="input-field" placeholder="contact@example.com" />
              <p className="text-xs text-gray-400 mt-1">Used on Services and Digitalisation pages</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email (Tourism)</label>
              <input type="email" value={settings.tourismEmail} onChange={e => setSettings({...settings, tourismEmail: e.target.value})} className="input-field" placeholder="tourism@example.com" />
              <p className="text-xs text-gray-400 mt-1">Used on the FL Tourism page</p>
            </div>
          </div>
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
