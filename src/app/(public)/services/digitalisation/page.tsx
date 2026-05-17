import type { Metadata } from 'next';
import {
  ServiceDetailLayout,
  type ServiceDetailData,
} from '@/components/sections/ServiceDetailLayout';

export const metadata: Metadata = {
  title: 'Digitalisation — FutureLine',
  description:
    'Replace paper, spreadsheets, and inbox approvals with one system your team will actually use. Live in weeks. Owned forever.',
};

const data: ServiceDetailData = {
  eyebrow: 'FL · Lab · Digitalisation',
  pageNumber: '01',
  heading: 'Paper out. Systems in.',
  // 1) Subhead rewritten to lead with buyer reality + 8) light AI angle
  subhead:
    'Your team is buried in admin. Your competitors aren’t. We replace paper, spreadsheets, and inbox approvals with one system your people will actually use — live in weeks, owned forever, AI-ready by design.',
  marqueeItems: [
    'Digital workflows',
    'One source of truth',
    'Audit trails',
    'Real-time dashboards',
    'No spreadsheet sprawl',
    'AI-ready by design',
  ],
  // 3) Pain points #5 and #6 swapped for sharper, digitalisation-specific stats
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
      stat: '$47k',
      headline: 'Cost of getting it wrong.',
      body: 'The average failed digital project costs SMEs $47,000 in licences, build time, and rollback — before they decide to abandon it. We start with a free audit so you build the right thing the first time.',
    },
    {
      stat: '2–3 days',
      headline: 'Approvals that crawl.',
      body: 'A typical sign-off chain takes 2 to 3 days of email tag. Digital workflows route, notify, and close in minutes. Days back in everyone’s week — every week.',
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
  // 2) Deliverables reframed as OUTCOMES, not features
  deliverables: [
    'One system. Everyone on the same page.',
    'Sign-off without the email chase.',
    'Nobody asks "what’s the status?" ever again.',
    'Leadership decisions on today’s data, not last month’s.',
    'Every decision traceable, defensible, audit-ready.',
    'Built for 50. Ready for 500.',
    'Your team’s tribal knowledge — searchable, AI-ready.',
  ],
  // 5) New compare section
  compare: {
    eyebrow: 'Why not just buy SaaS?',
    headline: 'Off-the-shelf vs. built for you.',
    intro:
      'Most teams reach for a SaaS subscription first. It feels safe, fast, and cheap. Five years in, the maths flips. Here’s what you actually trade.',
    leftHeader: 'Off-the-shelf SaaS',
    rightHeader: 'FutureLine custom build',
    rows: [
      {
        label: '5-Year Cost',
        saas: '$12k+ per year. $60k+ over 5 years — and rising every renewal.',
        futureline: 'One build. Zero ongoing licences. Pays itself back inside year one.',
      },
      {
        label: 'Ownership',
        saas: 'You rent. The vendor owns the code, the data model, and the roadmap.',
        futureline: 'You own the source code, the infrastructure, and the data. Forever.',
      },
      {
        label: 'Fit',
        saas: '80% of features your team never uses. The 20% you need is half-shaped.',
        futureline: 'Built around your workflow. Every screen earns its place.',
      },
      {
        label: 'Adoption',
        saas: 'Your team works around the tool. Workarounds become the real process.',
        futureline: 'Your team uses it because it matches how they actually work.',
      },
      {
        label: 'Lock-In',
        saas: 'When the vendor raises prices, kills features, or shuts down — you’re stuck.',
        futureline: 'No vendor. No lock-in. You decide what changes and when.',
      },
      {
        label: 'AI Readiness',
        saas: 'Limited to whatever AI features the vendor decides to bolt on.',
        futureline: 'Your data, your structure, AI-ready from day one. Plug in any model.',
      },
    ],
  },
  // 4) Stats trio refreshed — no duplicate "11 hrs" from pain section
  stats: [
    {
      value: '5 wks',
      label: 'Average delivery',
      sub: 'Kickoff to live system. Not 12-month enterprise builds.',
    },
    {
      value: '$0',
      label: 'Recurring licence fees',
      sub: 'Custom systems mean no monthly software tax. Forever.',
    },
    {
      value: '100%',
      label: 'Yours, forever',
      sub: 'Source code, infrastructure, and data — owned outright. No vendor lock-in.',
    },
  ],
  // 6) Industries expanded — sharper before/after per sector
  industries: [
    {
      name: 'Oil & Gas',
      pain: 'Paper permits, HSE compliance logs, and field reports buried in inboxes — we ship digital permit-to-work systems, audit-grade incident routing, and field apps that work offline on a rig.',
    },
    {
      name: 'Construction',
      pain: 'Site diaries on WhatsApp, snag lists on clipboards, subcontractor approvals lost in email — we ship project management that the foreman uses on the site, not the office.',
    },
    {
      name: 'Government & Public Sector',
      pain: 'Service requests on paper forms, approvals stuck on someone’s desk, public records nobody can find — we ship citizen-facing portals and internal workflows that meet compliance and ship faster.',
    },
    {
      name: 'Education & Training',
      pain: 'Enrolment in spreadsheets, attendance on paper, reporting compiled the night before the board meeting — we ship student-facing portals and admin systems your registrar will actually use.',
    },
    {
      name: 'SMEs Scaling Operations',
      pain: 'The 5-person process you’ve outgrown. Founders doing admin instead of strategy. We rebuild the operation around how the business will work at 50 people — before you hit 50.',
    },
  ],
  // FAQs — kept the original 4, added 2 more (data security + ownership)
  faqs: [
    {
      q: 'We’ve tried software before and it didn’t work.',
      a: 'Off-the-shelf software is built for everyone, which means it fits no one perfectly. We build around your workflow, not the other way around. If it doesn’t fit how your team works, your team won’t use it — and we know that.',
    },
    {
      q: 'Sounds expensive. We can’t justify the cost right now.',
      a: 'Manual processes are already expensive — you’re just not seeing the invoice. At 11 hours of wasted admin per employee per week, the cost of NOT digitalising is far higher than our build fee. We can show you the numbers in the first session — that’s why the audit is free.',
    },
    {
      q: 'Our team won’t adopt new technology.',
      a: 'Because we build WITH your team — not for them. Every step is reviewed and approved by the people who will use it. We train your people before go-live. Adoption is a design problem, not a people problem.',
    },
    {
      q: 'We’re too busy to change right now.',
      a: 'That’s exactly when you need it most. The reason you’re too busy is because manual processes are consuming time you don’t have. We handle the build — your team’s involvement is minimal during delivery.',
    },
    {
      q: 'Where does our data live, and who has access?',
      a: 'Your data, your cloud (AWS, Azure, GCP, or your own infra). Role-based access on day one. Full audit log of who touched what, when. We never ship a system that puts your data on a vendor we don’t control with you.',
    },
    {
      q: 'What happens after handover? Are we stuck with you forever?',
      a: 'No. You own the codebase, the documentation, and the credentials. Most clients don’t need us after month one. Those who want ongoing support get a small monthly package — but it’s opt-in, never a requirement.',
    },
  ],
  // 7) CTA — added the second beat to match home page CTA rhythm
  cta: {
    eyebrow: '07 — Start',
    headline: 'Stop paying for paper. Start owning your systems.',
    sub: 'A free systems audit. We map every manual touchpoint, show you exactly what to fix first, and give you the numbers to justify the build. No commitment, no jargon, no pitch deck.',
    primary: { label: 'Get a free audit', href: '/audit' },
    secondary: { label: 'All services', href: '/services' },
  },
};

export default function DigitalisationPage() {
  return <ServiceDetailLayout data={data} />;
}
