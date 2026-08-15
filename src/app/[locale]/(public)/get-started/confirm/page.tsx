import type { Metadata } from 'next';
import { ConfirmPanel } from '@/components/get-started/ConfirmPanel';

export const metadata: Metadata = {
  title: 'Request Received — FutureLine.ai',
  description: 'Your request has been received.',
};

// PLACEHOLDER page — see ConfirmPanel.tsx's doc comment. Real design
// pending a reference image from the user.
export default function GetStartedConfirmPage() {
  return <ConfirmPanel />;
}
