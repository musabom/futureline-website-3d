import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Business Digitalisation Services | Replace Manual Processes — FutureLine',
  description:
    'FutureLine digitalises your business operations — replacing paper, spreadsheets and WhatsApp chains with lean digital workflows your team actually uses. Live in 5 weeks.',
  keywords: [
    'business digitalisation services',
    'digital transformation for SMEs',
    'replace manual processes with digital systems',
    'paperless business solutions',
    'business workflow digitalisation',
    'operational digitalisation consultancy',
    'how to digitalise my business',
    'digital transformation UK',
    'business process automation',
  ],
  openGraph: {
    title: 'Business Digitalisation Services — FutureLine',
    description:
      'Stop running your business on spreadsheets and WhatsApp. FutureLine builds lean digital systems that go live in 5 weeks.',
    type: 'website',
    url: '/services/digitalisation',
  },
};

export default function DigitalisationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
