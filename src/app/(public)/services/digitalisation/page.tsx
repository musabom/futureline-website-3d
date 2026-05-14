import type { Metadata } from 'next';
import {
  ServiceDetailLayout,
  type ServiceDetailData,
} from '@/components/sections/ServiceDetailLayout';

export const metadata: Metadata = {
  title: 'Digitalisation — FutureLine',
  description:
    'Replace paper trails and siloed spreadsheets with unified digital systems. One source of truth. Zero manual reconciliation. Done in weeks.',
};

const data: ServiceDetailData = {
  eyebrow: 'FL · Lab · Digitalisation',
  pageNumber: '01',
  heading: 'Paper out. Systems in.',
  subhead:
    'Replace paper trails and disconnected spreadsheets with unified digital workflows. One source of truth. Zero manual reconciliation. Live in weeks.',
  marqueeItems: [
    'Digital workflows',
    'One source of truth',
    'Audit trails',
    'Real-time dashboards',
    'No spreadsheet sprawl',
  ],
  painPoints: [
    {
      stat: '11 hrs / week',
      headline: 'Wasted hours.',
      body: 'Manual data entry alone costs the average SME employee 11 hours per week — time your competitors are spending on growth.',
    },
    {
      stat: '88% errors',
      headline: 'Spreadsheet risk.',
      body: '88% of spreadsheets contain critical errors. Every one is an unaudited liability sitting in someone’s inbox.',
    },
    {
      stat: 'Real-time: 0%',
      headline: 'Zero visibility.',
      body: 'You can’t manage what you can’t see. Decisions get made on yesterday’s data — or last month’s.',
    },
    {
      stat: '#1 churn cause',
      headline: 'Staff burnout.',
      body: 'Talented people leave when their job is admin, not work. Manual processes are the number-one cause of preventable staff turnover.',
    },
    {
      stat: '73% switch',
      headline: 'Lost customers.',
      body: '73% of customers will switch providers after a poor digital experience. A paper form is a poor digital experience.',
    },
    {
      stat: 'Growth blocked',
      headline: 'No scale path.',
      body: 'You can’t 10× your revenue with a process built for 2 people on WhatsApp. Manual is a ceiling, not a foundation.',
    },
  ],
  process: [
    {
      when: 'Week 1',
      title: 'Audit',
      body: 'We sit in your operation. Map every manual touchpoint, decision point, and bottleneck — nothing assumed.',
    },
    {
      when: 'Weeks 2–3',
      title: 'Design',
      body: 'We build the digital workflow. You approve every step before a line of code is written.',
    },
    {
      when: 'Weeks 3–5',
      title: 'Build & Test',
      body: 'Live system, trained team, zero disruption to daily operations. We go live when you’re confident.',
    },
    {
      when: 'Week 5+',
      title: 'Handover',
      body: 'It runs. You own it. We stay available — but most clients don’t need us after month one.',
    },
  ],
  deliverables: [
    'Centralised workflow management',
    'Role-based access and approvals',
    'Automated notifications and tracking',
    'Real-time dashboards and reporting',
    'Audit trail and governance visibility',
    'Scalable and secure architecture',
    'Optional AI knowledge assistant',
  ],
  industries: [
    {
      name: 'Oil & Gas',
      pain: 'Paper permits, HSE compliance, and field reporting going digital.',
    },
    {
      name: 'Construction',
      pain: 'Site diaries, snag lists, and subcontractor workflows — all tracked.',
    },
    {
      name: 'Government & Public Sector',
      pain: 'Service requests, approvals, and public records made accessible.',
    },
    {
      name: 'Education & Training',
      pain: 'Enrolment, attendance, and reporting off spreadsheets for good.',
    },
    {
      name: 'SMEs Scaling Operations',
      pain: 'Processes that worked at 5 people, redesigned to work at 50.',
    },
  ],
  stats: [
    { value: '11hrs', label: 'Saved per week', sub: 'Hours per employee reclaimed from manual data entry.' },
    { value: '5 wks', label: 'Average delivery', sub: 'Kickoff to live system, not 12-month enterprise build.' },
    { value: '$0', label: 'Recurring licence fees', sub: 'Custom systems mean no monthly software tax.' },
  ],
  faqs: [
    {
      q: 'We’ve tried software before and it didn’t work.',
      a: 'Off-the-shelf software is built for everyone, which means it fits no one perfectly. We build around your workflow, not the other way around. If it doesn’t fit how your team works, your team won’t use it — and we know that.',
    },
    {
      q: 'Sounds expensive. We can’t justify the cost right now.',
      a: 'Manual processes are already expensive — you’re just not seeing the invoice. At 11 hours of wasted admin per employee per week, the cost of NOT digitalising is far higher than our build fee. We can show you the numbers in the first session.',
    },
    {
      q: 'Our team won’t adopt new technology.',
      a: 'Because we build WITH your team — not for them. Every step is reviewed and approved by the people who will use it. We train your people before go-live. Adoption is a design problem, not a people problem.',
    },
    {
      q: 'We’re too busy to change right now.',
      a: 'That’s exactly when you need it most. The reason you’re too busy is because manual processes are consuming time you don’t have. We handle the build — your team’s involvement is minimal during delivery.',
    },
  ],
  cta: {
    eyebrow: '06 — Start',
    headline: 'Stop paying for paper.',
    sub: 'A free systems audit. We map every manual touchpoint and show you exactly what to fix first. No commitment, no jargon.',
    primary: { label: 'Get a free audit', href: '/services/consultation' },
    secondary: { label: 'All services', href: '/services' },
  },
};

export default function DigitalisationPage() {
  return <ServiceDetailLayout data={data} />;
}
