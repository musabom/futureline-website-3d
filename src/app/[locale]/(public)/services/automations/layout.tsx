import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Process Automation Services | Eliminate Repetitive Work — FutureLine',
  description:
    'FutureLine automates the repetitive tasks draining your team — data entry, approvals, notifications, reporting — so your people focus on work that actually matters. Live in weeks.',
  keywords: [
    'business process automation UK',
    'workflow automation for SMEs',
    'automate repetitive business tasks',
    'business automation consultancy',
    'RPA small business',
    'no-code automation services',
    'automate approvals and notifications',
    'AI business automation',
    'operational automation solutions',
    'automate data entry and reporting',
  ],
  openGraph: {
    title: 'Business Process Automation — FutureLine',
    description:
      'Stop paying people to do what machines can do better. FutureLine automates repetitive workflows so your team spends time on the work only humans can do.',
    type: 'website',
    url: '/services/automations',
  },
};

export default function AutomationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
