import type { Metadata } from 'next';
import GetStartedWizard from '@/components/GetStartedWizard';

export const metadata: Metadata = {
  title: 'Get Started — FutureLine.ai',
  description:
    'Pick where you need FutureLine most — consulting, building applications, or training — and tell us the details in three quick steps.',
  openGraph: {
    title: 'Get Started — FutureLine.ai',
    description: 'Pick an option, share the details, confirm — in three quick steps.',
    type: 'website',
    url: '/get-started',
  },
};

export default function GetStartedPage() {
  return <GetStartedWizard />;
}
