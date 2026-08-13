import type { Metadata } from 'next';
import { ThreeActStory } from '@/components/sections/ThreeActStory';
import { VisionMission } from '@/components/sections/VisionMission';

export const metadata: Metadata = {
  title: 'About — FutureLine.ai',
  description:
    'How FutureLine advises, builds, and trains — and the vision and mission behind an Omani company turning AI from talk into practice.',
  openGraph: {
    title: 'About FutureLine.ai',
    description: 'How we advise, build, and train — and the vision behind it.',
    type: 'website',
    url: '/about',
  },
};

// Moved out of the home page so the story/vision scroll sections get their
// own page instead of stacking on top of everything else — see HANDOFF.md
// and the Header/Footer link updates that point here now.
export default function AboutPage() {
  return (
    <main className="fl-light relative bg-canvas text-ink">
      <div className="relative z-10">
        <ThreeActStory />
        <VisionMission />
      </div>
    </main>
  );
}
