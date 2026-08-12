import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Technology & Digital Strategy Consultation | Expert Advice — FutureLine',
  description:
    'FutureLine provides honest, vendor-independent technology consultation for SMEs — helping you make the right decisions before spending a penny on software or development.',
  keywords: [
    'technology consultation for small business',
    'digital strategy consultancy UK',
    'IT strategy for SMEs',
    'technology roadmap consulting',
    'digital transformation advice',
    'independent technology consultant',
    'business technology strategy',
    'software selection consultancy',
    'IT decision making SME',
    'technology audit for business',
  ],
  openGraph: {
    title: 'Technology & Digital Strategy Consultation — FutureLine',
    description:
      'Before you spend a penny on software or development, get independent, expert advice on what your business actually needs. FutureLine consultation — no vendor bias, ever.',
    type: 'website',
    url: '/services/consultation',
  },
};

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
