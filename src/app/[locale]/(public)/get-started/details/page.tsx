import type { Metadata } from 'next';
import { DetailsAuthForm } from '@/components/get-started/DetailsAuthForm';

export const metadata: Metadata = {
  title: 'Submit — Get Started — FutureLine.ai',
  description: 'Tell us where you need us most, and submit your request.',
};

export default function GetStartedDetailsPage() {
  return <DetailsAuthForm />;
}
