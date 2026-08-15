import type { Metadata } from 'next';
import { VisionMission } from '@/components/sections/VisionMission';

export const metadata: Metadata = {
  title: 'Vision & Mission — FutureLine.ai',
  description:
    'The vision and mission behind FutureLine — an Omani company turning AI from talk into practice.',
  openGraph: {
    title: 'Vision & Mission — FutureLine.ai',
    description: 'The vision and mission behind FutureLine.',
    type: 'website',
    url: '/about',
  },
};

// ThreeActStory used to render here too, but it has moved back to the home
// page (its original repo position, right after the hero) by request — so
// this page is Vision & Mission alone rather than showing the same pinned
// scroll section twice across the site.
export default function AboutPage() {
  return (
    <main className="fl-light relative bg-canvas text-ink">
      <div className="relative z-10">
        <VisionMission />
      </div>
    </main>
  );
}
