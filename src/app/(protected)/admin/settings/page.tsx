'use client';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import { Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="text-teal-400" size={28} />
        <h1 className="text-2xl font-black text-white tracking-tight">Admin Security Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ChangePasswordForm />
        </div>

        <div className="rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm p-6">
          <h3 className="text-sm font-bold text-white mb-4">Security Recommendations</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-teal-400 font-bold">•</span>
              Use a strong password with at least 12 characters.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400 font-bold">•</span>
              Include a mix of letters, numbers, and symbols.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400 font-bold">•</span>
              Change your password every 90 days.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-400 font-bold">•</span>
              Never share your admin credentials.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
