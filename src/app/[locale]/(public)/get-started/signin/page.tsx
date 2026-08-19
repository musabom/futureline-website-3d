import type { Metadata } from 'next';
import { SignInPanel } from '@/components/get-started/SignInPanel';

export const metadata: Metadata = {
  title: 'Sign in — Get Started — FutureLine.ai',
  description: 'Sign in with Google or your email to send your request.',
};

export default function GetStartedSignInPage() {
  return <SignInPanel />;
}
