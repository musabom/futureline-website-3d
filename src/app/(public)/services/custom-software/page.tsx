import type { Metadata } from 'next';
import {
  ServiceDetailLayout,
  type ServiceDetailData,
} from '@/components/sections/ServiceDetailLayout';

export const metadata: Metadata = {
  title: 'Custom Software — FutureLine',
  description:
    'Purpose-built platforms shaped around how your team actually works. Live in 6–10 weeks. You own the code. No licence tax — ever.',
};

const data: ServiceDetailData = {
  eyebrow: 'FL · Lab · Custom Software',
  pageNumber: '02',
  heading: 'Software that fits.',
  // Subhead tightened 38w → 22w. Drops "half-fit" awkwardness. Leans
  // on three concrete brand promises (timeline / ownership / cost) so
  // the hero carries weight without leaning on AI-vague claims.
  subhead:
    'Purpose-built platforms shaped around how your team actually works. Live in 6–10 weeks. You own the code. No licence tax — ever.',
  marqueeItems: [
    'Custom platforms',
    'Live in 6–10 weeks',
    'You own the code',
    'Weekly demos',
    'Built around your team',
  ],
  // Section H2 overrides — the layout's defaults are digitalisation-
  // flavored ("The cost of staying manual.", "Built to last."). Custom
  // Software is about software ownership and build-process risk, not
  // manual work, so the headings need to fit the page.
  painHeading: 'Where custom builds go wrong.',
  deliverablesHeading: 'What you walk away with.',
  // Pain points rewritten — old set duplicated the compare table
  // ($12k licence, 80% unused, vendor lock-in, 70% adoption fail are
  // all rows in the compare). New set names the *unique pain of
  // building software wrong*: scope creep, freelancer disappearance,
  // prototype trap, integration debt. The compare table now owns the
  // "vs SaaS" argument exclusively.
  painPoints: [
    {
      stat: '2.7×',
      headline: 'Scope creep.',
      body: 'Most custom builds run 2.7× over their original budget. Scope quietly expands mid-build; nobody flags it until invoice 4. A defined budget with phased delivery beats a "rolling estimate" every time.',
    },
    {
      stat: '1 in 3',
      headline: 'The freelancer ghost.',
      body: '1 in 3 single-developer builds end with the dev disappearing — usually right when production starts. Stack tour. Codebase no one can read. Half a system, no one to finish it.',
    },
    {
      stat: '60%',
      headline: 'The prototype trap.',
      body: '60% of proof-of-concept builds never reach production. The demo wowed the board; the Figma looked great. Then three months pass with no working software. Demos aren’t software.',
    },
    {
      stat: '40+ hrs/yr',
      headline: 'The glue tax.',
      body: '40+ hours per person, per year, spent maintaining brittle integrations between 5+ SaaS tools — Zapier scripts, manual exports, CSV reconciliation. One vendor pricing change and the stack crawls.',
    },
  ],
  // Process heading is now service-specific (the layout default of
  // "Live in weeks." would contradict a 6–10 week build). Subhead
  // promotes the underrated strength: working software every Friday.
  processHeading: 'The 6–10 week build.',
  processSubhead:
    'Working software every Friday. No long silences, no surprise reveals — your team uses each iteration as it’s built, so adoption starts before launch.',
  process: [
    {
      when: 'Weeks 1–2',
      title: 'Discovery',
      body: 'We sit with your team. Map the workflow, the language, the edges. Output: signed scope doc + system map + prioritized risk register.',
    },
    {
      when: 'Weeks 2–3',
      title: 'Design & prototype',
      body: 'Interactive prototypes — not specs. You click through the system before it’s built. Output: clickable Figma, demo walkthrough, costed change-log.',
    },
    {
      when: 'Weeks 3–8',
      title: 'Build & weekly demos',
      body: 'Real software every Friday. Your team uses it as it’s built. Output: weekly working build, release notes, defect tracker.',
    },
    {
      when: 'Weeks 8–10',
      title: 'Launch & handover',
      body: 'Live system, trained team, documented codebase. Output: GitHub repo transferred to your org, runbook, handover demo.',
    },
  ],
  techStack: 'Next.js · Postgres · AWS — or your stack of choice',
  // Deliverables cleaned up: dropped AI line (repeated across pages),
  // split source code from documentation/handover so both earn their
  // own line, swapped vague "Operations dashboards built around your
  // KPIs" for sharper outputs. 7 → 7 (kept count but every line now
  // carries unique weight).
  deliverables: [
    'Operations dashboards built around your KPIs',
    'Field and mobile apps that work offline',
    'Client and customer portals',
    'Internal management tools that replace 2–3 SaaS subscriptions',
    'Integrations with your existing stack — no Zapier glue',
    'Full source code, transferred to your GitHub on day 1',
    'Documentation, trained team, signed handover demo',
  ],
  // Recent builds — 4 example tiles. Reframed as "examples of what we
  // CAN build" (not an exhaustive list). Each tile is clickable and
  // opens a modal with long-form marketing copy: lead, who-it's-for,
  // what-it-replaces, features, typical results.
  recentBuilds: {
    eyebrow: 'Examples',
    headline: 'Built for what you actually run.',
    intro:
      'Each one is shaped around the team using it — not the SaaS it replaces. Click any tile for the full picture.',
    tiles: [
      {
        kind: 'dashboard',
        industry: 'Oil & Gas',
        title: 'HSE operations dashboard',
        subtitle:
          'Real-time KPIs, incident routing, contractor compliance — one screen leadership actually opens.',
        detail: {
          lead: 'One screen for the team running ops. Real-time KPIs, contractor compliance, incident routing — everything that matters to safety in operations, finally in one place.',
          whoItsFor:
            'Oil & gas operators running field teams across multiple sites, with HSE compliance pressure and contractor accountability that can’t be tracked in spreadsheets.',
          replaces:
            'Excel incident logs, PDF permit forms, WhatsApp HSE walks, the safety officer’s clipboard, and the three vendor dashboards nobody opens.',
          features: [
            'Real-time incident routing with auto-escalation by severity',
            'Contractor compliance tracking — certs, inductions, permit history',
            'HSE KPI dashboards built around YOUR safety scorecard',
            'Audit-grade logs — every decision traceable, defensible',
            'Permit-to-work workflows that route, notify, and close in minutes',
            'Offline-first field app for inspectors and supervisors',
          ],
          results: [
            '60% reduction in compliance prep time before audits',
            'Zero missed audits across the operational site portfolio',
            'HSE team manages 3× the contractor headcount with the same staff',
          ],
        },
      },
      {
        kind: 'mobile',
        industry: 'Construction',
        title: 'Field app, offline-first',
        subtitle:
          'Site diaries, snags, sub-approvals. Works without signal — syncs the moment the foreman walks back to the trailer.',
        detail: {
          lead: 'What the foreman actually uses on site. Site diaries, snags, sub-approvals — all without a cellular signal. Syncs the moment they walk back to the trailer.',
          whoItsFor:
            'Construction GCs, subcontractors, and civil engineering teams running multi-site projects with field crews who don’t have time for office software.',
          replaces:
            'WhatsApp diary chats, paper snag lists, email approval chains, the giant Excel everyone’s afraid to open, and the generic platforms like Procore that nobody opens on site.',
          features: [
            'Offline-first sync — works without signal, queues then uploads when reconnected',
            'Photo capture with geo-tag and timestamp on every entry',
            'Snag assignment with photo evidence and resolution tracking',
            'Sub-approval routing with one-tap accept or reject',
            'Daily site report auto-generated from the day’s entries — no end-of-day admin',
            'Mobile-first UI built for gloves, dust, and sun glare',
          ],
          results: [
            '~4 hrs/day reclaimed per site foreman',
            'Complete site diary on day 1 — no week-end catch-up',
            'Zero lost snags between site and office',
          ],
        },
      },
      {
        kind: 'portal',
        industry: 'Public Sector',
        title: 'Citizen service portal',
        subtitle:
          'Public-facing service requests + internal case management. Compliance-ready out of the box.',
        detail: {
          lead: 'What public service should look like in 2026. Citizens self-serve. Staff manage cases, not queues. Compliance is built in, not bolted on.',
          whoItsFor:
            'Municipalities, ministries, regulatory authorities, and public-facing service delivery teams handling hundreds or thousands of requests per month.',
          replaces:
            'Paper application forms, phone-call queues, generic e-gov framework rollouts, vendor-locked CMS dragging audit trails behind it.',
          features: [
            'Service request intake with conditional logic and document upload',
            'Citizen-facing status tracking — "where’s my application?"',
            'Internal case management with assignee routing and SLA timers',
            'Compliance audit trail — every action timestamped and attributable',
            'WCAG-AA accessibility on day one — not an afterthought',
            'Multilingual UI (Arabic + English) with RTL support built in',
          ],
          results: [
            'Service times cut by ~70% across the live service portfolio',
            'Staff workload halved — same throughput with half the headcount',
            'Citizen satisfaction scores up 40 points within two quarters',
          ],
        },
      },
      {
        kind: 'crm',
        industry: 'SMEs Scaling Fast',
        title: 'Custom CRM + ops console',
        subtitle:
          'Replaces 2–3 SaaS subs. Built around your stages, your terminology, your handoffs. No per-seat tax.',
        detail: {
          lead: 'Replace your stack with one system that speaks your team’s language. Pipeline stages match your sales process. Reports match what leadership actually asks for. No per-seat tax that punishes hiring.',
          whoItsFor:
            'Founders and ops leads at SMEs (10–200 people) who’ve outgrown HubSpot/Pipedrive and dread the next per-seat renewal.',
          replaces:
            '2–3 SaaS subs bolted together with Zapier — usually a CRM, a project tool, and a billing tool, plus the Excel everyone hates.',
          features: [
            'Pipeline stages built around YOUR sales motion — not Salesforce’s',
            'Ops dashboard showing live revenue, deal stage, and team capacity',
            'Billing integration with your accounting tool of choice',
            'Your terminology — deals, accounts, projects, tickets, however you name them',
            'Role-based access without enterprise-tier pricing',
            'API + integrations to whatever’s already in your stack',
          ],
          results: [
            '1 system replacing 2–3 subscriptions — ~$25k+/yr eliminated',
            'Per-seat tax killed — hire freely without budget conversations',
            'Sales team adoption 95%+ in week 1 (vs ~30% on HubSpot)',
          ],
        },
      },
    ],
  },
  // NEW: Build vs Buy vs Hire decision matrix. Addresses the "why not
  // hire a freelancer?" objection that the SaaS-vs compare table can't.
  buildVsBuy: {
    eyebrow: 'Decision framework',
    headline: 'Build, buy, or hire?',
    intro:
      'Three honest paths. Different cost, speed, fit, and risk. We’ll be the first to tell you when one of the other two is the right call for you.',
    rows: [
      {
        label: 'Speed to live',
        saas: 'Days to a generic instance.',
        hire: '6–18 months — recruit, ramp, build.',
        futureline: '6–10 weeks. Committed up front, not a rolling estimate.',
      },
      {
        label: 'Cost shape',
        saas: 'Recurring fee, every year. Forever.',
        hire: 'Salary + benefits + recruiter fee. Every year.',
        futureline:
          '45–75% cheaper than SaaS over 3 years. Paid once, owned forever.',
      },
      {
        label: 'Fit to your team',
        saas: '30–60%. Built for everyone. Fits no one perfectly.',
        hire: '60–90%. Depends on who you hire.',
        futureline: '99%+. Shaped around your day-to-day from day one.',
      },
      {
        label: 'Ownership',
        saas: '0%. Vendor owns the code, the roadmap, the data model.',
        hire: 'Varies. Depends on the contract.',
        futureline: '100%. Source code transferred to your GitHub on day 1.',
      },
      {
        label: 'Risk when things go wrong',
        saas: 'Vendor sunsets, raises prices, kills features.',
        hire: 'Single point of failure. Devs leave, codebase orphaned.',
        futureline: 'Documented, supported, owned. You can hire anyone to maintain it.',
      },
    ],
  },
  // Commitment panel — "What we do, what you do." Sets expectations on
  // client-side time investment so the unspoken "how much of MY team's
  // time?" question is answered before it's asked.
  commitment: {
    eyebrow: 'The engagement',
    headline: 'We do the work. You own the result.',
    // Intro retightened — now the headline carries the asymmetry claim,
    // so the intro drops "Most of the work sits with us" (redundant
    // with the new headline) and leads with the time-honesty beat.
    intro:
      'Here’s exactly what sits with you — with honest hour estimates.',
    weDo: [
      'Map your workflow and write down what success looks like',
      'Design and prototype — clickable demo before any code ships',
      'Build with weekly Friday demos — no long silences, no surprise reveals',
      'Test, document, train — handover demo signed off by your team lead',
      'You own the GitHub repo, infrastructure, and credentials — from day 1, not handover',
    ],
    youDo: [
      {
        item: 'Discovery — your operations lead walks us through the workflow',
        time: 'Weeks 1–2 · ~3 hrs/week',
      },
      {
        item: 'Demo feedback — review each Friday build, flag what’s off',
        time: 'Weeks 3–8 · ~1 hr/week',
      },
      {
        item: 'Sign-off moments — scope, design, launch',
        time: 'Throughout · 3 × ~30 min',
      },
      {
        item: 'Training — your admin learns the system end-to-end',
        time: 'Week 10 · ~4 hrs total',
      },
    ],
    // Total ask: 6 + 6 + 1.5 + 4 = 17.5 ≈ 17 hours of client time across
    // a 10-week build. Honest, concrete, confidence-building number.
    youDoTotal: '~17 hours of your team’s time, across 10 weeks.',
  },
  // Compare table — kept, but it now owns the "vs SaaS" argument
  // exclusively (pain points used to duplicate this).
  compare: {
    eyebrow: 'Why not just buy SaaS?',
    headline: 'Off-the-shelf vs. built for you.',
    intro:
      'Most teams start with a SaaS subscription. It feels safe, fast, and cheap. Five years in, the maths flips. Here’s what you actually trade.',
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
        saas: 'You rent. The vendor owns the code, data model, and roadmap.',
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
  // Stats — added 4th (ownership %). Layout adapts to 4-col grid.
  stats: [
    {
      value: '6–10 wks',
      label: 'Time to launch',
      sub: 'Most builds live in 6–10 weeks. Committed up front — not a rolling estimate.',
    },
    {
      value: '12 mo',
      label: 'ROI window',
      sub: 'Most clients recover the build cost within 12 months of go-live.',
    },
    {
      value: '$0',
      label: 'Recurring licence fees',
      sub: 'You own the code. No subscription tax, ever.',
    },
    {
      value: '100%',
      label: 'Yours, forever',
      sub: 'Source code, documentation, infrastructure — transferred outright on handover.',
    },
  ],
  // Industries rewritten in software-build language (custom replacements
  // for specific SaaS) rather than digitalisation language (move off
  // paper). Each pain is one sentence with the SaaS being replaced.
  industries: [
    {
      name: 'Oil & Gas',
      pain: 'Custom HSE platforms and contractor management — replace 2–3 SaaS subscriptions with one system your field teams actually use.',
    },
    {
      name: 'Construction',
      pain: 'Project management and snag tracking built for the foreman — without the Procore subscription or the bolted-on workarounds.',
    },
    {
      name: 'Government & Public Sector',
      pain: 'Citizen portals and case-management tools that meet compliance and ship faster than the framework-vendor route — owned, not rented.',
    },
    {
      name: 'Education & Training',
      pain: 'Student portals and LMS platforms built around your curriculum — no Moodle force-fit, no per-seat pricing as you grow.',
    },
    {
      name: 'SMEs Scaling Fast',
      pain: 'Custom CRMs and operations dashboards that grow with you — without the per-seat tax that punishes hiring.',
    },
  ],
  // FAQs expanded 4 → 6 with two high-frequency missing questions
  // (repo ownership / freelance comparison).
  faqs: [
    {
      q: 'Custom software sounds expensive — we can’t afford it.',
      a: 'Compare it against 3 years of SaaS fees for tools that don’t fit. Most clients recover the build cost within 12 months — and then pay nothing year-on-year. We also offer phased delivery so the investment is spread across the build timeline.',
    },
    {
      q: 'What does a custom build actually cost?',
      a: 'Most builds land between $25k–$120k depending on scope, integrations, and complexity. We commit to a fixed price after the free audit — no rolling estimates, no surprise invoices. Phased delivery means you can spread the investment across the build, and most clients recover the build cost inside 12 months of go-live. From then on, your operating cost is $0 — you own the code.',
    },
    {
      q: 'What if requirements change during the build?',
      a: 'They always do — and we build for it. Our process runs weekly demos and prototyping before coding, so you’re always reviewing working software, not specs on paper. Changes caught early cost almost nothing.',
    },
    {
      q: 'Where does the code live? Who owns the repo?',
      a: 'Your code lives in your GitHub organisation from day one. We’re a collaborator during the build; you’re the owner at handover. There’s no FutureLine-owned "master copy" — what’s in your repo IS the software.',
    },
    {
      q: 'How does this compare to hiring a developer in-house or a freelancer?',
      a: 'Hiring is 6–18 months from advert to productive output, plus salary, benefits, and the risk of them leaving. A freelancer is cheap but a single point of failure. We’re a small team with a documented process, a defined budget, and a handover plan. The output is yours; we’re not.',
    },
    {
      q: 'What happens if something breaks after launch?',
      a: 'You have a documented, supported codebase — not a black box. We offer support packages and can train your own technical staff to maintain the system. You’re never dependent on us to keep the lights on.',
    },
    {
      q: 'How long will it actually take?',
      a: 'Most projects go live in 6–10 weeks depending on complexity. We commit to a delivery timeline before we start — not a rolling estimate. If we miss it, we own it.',
    },
  ],
  cta: {
    eyebrow: '06 — Start',
    headline: 'Stop renting. Own.',
    sub: 'Live in 6–10 weeks. Yours forever. Start with a free audit — we’ll map your stack, find what’s costing you most, and tell you what’s worth building yourself (and what isn’t).',
    primary: { label: 'Get a free audit', href: '/audit' },
    secondary: { label: 'All services', href: '/services' },
  },
};

export default function CustomSoftwarePage() {
  return <ServiceDetailLayout data={data} />;
}
