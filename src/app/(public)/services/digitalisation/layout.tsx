import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digitalisation — FutureLine Services | Workflow & Governance Systems',
  description: 'FutureLine designs customisable business applications that centralise operations, eliminate fragmented communication, and create measurable performance through governance and KPIs.',
  openGraph: {
    title: 'Digitalisation — FutureLine Services',
    description: 'Customisable business applications that centralise operations and create measurable performance through governance and KPIs.',
    type: 'website',
    url: '/services/digitalisation',
  },
};

export default function DigitalisationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
