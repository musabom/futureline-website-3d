import type { Metadata } from 'next';
import {
  ServiceDetailLayout,
  type ServiceDetailData,
} from '@/components/sections/ServiceDetailLayout';

export const metadata: Metadata = {
  title: 'Custom Software — FutureLine',
  description:
    'Purpose-built platforms that do exactly what your business needs. No bloat. No recurring licence fees. No workarounds. Delivered in 6–10 weeks.',
};

const data: ServiceDetailData = {
  eyebrow: 'FL · Lab · Custom Software',
  pageNumber: '02',
  heading: 'Software that fits.',
  subhead:
    'Stop paying licence fees forever for tools that only half-fit. Purpose-built platforms shaped around how your team actually works. You own the code. No vendor lock-in.',
  marqueeItems: [
    'Custom platforms',
    'No licence fees',
    'You own the code',
    'No vendor lock-in',
    'Built around your team',
  ],
  painPoints: [
    {
      stat: '$12k / yr',
      headline: 'Licensing fees forever.',
      body: 'The average SME spends $12,000+ per year on SaaS — many for tools only half the team uses. You own nothing. Every renewal is a renegotiation.',
    },
    {
      stat: '3.5 hrs / day',
      headline: 'The workaround tax.',
      body: 'When software doesn’t fit your process, your team builds workarounds — copy-paste between tools, manual exports, re-entry. 3.5 hours a day, per person, wasted.',
    },
    {
      stat: '80% unused',
      headline: 'Features you’ll never use.',
      body: 'SMEs actively use only 20% of the features they pay for. The rest is bloat — confusing your team and slowing adoption.',
    },
    {
      stat: 'Zero control',
      headline: 'Vendor lock-in.',
      body: 'When your vendor raises prices, kills features, or shuts down — your business stops. You’re at their mercy. A tool you own can never be taken from you.',
    },
    {
      stat: '70% adoption fail',
      headline: 'Staff won’t use it.',
      body: '70% of enterprise software deployments fail due to low adoption. Generic tools feel foreign. Software built around your team’s language and workflow gets used.',
    },
    {
      stat: 'Growth blocked',
      headline: 'Can’t scale properly.',
      body: 'Off-the-shelf tools hit their limits when your business grows. You end up bolting tools together — fragile, expensive integrations that break under pressure.',
    },
  ],
  process: [
    {
      when: 'Weeks 1–2',
      title: 'Discovery',
      body: 'We sit with your team. Understand the workflow, the language, the edges. Write down what success looks like before anyone codes.',
    },
    {
      when: 'Weeks 2–3',
      title: 'Design & prototype',
      body: 'Interactive prototypes — not specs. You click through the system before it’s built. Changes here are nearly free.',
    },
    {
      when: 'Weeks 3–8',
      title: 'Build & test',
      body: 'Weekly demos. Real software, not screenshots. Your team uses it as it’s being built — adoption starts before launch.',
    },
    {
      when: 'Weeks 8–10',
      title: 'Launch & handover',
      body: 'Live system, trained team, documented codebase. You own it. No black box, no permanent dependency on us.',
    },
  ],
  deliverables: [
    'Operations dashboards built around your KPIs',
    'Field and mobile apps that work offline',
    'Client and customer portals',
    'Internal management tools that replace 3 SaaS subscriptions',
    'AI-powered features where they actually help',
    'Integrations with your existing stack',
    'Full source code and documentation',
  ],
  industries: [
    {
      name: 'Oil & Gas',
      pain: 'Custom permit systems, HSE dashboards, and contractor management portals built for your site.',
    },
    {
      name: 'Construction',
      pain: 'Project management, site diary, and subcontractor tracking that replaces generic platforms.',
    },
    {
      name: 'Government & Public Sector',
      pain: 'Citizen-facing service portals and internal workflow tools built to public-sector compliance.',
    },
    {
      name: 'Education & Training',
      pain: 'Student portals, LMS platforms, and enrolment systems that work how your institution works.',
    },
    {
      name: 'SMEs Scaling Fast',
      pain: 'Custom CRMs, operational tools, and client portals that grow with your business — not against it.',
    },
  ],
  stats: [
    { value: '6–10 wks', label: 'Time to launch', sub: 'Most builds live in 6–10 weeks. Committed up front — not a rolling estimate.' },
    { value: '12 mo', label: 'ROI window', sub: 'Most clients recover the build cost within 12 months of go-live.' },
    { value: '$0', label: 'Recurring licence fees', sub: 'You own the code. No subscription tax, ever.' },
  ],
  faqs: [
    {
      q: 'Custom software sounds expensive — we can’t afford it.',
      a: 'Compare it against 3 years of SaaS fees for tools that don’t fit. Most clients recover the build cost within 12 months — and then pay nothing year on year. We also offer phased delivery so the investment is spread over the build timeline.',
    },
    {
      q: 'What if requirements change during the build?',
      a: 'They always do — and we build for it. Our process includes regular check-ins and prototyping before coding starts, so you’re always reviewing working software, not specs on paper. Changes caught early cost almost nothing.',
    },
    {
      q: 'What happens if something breaks after launch?',
      a: 'You’ll have a documented, supported codebase — not a black box. We offer support packages and can train your own technical staff to maintain the system. You are never dependent on us to keep the lights on.',
    },
    {
      q: 'How long will it actually take?',
      a: 'Most projects go live in 6–10 weeks depending on complexity. We commit to a delivery timeline before we start — not a rolling estimate. If we miss it, we own it.',
    },
  ],
  cta: {
    eyebrow: '06 — Start',
    headline: 'Stop renting. Own.',
    sub: 'Get a free systems audit. We map your stack, find what’s costing you most, and show you exactly what’s worth building yourself.',
    primary: { label: 'Get a free audit', href: '/services/consultation' },
    secondary: { label: 'All services', href: '/services' },
  },
};

export default function CustomSoftwarePage() {
  return <ServiceDetailLayout data={data} />;
}
