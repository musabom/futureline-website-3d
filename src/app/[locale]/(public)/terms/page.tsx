import type { Metadata } from 'next';
import { LegalDocument } from '@/components/legal/LegalDocument';

export const metadata: Metadata = {
  title: 'Terms of Service — FutureLine.ai',
  description:
    'The terms governing use of the FutureLine website, courses, and services.',
  openGraph: {
    title: 'Terms of Service — FutureLine.ai',
    description: 'The terms governing use of the FutureLine website, courses, and services.',
    type: 'website',
    url: '/terms',
  },
};

export default function TermsPage() {
  return <LegalDocument namespace="terms" />;
}
