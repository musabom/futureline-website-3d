import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services — FutureLine | Consulting & Operational Solutions',
  description: 'Practical solutions that improve how organisations operate, communicate, and deliver results. Digitalisation, consulting, and operational services.',
  openGraph: {
    title: 'Services — FutureLine',
    description: 'Practical solutions that improve how organisations operate, communicate, and deliver results.',
    type: 'website',
    url: '/services',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
