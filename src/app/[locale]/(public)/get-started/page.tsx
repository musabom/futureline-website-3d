import type { Metadata } from 'next';
import { PillarPicker } from '@/components/get-started/PillarPicker';

export const metadata: Metadata = {
  title: 'Get Started — FutureLine.ai',
  description:
    'Pick where you need FutureLine most — consulting, building applications, or training.',
  openGraph: {
    title: 'Get Started — FutureLine.ai',
    description: 'Pick where you need FutureLine most.',
    type: 'website',
    url: '/get-started',
  },
};

export default function GetStartedPage() {
  return <PillarPicker />;
}
