import type { Metadata } from 'next';
import { FaqAccordion } from '@/components/sections/FaqAccordion';

export const metadata: Metadata = {
  title: 'FAQ — FutureLine.ai',
  description:
    "Answers to common questions about FutureLine's AI consulting, applications, and training.",
  openGraph: {
    title: 'FAQ — FutureLine.ai',
    description: "Common questions about FutureLine's AI consulting, applications, and training.",
    type: 'website',
    url: '/faq',
  },
};

// Moved out of the home page so it gets its own page instead of stacking
// at the bottom of everything else — see HANDOFF.md and the Header/Footer
// link updates that point here now. FaqAccordion still emits its own
// FAQPage JSON-LD, unchanged.
export default function FaqPage() {
  return (
    <main className="fl-light relative bg-canvas text-ink">
      <FaqAccordion />
    </main>
  );
}
