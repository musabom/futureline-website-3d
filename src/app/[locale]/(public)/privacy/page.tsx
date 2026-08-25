import type { Metadata } from 'next';
import { LegalDocument } from '@/components/legal/LegalDocument';

export const metadata: Metadata = {
  title: 'Privacy Policy — FutureLine.ai',
  description:
    'How FutureLine collects, uses, stores and protects personal information across its website, courses and services.',
  openGraph: {
    title: 'Privacy Policy — FutureLine.ai',
    description: 'How FutureLine handles and protects your personal information.',
    type: 'website',
    url: '/privacy',
  },
};

export default function PrivacyPage() {
  return <LegalDocument namespace="privacy" />;
}
