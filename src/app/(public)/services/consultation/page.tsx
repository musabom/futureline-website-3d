import type { Metadata } from 'next';
import {
  ServiceDetailLayout,
  type ServiceDetailData,
} from '@/components/sections/ServiceDetailLayout';

export const metadata: Metadata = {
  title: 'Consultation — FutureLine',
  description:
    'A plain-English audit of your current systems. No commission, no vendor bias — just an honest read on what to fix first and what to leave alone.',
};

const data: ServiceDetailData = {
  eyebrow: 'FL · Lab · Consultation',
  pageNumber: '04',
  heading: 'Honest second opinion.',
  // Subhead 40w → 24w. Drops "or care which tool you pick" filler and
  // "evidence-based read" jargon. Leans into the brand-voice contrast
  // (no commission, no bias).
  subhead:
    'A plain-English audit of your current systems. No commission, no vendor bias — just an honest read on what to fix first and what to leave alone.',
  marqueeItems: [
    'Independent advice',
    'No commission',
    'Plain English',
    'Roadmap not pitch',
    'Free first session',
  ],
  // Pain section heading — consultation-specific (default is digi-flavored).
  painHeading: 'Where bad advice costs you.',
  // Pruned 6 → 4 with consistent numeric format. Dropped: $47k
  // (CROSS-PAGE DUPLICATE with Digi — that page owns the failed-project
  // cost angle), "Reactive" (non-numeric), "Months wasted" (now made
  // concrete as "6 mo"), "Avoidable" (non-numeric).
  // New 4 stats are all numeric and unique to this page's angle.
  painPoints: [
    {
      stat: '100%',
      headline: 'Biased vendor advice.',
      body: 'Every vendor demo, agency pitch, and comparison site is funded by someone who wants to sell you something. None of them make money telling you what you actually need.',
    },
    {
      stat: '70%',
      headline: 'IT projects miss the mark.',
      body: 'Roughly 70% of business technology projects fail to deliver the value they promised — usually because nobody validated the strategy before the build started.',
    },
    {
      stat: '6 mo',
      headline: 'Analysis paralysis.',
      body: 'The volume of options and conflicting advice freezes decision-makers — six months becomes a year, and you’re still on the old system. An independent expert cuts through the noise.',
    },
    {
      stat: '5 yrs',
      headline: 'The wrong-tool tax.',
      body: 'Pick the wrong SaaS and you’re locked in for 3–5 years of recurring fees, data migration debt, and workarounds. One free first session can prevent it.',
    },
  ],
  // Process heading — service-specific (replaces digi default).
  processHeading: 'The 2–3 week audit.',
  processSubhead:
    'Fast enough to act on. Long enough to be evidence-based — not a hot take from a one-hour call.',
  process: [
    {
      when: 'Week 1',
      title: 'Context & discovery',
      body: 'We listen. What you do, what hurts, what you’ve tried, where the business is going. Output: discovery notes, decision register, list of assumptions to test.',
    },
    {
      when: 'Week 2',
      title: 'Analysis',
      body: 'We map the current stack, the workflows, the real and hidden costs, and the obvious gaps. Output: stack map, cost analysis, gap inventory.',
    },
    {
      when: 'Week 2–3',
      title: 'Strategy & report',
      body: 'A clear written report. Priorities, sequencing, budget bands, and what to NOT do. Plain English throughout. Output: written report + executive summary.',
    },
    {
      when: 'Ongoing',
      title: 'Implementation support',
      body: 'Optional follow-on calls during execution. We stay independent — we don’t build it unless you ask separately. Output: follow-on memo per session.',
    },
  ],
  // Deliverables heading — consultation-specific (default "Built to
  // last." doesn't fit a paper artifact).
  deliverablesHeading: 'What you walk away with.',
  // Pruned 7 → 5. Cut "Digital transformation strategy" (buzzword
  // phrase), "Operations and process audit" (overlaps with the pain
  // section's framing of the same audit), "Data and reporting strategy"
  // (overlaps with #1 technology roadmap).
  deliverables: [
    'A plain-English audit of your current stack — every tool, real cost, hidden cost',
    'A technology roadmap aligned to where the business is actually going',
    'Software selection support — without vendor bias or commission',
    'Pre-investment review for big software decisions before you sign anything',
    'A written report you own — share it with your board, your investors, your team',
  ],
  // Commitment panel — light total, matches the audit duration. Sets
  // expectations on how much client time is actually needed.
  commitment: {
    eyebrow: 'The engagement',
    headline: 'We do the work. You get an honest read.',
    intro:
      'Here’s exactly what sits with you — with honest hour estimates.',
    weDo: [
      'Listen first — understand the business strategy and where it’s going',
      'Map your stack — every tool, workflow, real cost, hidden cost',
      'Analyze independently — no vendor bias, no software to sell',
      'Write the report — priorities, sequencing, budget bands, what to NOT do',
      'Walk it through with you, your board, your finance team — if you want',
    ],
    youDo: [
      {
        item: 'Discovery interview — your leadership walks us through the business',
        time: 'Week 1 · ~3 hrs total',
      },
      {
        item: 'Stack walk-through — your IT or ops lead shows us what’s there',
        time: 'Week 1–2 · ~2 hrs',
      },
      {
        item: 'Mid-engagement check-in — clarify findings, flag gaps',
        time: 'Week 2 · ~1 hr',
      },
      {
        item: 'Report walkthrough — sign-off and Q&A',
        time: 'Week 3 · ~1.5 hrs',
      },
    ],
    youDoTotal: '~7 hours of your team’s time, across 2–3 weeks.',
  },
  // Compare table — 2-way contrast between vendor-led advice and
  // FutureLine independent. This is the core argument the Consultation
  // page needs to make: why pay for advice when every other party
  // offers it "free"? Because every other party is conflicted.
  compare: {
    eyebrow: 'Why not just listen to vendors?',
    headline: 'Free advice vs. honest advice.',
    intro:
      'Every vendor demo, agency pitch, and comparison site is "free" — because someone’s being paid downstream when you sign. Here’s the trade you’re actually making.',
    leftHeader: 'Vendor-led advice',
    rightHeader: 'FutureLine independent',
    rows: [
      {
        label: 'Skin in the game',
        saas: 'Sells you software. Paid to recommend their tool.',
        futureline: 'No software to sell. No commission. No vendor partnerships.',
      },
      {
        label: 'Breadth of experience',
        saas: 'Knows one toolset deeply — theirs.',
        futureline: 'Cross-sector experience across SaaS, custom builds, and in-house teams.',
      },
      {
        label: 'Honest about doing nothing',
        saas: 'Won’t tell you to skip the buy. Their job is to close.',
        futureline: 'Routinely recommends "don’t buy yet" or "just use what you already have."',
      },
      {
        label: 'Outcome alignment',
        saas: 'Win = you sign a contract.',
        futureline: 'Win = you get the right answer, even when that answer is "do nothing".',
      },
      {
        label: 'Lock-in created',
        saas: 'Recommendations turn into 3–5 year SaaS commitments.',
        futureline: 'You walk away with the report. Owe us nothing. Use anyone to act on it.',
      },
    ],
  },
  // Stats — 4th added (cross-sector independence), grid auto-adapts to
  // 4 cols.
  stats: [
    { value: '$0', label: 'Vendor commission', sub: 'No kickbacks from any software vendor. Ever.' },
    { value: '2–3 wks', label: 'Audit duration', sub: 'From kickoff to written report — fast enough to act on.' },
    { value: 'Free', label: 'First session', sub: 'A free initial consultation. No pitch deck, no hard sell.' },
    { value: '5+', label: 'Sectors served', sub: 'Oil & gas, construction, public sector, education, SME ops — cross-pollinated insight.' },
  ],
  // Industries — tightened with consultation-specific framing
  // (evaluation/strategy, not implementation), each line now anchored
  // to the page's vendor-independence promise.
  industries: [
    {
      name: 'Oil & Gas',
      pain: 'HSE tech, field ops, and compliance strategy — evaluated independently, vendor by vendor.',
    },
    {
      name: 'Construction',
      pain: 'Project management and site-operations tech — evaluated against your actual workflow, not the vendor’s demo.',
    },
    {
      name: 'Government & Public Sector',
      pain: 'Citizen service transformation and legacy system strategy — realistic, evidence-based, vendor-independent.',
    },
    {
      name: 'Education & Training',
      pain: 'Student experience, LMS, and admin strategy — aligned to your institution, not the LMS vendor’s roadmap.',
    },
    {
      name: 'SMEs Scaling Operations',
      pain: 'What to build now, what to defer, how to scale without technical debt — independent of any tool’s commercial interest.',
    },
  ],
  faqs: [
    {
      q: 'We already have an IT team — why would we need consultation?',
      a: 'Internal IT teams manage what’s there. Strategic consultation is about deciding what should be there next — and why. Most IT teams don’t have the business strategy context or cross-sector experience to make those calls independently.',
    },
    {
      q: 'How is this different from talking to a vendor?',
      a: 'We don’t sell software. We don’t receive commission. We have no financial interest in which tool you choose or whether you build or buy. Our only interest is giving you the right advice — that’s what keeps clients coming back.',
    },
    {
      q: 'What does the written report actually contain?',
      a: 'A 15–30 page document in plain English. Sections: where you are today (stack map, real and hidden costs, gaps), where you should go (roadmap, sequencing, budget bands), what to NOT do (the dead ends to avoid), and a one-page executive summary you can hand to your board. You own it. Share it with anyone.',
    },
    {
      q: 'What does this cost?',
      a: 'Most consultations land between $4k–$15k depending on scope and stack complexity. Fixed price after the free first session — no rolling estimates. The first session itself is genuinely free. No deck, no commitment.',
    },
    {
      q: 'What if we just need a quick second opinion?',
      a: 'That’s often the most valuable engagement. A one-session consult on a single decision (build vs buy, vendor X vs Y, scope of an upcoming project) can save weeks. Reach out — we’ll tell you up front if you even need us.',
    },
    {
      q: 'Will the consultation push us toward your other services?',
      a: 'Only when it’s the right answer. We routinely recommend off-the-shelf tools, in-house builds, or doing nothing yet. If the answer is build, we’ll tell you — and you’re free to take that to anyone.',
    },
  ],
  cta: {
    eyebrow: '07 — Start',
    headline: 'Get an honest read.',
    // CTA sub now echoes brand voice: plain English + the no-deck
    // / no-commission promise. Also fixes the broken `#enquiry`
    // anchor on the primary CTA href.
    sub: 'Plain-English audit. 2–3 weeks. No commission, no hard sell. The first session is free — we listen, ask sharp questions, and tell you what we’d do if it were our business.',
    primary: { label: 'Book a free session', href: '/audit' },
    secondary: { label: 'All services', href: '/services' },
  },
};

export default function ConsultationPage() {
  return <ServiceDetailLayout data={data} />;
}
