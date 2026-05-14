import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom Software Development for SMEs | Built Around You — FutureLine',
  description:
    'FutureLine builds bespoke software tailored to your exact business operations — no bloated off-the-shelf tools, no monthly licensing fees. Owned by you, live in weeks.',
  keywords: [
    'custom software development UK',
    'bespoke software for small business',
    'custom business software',
    'custom web application development',
    'tailored software solutions SME',
    'bespoke software development company',
    'build custom software for my business',
    'custom internal tools development',
    'business management software development',
    'affordable custom software UK',
  ],
  openGraph: {
    title: 'Custom Software Development — FutureLine',
    description:
      'Off-the-shelf software was built for everyone — which means it fits no one. FutureLine builds software built exactly for your business, owned by you forever.',
    type: 'website',
    url: '/services/custom-software',
  },
};

export default function CustomSoftwareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
