import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FL Tourism — Authentic Oman Tours & Adventures | FutureLine',
  description: 'Discover Oman with authentic guided tours. 6-day adventure covering Muscat, Wadi Shab, Wahiba Sands desert, Jabal Akhdar, Nizwa forts, and Jabal Shams Grand Canyon.',
  openGraph: {
    title: 'FL Tourism — Authentic Oman Tours & Adventures',
    description: 'Discover Oman with authentic guided tours. Desert camps, mountain hikes, historical forts, and coastal wonders.',
    type: 'website',
    url: '/tourism',
  },
};

export default function TourismLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
