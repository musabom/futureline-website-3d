import type { Metadata } from 'next';
import {
  ServiceDetailLayout,
  type ServiceDetailData,
} from '@/components/sections/ServiceDetailLayout';

export const metadata: Metadata = {
  title: 'Automations — FutureLine',
  description:
    'AI-powered workflows that eliminate manual work, cut errors, and free your team to focus on what actually grows the business.',
};

const data: ServiceDetailData = {
  eyebrow: 'FL · Lab · Automations',
  pageNumber: '03',
  heading: 'Robots do the boring.',
  subhead:
    'AI-powered workflows that eliminate manual work, cut errors, and free your team to focus on what actually grows the business. Approvals routed. Data synced. Reports written.',
  marqueeItems: [
    'AI workflows',
    'Approval routing',
    'Data sync',
    'Auto-reports',
    'No more chasing',
  ],
  painPoints: [
    {
      stat: '19 hrs / wk',
      headline: 'Time haemorrhage.',
      body: 'The average small-business team spends 19 hours per week on tasks a machine could do — data entry, copy-paste between tools, chasing approvals.',
    },
    {
      stat: '1 in 20',
      headline: 'Human error loops.',
      body: 'Every time a human re-enters data, the error rate is 1 in 20. Across thousands of records, your database is degrading. Automation is error-free, every time.',
    },
    {
      stat: '40% of tasks',
      headline: 'Staff doing robot work.',
      body: '40% of most job roles involve tasks that could be fully automated today. Your best people are spending their day on tasks that add zero unique value.',
    },
    {
      stat: '2.3 days',
      headline: 'Approval bottlenecks.',
      body: 'The average business approval takes 2.3 days of back-and-forth. Automation routes, notifies, and closes in minutes.',
    },
    {
      stat: '10× harder',
      headline: 'Growth constrained.',
      body: 'Manual processes mean adding revenue requires hiring more people. Automation breaks the linear relationship between growth and headcount.',
    },
    {
      stat: 'Always late',
      headline: 'Reporting last week.',
      body: 'When reports require a human to compile them, they’re always late and always about last week. Automated reporting means leadership always has today’s numbers.',
    },
  ],
  process: [
    {
      when: 'Week 1',
      title: 'Process audit',
      body: 'We shadow your operation. Find the repetitive tasks, the silent waste, the approvals that wait days. Map every loop.',
    },
    {
      when: 'Week 2',
      title: 'Design & agree',
      body: 'We propose what to automate, in what order, and what stays human. You approve the priority list before we build.',
    },
    {
      when: 'Weeks 2–4',
      title: 'Build & test',
      body: 'Each automation goes live one at a time. Your team sees value within days, not at the end of a project.',
    },
    {
      when: 'Week 4+',
      title: 'Live & maintained',
      body: 'Logging, error handling, and human escalation paths are built in. We monitor for the first month, then hand over.',
    },
  ],
  deliverables: [
    'Approval and sign-off workflows that route themselves',
    'Data entry and sync between your tools',
    'Smart notifications and alerts',
    'Automated report generation — daily, weekly, monthly',
    'Client and customer communications on autopilot',
    'AI-powered automation where the rules are fuzzy',
    'Full audit trail and human escalation paths',
  ],
  industries: [
    {
      name: 'Oil & Gas',
      pain: 'Automated permit workflows, HSE incident routing, and shift handover notifications.',
    },
    {
      name: 'Construction',
      pain: 'Automated snag tracking, material order approvals, and subcontractor payment workflows.',
    },
    {
      name: 'Government & Public Sector',
      pain: 'Citizen enquiry routing, document processing, and compliance reporting automated to cut admin.',
    },
    {
      name: 'Education & Training',
      pain: 'Enrolment confirmations, attendance alerts, and exam notifications sent without manual effort.',
    },
    {
      name: 'SMEs Scaling Operations',
      pain: 'Replace the daily manual tasks your team hates most — quotes, follow-ups, internal approvals.',
    },
  ],
  stats: [
    { value: '19hrs', label: 'Reclaimed weekly', sub: 'Hours per team typically freed up by automation across roles.' },
    { value: '2–4 wks', label: 'First go-live', sub: 'First automation in production within two weeks, not two quarters.' },
    { value: 'Error-free', label: 'Quality', sub: 'Automated steps don’t mistype, don’t forget, don’t miss days.' },
  ],
  faqs: [
    {
      q: 'Our processes are too complicated to automate.',
      a: 'We’ve heard this every time. Complex processes are exactly what automation is designed for — because the more steps involved, the more time and error risk you’re carrying. We start simple and build up, so complexity is managed, not avoided.',
    },
    {
      q: 'What if the automation makes a mistake?',
      a: 'Every automation we build has error handling, logging, and human escalation paths built in. When an edge case occurs, it routes to a human rather than silently failing. You have full visibility of every action taken.',
    },
    {
      q: 'Will it replace our people?',
      a: 'Almost never. Automation replaces repetitive tasks, not roles. Your team gets their time back for the work that actually requires judgement, creativity, and relationships.',
    },
    {
      q: 'How do we maintain it once it’s live?',
      a: 'We document everything and can train your team to extend the automations. Most of our clients keep us on a small monthly support package — not as a dependency, but as cheap insurance.',
    },
  ],
  cta: {
    eyebrow: '06 — Start',
    headline: 'Give your team their day back.',
    sub: 'Get a free audit. We find the three highest-impact automations in your operation — and tell you what each would save in time and money.',
    primary: { label: 'Get a free audit', href: '/services/consultation' },
    secondary: { label: 'All services', href: '/services' },
  },
};

export default function AutomationsPage() {
  return <ServiceDetailLayout data={data} />;
}
