import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import {
  ServiceDetailLayout,
  type ServiceDetailData,
} from '@/components/sections/ServiceDetailLayout';

export const metadata: Metadata = {
  title: 'Automations — FutureLine',
  description:
    'AI-powered workflows that eliminate manual work, cut errors, and give your team their day back. Live in 4 weeks. Owned forever. No per-task fees.',
};

export default async function AutomationsPage() {
  const t = await getTranslations('servicePages.automations');

  const data: ServiceDetailData = {
    eyebrow: t('eyebrow'),
    pageNumber: '03',
    heading: t('heading'),
    subhead: t('subhead'),
    marqueeItems: t.raw('marqueeItems') as string[],
    painHeading: t('painHeading'),
    painPoints: t.raw('painPoints') as ServiceDetailData['painPoints'],
    processHeading: t('processHeading'),
    processSubhead: t('processSubhead'),
    process: t.raw('process') as ServiceDetailData['process'],
    techStack: t('techStack'),
    deliverablesHeading: t('deliverablesHeading'),
    deliverables: t.raw('deliverables') as string[],
    recentBuilds: t.raw('recentBuilds') as ServiceDetailData['recentBuilds'],
    buildVsBuy: t.raw('buildVsBuy') as ServiceDetailData['buildVsBuy'],
    commitment: t.raw('commitment') as ServiceDetailData['commitment'],
    stats: t.raw('stats') as ServiceDetailData['stats'],
    industries: t.raw('industries') as ServiceDetailData['industries'],
    faqs: t.raw('faqs') as ServiceDetailData['faqs'],
    cta: {
      eyebrow: t('cta.eyebrow'),
      headline: t('cta.headline'),
      sub: t('cta.sub'),
      primary: { label: t('cta.primaryLabel'), href: '/audit' },
      secondary: { label: t('cta.secondaryLabel'), href: '/services' },
    },
  };

  return <ServiceDetailLayout data={data} />;
}
