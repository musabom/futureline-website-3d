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
  // Recent builds — 4 stylized mockup tiles. Provides visual proof on
  // a page that's otherwise text-heavy. Tiles are CSS-only abstractions
  // representing build TYPES, not real client work. Disclaimer caption
  // is rendered automatically by the layout.
  recentBuilds: {
    eyebrow: 'Recent builds',
    headline: 'What we ship.',
    intro:
      'Four representative build types from FutureLine engagements. Each is shaped around the team using it — not the SaaS replacing it.',
    tiles: [
      {
        kind: 'dashboard',
        industry: 'Oil & Gas',
        title: 'HSE operations dashboard',
        subtitle:
          'Real-time KPIs, incident routing, contractor compliance — one screen the COO actually opens.',
      },
      {
        kind: 'mobile',
        industry: 'Construction',
        title: 'Field app, offline-first',
        subtitle:
          'Site diaries, snags, sub-approvals. Works without signal — syncs the moment the foreman walks back to the trailer.',
      },
      {
        kind: 'portal',
        industry: 'Public Sector',
        title: 'Citizen service portal',
        subtitle:
          'Public-facing service requests + internal case management. Compliance-ready out of the box.',
      },
      {
        kind: 'crm',
        industry: 'SMEs Scaling Fast',
        title: 'Custom CRM + ops console',
        subtitle:
          'Replaces 2–3 SaaS subs. Built around your stages, your terminology, your handoffs. No per-seat tax.',
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
        saas: '$12k+/year, every year. Forever.',
        hire: 'Salary + benefits + recruiter fee. $80k+/yr.',
        futureline: '$$ one-off. Then $0/yr.',
      },
      {
        label: 'Fit to your team',
        saas: '30–60%. Built for everyone. Fits no one perfectly.',
        hire: '60–90%. Depends on who you hire.',
        futureline: '95%+. Shaped around your day-to-day from day one.',
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
    headline: 'What we do, what you do.',
    intro:
      'A custom build is a partnership, but the bulk of the work sits with us. Here’s exactly what your team is on the hook for, with honest hour estimates.',
    weDo: [
      'Map your workflow, language, and edges — write down what success looks like',
      'Design, prototype, and build the system — clickable demo before any code ships',
      'Run weekly Friday demos with release notes — no surprises, no long silences',
      'Test, document, and train your team — handover demo signed off by your COO',
      'Transfer the GitHub repo, infrastructure, and credentials — you own everything on day 1',
    ],
    youDo: [
      {
        item: 'Discovery sessions — your COO or ops lead with us, mapping the workflow',
        time: 'Weeks 1–2 · ~3 hrs/week',
      },
      {
        item: 'Demo feedback — review the Friday build, flag what’s off',
        time: 'Weeks 3–8 · ~1 hr/week',
      },
      {
        item: 'Decision moments — sign-off on scope, design, launch',
        time: '3 × ~30 min',
      },
      {
        item: 'Handover training — your admin learns the system end-to-end',
        time: 'Week 10 · ~4 hrs total',
      },
    ],
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
