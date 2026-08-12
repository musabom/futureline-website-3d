import type { Metadata } from 'next';
import {
  ServiceDetailLayout,
  type ServiceDetailData,
} from '@/components/sections/ServiceDetailLayout';

export const metadata: Metadata = {
  title: 'Automations — FutureLine',
  description:
    'AI-powered workflows that eliminate manual work, cut errors, and give your team their day back. Live in 4 weeks. Owned forever. No per-task fees.',
};

const data: ServiceDetailData = {
  eyebrow: 'FL · Lab · Automations',
  pageNumber: '03',
  heading: 'Robots do the boring.',
  // Subhead 30w → 20w. Drops the second sentence ("Approvals routed.
  // Data synced. Reports written.") which was a verbatim restate of
  // the marquee strip. Adds brand-promise tail.
  subhead:
    'AI-powered workflows that eliminate manual work, cut errors, and give your team their day back. Live in weeks. Owned forever.',
  marqueeItems: [
    'AI workflows',
    'Approval routing',
    'Data sync',
    'Auto-reports',
    'No more chasing',
  ],
  // Pain section heading — automation-specific (default "The cost of
  // staying manual." is digitalisation-flavored).
  painHeading: 'Where manual work is bleeding you.',
  // Pruned 6 → 4. Dropped: "10× harder" (non-numeric, vague),
  // "Always late" (non-numeric), and "2–3 days" (cross-page duplicate
  // with Digitalisation — that page already owns the approval-delay
  // angle). New: "$30k/yr" — the hidden-bill angle, unique to this
  // page's cost framing.
  painPoints: [
    {
      stat: '19 hrs/wk',
      headline: 'Wasted hours.',
      body: 'The average small-business team spends 19 hours per week on tasks a machine could do — data entry, copy-paste between tools, chasing approvals.',
    },
    {
      stat: '1 in 20',
      headline: 'Human error loops.',
      body: 'Every time a human re-enters data, the error rate is 1 in 20. Across thousands of records, your database is degrading. Automation is error-free, every time.',
    },
    {
      stat: '40%',
      headline: 'Staff doing robot work.',
      body: '40% of most job roles involve tasks that could be fully automated today. Your best people are spending their day on tasks that add zero unique value.',
    },
    {
      stat: '$30k/yr',
      headline: 'The hidden bill.',
      body: 'Manual work doesn’t show up on an invoice — but it costs the average SME ~$30k per year, per employee, in time that could be automated. Multiply by your headcount.',
    },
  ],
  // Process heading — service-specific (default "Live in weeks." is too
  // generic; this page can be more precise about the speed).
  processHeading: 'First automation live in week 2.',
  processSubhead:
    'One automation at a time, in production. You see value before the project ends — not at handover.',
  process: [
    {
      when: 'Week 1',
      title: 'Process audit',
      body: 'We shadow your operation. Find the repetitive tasks, the silent waste, the loops worth automating. Output: process map, priority list, savings forecast.',
    },
    {
      when: 'Week 2',
      title: 'Design & agree',
      body: 'We propose what to automate, in what order, what stays human. You approve before any code ships. Output: signed scope, automation specs.',
    },
    {
      when: 'Weeks 2–4',
      title: 'Build & ship',
      body: 'Each automation goes live one at a time, with logging and monitoring built in. Output: weekly working automations, runbooks, defect tracker.',
    },
    {
      when: 'Week 4+',
      title: 'Live & maintained',
      body: 'First month monitored free. Then optional support. Output: GitHub repo, escalation playbook, signed handover demo.',
    },
  ],
  techStack: 'Built on n8n, Make, custom Python — or whatever fits your stack',
  // Deliverables heading — outcome-focused, automation-specific
  // (default "Built to last." is generic for any service).
  deliverablesHeading: 'What goes on autopilot.',
  // Pruned 7 → 6. Cut "Smart notifications and alerts" (overlap with
  // #1, which already includes routing+notify).
  deliverables: [
    'Approval and sign-off workflows that route themselves',
    'Data sync between your tools — no more copy-paste',
    'Automated report generation — daily, weekly, monthly',
    'Client and customer communications on autopilot',
    'AI decision routing — for the calls humans hate making the same way 100 times',
    'Full audit trail and human escalation paths — every action logged',
  ],
  // Recent builds — 4 stylized automation examples with click-through
  // detail modals. Same pattern as Custom Software.
  recentBuilds: {
    eyebrow: 'Examples',
    headline: 'Built for what you actually run.',
    intro:
      'Each one is shaped around the workflow it’s replacing — not bolted on. Click any tile for the full picture.',
    tiles: [
      {
        kind: 'dashboard',
        industry: 'Multi-stage approvals',
        title: 'Approval workflow router',
        subtitle:
          'Routes, escalates, notifies, closes. Audit trail on every step. Days of email tag → minutes.',
        detail: {
          lead: 'The end of the approval email chain. Routes by rules, escalates on timeout, notifies the right people, closes when signed. Audit-grade trail on every step.',
          whoItsFor:
            'Operations teams drowning in multi-step approvals — purchase orders, leave requests, HSE permits, expense sign-offs, contractor onboarding.',
          replaces:
            'Email chains, WhatsApp groups, signed PDFs floating between inboxes, the Excel that tracks "who needs to sign next".',
          features: [
            'Multi-stage routing with escalation on timeout',
            'Push, email, or in-app notifications by role',
            'Full audit trail — who, what, when, why',
            'Mobile sign-off — approvers can act from the field',
            'Branches by request type — different approval flow for a purchase order vs a leave request',
            'Integrates with your CRM, HR system, or finance tools',
          ],
          results: [
            'Approval cycle: 2–3 days → 2–3 hours',
            'Zero "did you sign that?" follow-ups',
            'Audit prep cut from days to minutes',
          ],
        },
      },
      {
        kind: 'portal',
        industry: 'Data plumbing',
        title: 'Data sync engine',
        subtitle:
          'Keeps your tools in agreement. No more copy-paste, no more Friday reconciliations.',
        detail: {
          lead: 'One source of truth across every tool you already use. Data flows on its own — accounting talks to CRM, CRM talks to projects, projects talk to billing. No human in the middle.',
          whoItsFor:
            'Teams running 3+ SaaS tools that don’t talk to each other — and burning hours every week on copy-paste reconciliation.',
          replaces:
            'Manual exports, brittle no-code flows that break on every vendor update, the intern doing CSV imports on Friday, the spreadsheet "master copy" everyone secretly edits.',
          features: [
            'Two-way sync — change it once, it updates everywhere',
            'Conflict rules you control — pick which tool wins when records disagree',
            'Error queue — broken records flagged, not silently dropped',
            'Field mapping — your terms, not the vendor’s',
            'Handles vendor rate limits — automatic retries on failure',
            'Full activity log for every record changed',
          ],
          results: [
            '~12 hrs/week reclaimed across the ops team',
            'Friday reconciliation rituals retired',
            'Data quality measurably up — no more "which number is right?"',
          ],
        },
      },
      {
        kind: 'crm',
        industry: 'AI-powered triage',
        title: 'AI decision router',
        subtitle:
          'Reads the inbound. Routes it. Drafts a reply. Escalates the edge cases to a human.',
        detail: {
          lead: 'Inbound that used to need a human reading every line. The router triages by intent, routes by rules, drafts a first reply, and flags only the edge cases for a person. The 100 calls humans hate making the same way — gone.',
          whoItsFor:
            'Support teams, ops teams, and customer-facing functions handling high volumes of inbound that follow patterns — tickets, emails, forms, applications.',
          replaces:
            'The triage tray, the "we’ll get back to you within 48 hours" queue, the junior staffer copy-pasting the same answer 100 times a day.',
          features: [
            'Reads what each request is really about — your categories, your data',
            'Smart routing — by team, by priority, by language',
            'AI-drafted reply — a human approves or edits before send',
            'Escalates the uncertain cases to a person automatically',
            'Learns continuously from human corrections',
            'Plug in any model — OpenAI, Anthropic, open source, or self-hosted',
          ],
          results: [
            'First-response time: hours → minutes',
            '~70% of inbound handled without human touch',
            'Triage team freed up for the actual hard cases',
          ],
        },
      },
      {
        kind: 'mobile',
        industry: 'Field operations',
        title: 'Field-triggered automation',
        subtitle:
          'A worker scans a barcode, snaps a photo, taps a button — the whole back-office workflow fires.',
        detail: {
          lead: 'The field is where the work happens. A scan, a photo, a tap — and the whole back-office sequence fires. No phone-call relays, no end-of-day data entry, no waiting on the office.',
          whoItsFor:
            'Field teams in oil & gas, construction, logistics, maintenance — where the action happens away from a desk.',
          replaces:
            'Phone calls back to the office, paper forms collected at end of shift, the next-morning data-entry catch-up, the dispatcher manually creating tickets.',
          features: [
            'Works without signal — saves locally, uploads when reconnected',
            'Barcode + photo + GPS capture in one tap',
            'Fires off the next steps automatically: tickets, dispatch, billing, restock',
            'Push notifications to the right person, not the team channel',
            'Audit trail with geo-tag and timestamp on every action',
            'Configurable per role — driver, supervisor, technician',
          ],
          results: [
            'Field-to-office latency: hours → seconds',
            'Daily reconciliation step eliminated',
            'Faster billing, faster dispatch, fewer disputes',
          ],
        },
      },
    ],
  },
  // Build/Buy/Hire equivalent for Automations — 3-way matrix addressing
  // the biggest unspoken objection: "Why not just use an off-the-shelf
  // automation tool?" The schema's column-header overrides let us swap
  // "Buy SaaS" → "Off-the-shelf tool" without forking the layout.
  buildVsBuy: {
    eyebrow: 'Decision framework',
    headline: 'Off-the-shelf, hire a dev, or us?',
    intro:
      'Three honest paths. Different cost, reliability, and ceiling. We’ll tell you when an off-the-shelf tool is genuinely the right call — it sometimes is.',
    saasHeader: 'Off-the-shelf tool',
    hireHeader: 'Hire a developer',
    rows: [
      {
        label: 'Setup speed',
        saas: 'Days. Drag-and-drop in a browser.',
        hire: 'Weeks. Devs write scripts in their own style.',
        futureline:
          '1–2 weeks. First automation in production by week 2 — committed up front.',
      },
      {
        label: 'Cost shape',
        saas: 'Per-task fees. Costs scale linearly with volume.',
        hire: 'Hourly + ongoing maintenance retainer.',
        futureline: 'Project fee. No per-task tax — runs free forever after.',
      },
      {
        label: 'Reliability at scale',
        saas: 'Breaks at edge cases. 10k+ tasks/month gets expensive and brittle.',
        hire: 'Depends on the dev’s discipline and testing.',
        futureline:
          'Logged, monitored, escalated. Built for production from day 1.',
      },
      {
        label: 'Maintenance burden',
        saas: 'You maintain the flows. Vendor updates break them.',
        hire: 'You depend on the dev (or a replacement) for every change.',
        futureline:
          'Documented. Your team can extend. Optional support package — not a dependency.',
      },
      {
        label: 'AI capabilities',
        saas: 'Add-on credits. Limited integrations. One model option.',
        hire: 'Depends on the dev’s machine-learning experience.',
        futureline:
          'Use any model. Your data, your prompts, your fallback rules. On-prem option.',
      },
    ],
  },
  // Commitment panel — automations is even lighter-touch than custom
  // software. Total client ask is ~8 hours across a 4-week engagement.
  commitment: {
    eyebrow: 'The engagement',
    headline: 'We do the work. You own the result.',
    intro:
      'Here’s exactly what sits with you — with honest hour estimates.',
    weDo: [
      'Shadow your operation, map every loop, identify the highest-impact automations',
      'Build each automation one at a time — live in production, not in a demo',
      'Logging, error handling, human escalation paths — built in, not bolted on',
      'Monitor in production for the first month free — handed over once it’s stable',
      'You own the code, runbooks, and credentials — from day 1, not handover',
    ],
    youDo: [
      {
        item: 'Process audit walk-through — show us where time bleeds',
        time: 'Week 1 · ~3 hrs total',
      },
      {
        item: 'Priority list sign-off — what we automate, in what order',
        time: 'Week 2 · ~1 hr',
      },
      {
        item: 'Weekly check-ins — flag what’s off, confirm the next loop',
        time: 'Weeks 2–4 · ~30 min/week',
      },
      {
        item: 'Handover — your admin learns the runbooks and escalation paths',
        time: 'Week 4 · ~2 hrs total',
      },
    ],
    youDoTotal: '~8 hours of your team’s time, across 4 weeks.',
  },
  // Stats — drop "19hrs" pain-duplicate. Layout adapts to 4-col grid.
  stats: [
    {
      value: '2–4 wks',
      label: 'First go-live',
      sub: 'First automation in production within two weeks. Whole project lives in 4.',
    },
    {
      value: 'Error-free',
      label: 'Quality',
      sub: 'Automated steps don’t mistype, don’t forget, don’t miss days.',
    },
    {
      value: '$0',
      label: 'Per-task fees',
      sub: 'No per-task pricing like off-the-shelf automation tools. Once it’s built, it runs free forever.',
    },
    {
      value: '24/7',
      label: 'Runs without you',
      sub: 'Automations don’t take days off. They work the night shift, every shift.',
    },
  ],
  industries: [
    {
      name: 'Oil & Gas',
      pain: 'Permit routing, HSE incident escalation, shift handover notifications — automated to cut hours of admin per shift.',
    },
    {
      name: 'Construction',
      pain: 'Snag assignment, material order approvals, subcontractor payment workflows — moving on their own.',
    },
    {
      name: 'Government & Public Sector',
      pain: 'Citizen enquiry routing, document processing, compliance reporting — automated to cut admin in half.',
    },
    {
      name: 'Education & Training',
      pain: 'Enrolment confirmations, attendance alerts, exam notifications — sent without manual effort, every time.',
    },
    {
      name: 'SMEs Scaling Operations',
      pain: 'Replace the daily manual tasks your team hates most — quotes, follow-ups, internal approvals, weekly reports.',
    },
  ],
  faqs: [
    {
      q: 'Our processes are too complicated to automate.',
      a: 'We’ve heard this every time. Complex processes are exactly what automation is designed for — because the more steps involved, the more time and error risk you’re carrying. We start simple and build up, so complexity is managed, not avoided.',
    },
    {
      q: 'What if the automation makes a mistake?',
      a: 'Every automation we build has error handling, logging, and human escalation paths built in. When an edge case occurs, it routes to a human rather than silently failing. You have full visibility of every action taken — and a runbook for what to do.',
    },
    {
      q: 'Will it replace our people?',
      a: 'Almost never. Automation replaces repetitive tasks, not roles. Your team gets their time back for the work that actually requires judgement, creativity, and relationships — the work you actually hired them for.',
    },
    {
      q: 'What does this actually cost?',
      a: 'Most automation projects land between $8k–$45k depending on integration count and complexity. Fixed price after the free audit — no rolling estimates. Then $0/month forever (unlike off-the-shelf automation tools that charge per task). Most clients recover the cost within 6 months from the time saved.',
    },
    {
      q: 'Who owns the automations after handover?',
      a: 'You. The code, runbooks, and credentials live in your repo and your infrastructure from day 1. We document everything and train your team. You can extend the automations, hire someone else to maintain them, or rip them out — your call. We’re never a single point of failure.',
    },
    {
      q: 'Will this work with our existing tools?',
      a: 'Yes — that’s the point. We integrate with what you already have (CRM, HR system, accounting, project tools, custom databases). If something doesn’t have a ready-made integration, we write one. No "you must migrate to our platform first" conversations.',
    },
    {
      q: 'How do we maintain it once it’s live?',
      a: 'We document everything and train your team to extend the automations. Most clients keep us on a small monthly support package — not as a dependency, but as cheap insurance against the rare edge case.',
    },
  ],
  cta: {
    eyebrow: '07 — Start',
    headline: 'Give your team their day back.',
    sub: 'First automation in week 2. Whole project live in 4. Start with a free audit — we’ll find the three highest-impact automations in your operation and tell you what each would save in time and money.',
    primary: { label: 'Get a free audit', href: '/audit' },
    secondary: { label: 'All services', href: '/services' },
  },
};

export default function AutomationsPage() {
  return <ServiceDetailLayout data={data} />;
}
