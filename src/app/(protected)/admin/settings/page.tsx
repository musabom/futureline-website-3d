'use client';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import { Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="text-teal" size={28} />
        <h1 className="text-2xl font-bold text-navy">Admin Security Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <ChangePasswordForm />
        </div>
        
        <div className="card p-6 bg-blue-50 border-none">
          <h3 className="text-lg font-bold text-navy mb-4">Security Recommendations</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-teal font-bold">•</span>
              Use a strong password with at least 12 characters.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal font-bold">•</span>
              Include a mix of letters, numbers, and symbols.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal font-bold">•</span>
              Change your password every 90 days.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal font-bold">•</span>
              Never share your admin credentials.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
