'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Settings, Save, User, Shield, Lock } from 'lucide-react';
import ChangePasswordForm from '@/components/ChangePasswordForm';

export default function InstructorSettingsPage() {
  const { data: session } = useSession();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [commissionRate, setCommissionRate] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/instructor/profile');
        if (res.ok) {
          const data = await res.json();
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setBio(data.bio || '');
          setCommissionRate(data.commissionRate || 0);
          setIsActive(data.isActive);
        }
      } catch {
        setMessage({ type: 'error', text: 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/instructor/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, bio }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-canvas-card rounded w-1/3"></div>
          <div className="h-64 bg-canvas-card rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="text-teal-400" size={26} />
        <div>
          <h1 className="text-2xl font-black text-navy tracking-tight">Profile Settings</h1>
          <p className="text-ink-muted text-sm">Manage your instructor profile</p>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg text-sm border ${
          message.type === 'success'
            ? 'bg-teal-500/10 text-teal-400 border-teal-500/20'
            : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-6">
        <div className="rounded-xl border border-hairline bg-canvas-card backdrop-blur-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-teal-400" size={18} />
            <h2 className="text-lg font-semibold text-navy">Account Status</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-canvas-card border border-hairline rounded-lg p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                isActive
                  ? 'bg-teal-500/10 border-teal-500/20 text-teal-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="bg-canvas-card border border-hairline rounded-lg p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">Commission Rate</p>
              <p className="text-3xl font-black text-navy">{commissionRate}%</p>
              <p className="text-xs text-ink-muted mt-1">Set by admin</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-hairline bg-canvas-card backdrop-blur-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="text-teal-400" size={18} />
            <h2 className="text-lg font-semibold text-navy">Profile Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">Email</label>
              <input
                type="email"
                value={session?.user?.email || ''}
                disabled
                className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Tell students about yourself, your expertise, and teaching style..."
                className="w-full bg-canvas-card border border-hairline rounded-lg px-3 py-2 text-sm text-ink-muted placeholder:text-ink-muted focus:outline-none focus:border-teal-500/50"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-blue-600 text-navy text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        <div className="mt-2">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="text-teal-400" size={18} />
            <h2 className="text-lg font-semibold text-navy">Security</h2>
          </div>
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
