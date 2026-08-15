import type { Metadata } from 'next';
import { DetailsAuthForm } from '@/components/get-started/DetailsAuthForm';

export const metadata: Metadata = {
  title: 'Your Details — Get Started — FutureLine.ai',
  description: 'Tell us the details, and sign in or create an account.',
};

export default function GetStartedDetailsPage() {
  return <DetailsAuthForm />;
}
