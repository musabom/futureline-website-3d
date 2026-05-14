import type { Metadata } from 'next';
import {
  ServiceDetailLayout,
  type ServiceDetailData,
} from '@/components/sections/ServiceDetailLayout';

export const metadata: Metadata = {
  title: 'Consultation — FutureLine',
  description:
    'A plain-English audit of your current systems — what is slowing you down, what to fix first, and a roadmap that makes sense.',
};

const data: ServiceDetailData = {
  eyebrow: 'FL · Lab · Consultation',
  pageNumber: '04',
  heading: 'Honest second opinion.',
  subhead:
    'A plain-English audit of your current systems. We don’t sell software, take commission, or care which tool you pick. Just an evidence-based read on what to fix first and what to defer.',
  marqueeItems: [
    'Independent advice',
    'No commission',
    'Plain English',
    'Roadmap not pitch',
    'Free first session',
  ],
  painPoints: [
    {
      stat: '$47k avg',
      headline: 'Wrong tool, right price.',
      body: 'The average failed software project costs SMEs $47,000 in licences, dev time, and implementation — before the decision is made to abandon it.',
    },
    {
      stat: '100% conflict',
      headline: 'Biased vendor advice.',
      body: 'Every vendor demo, agency pitch, and comparison site is funded by someone who wants to sell you something. None of them make money telling you what you actually need.',
    },
    {
      stat: 'Reactive',
      headline: 'No technology roadmap.',
      body: 'Without a clear strategy, every decision is reactive — you buy what’s urgent, not what’s strategic. The result is a patchwork that doesn’t connect.',
    },
    {
      stat: '#1 failure',
      headline: 'Building in the wrong order.',
      body: 'Most businesses build tools before fixing the underlying process. The result is faster bad processes. Strategy first means you build the right thing.',
    },
    {
      stat: 'Months wasted',
      headline: 'Analysis paralysis.',
      body: 'The volume of options and conflicting advice leaves decision-makers frozen. An independent expert cuts through the noise and gives you a clear, reasoned path.',
    },
    {
      stat: 'Avoidable',
      headline: 'Paying to learn on the job.',
      body: 'Technology mistakes are expensive and slow to fix. One consultation surfaces the pitfalls before you hit them — not six months after.',
    },
  ],
  process: [
    {
      when: 'Week 1',
      title: 'Context & discovery',
      body: 'We listen. What you do, what hurts, what you’ve tried, where the business is going. Zero assumptions.',
    },
    {
      when: 'Week 2',
      title: 'Analysis',
      body: 'We map the current stack, the workflows, the costs (real and hidden), and the obvious gaps. Evidence, not opinion.',
    },
    {
      when: 'Week 2–3',
      title: 'Strategy & report',
      body: 'A clear written report. Priorities, sequencing, budget bands, and what to NOT do. Plain English throughout.',
    },
    {
      when: 'Ongoing',
      title: 'Implementation support',
      body: 'Optional follow-on calls during execution. We stay independent — we don’t build it unless you ask separately.',
    },
  ],
  deliverables: [
    'Technology roadmap aligned to where the business is going',
    'Operations and process audit',
    'Software selection support — without vendor bias',
    'Digital transformation strategy',
    'Data and reporting strategy',
    'Pre-investment review for big software decisions',
    'Written report you own and can share with your board',
  ],
  industries: [
    {
      name: 'Oil & Gas',
      pain: 'Field operations, compliance, and HSE technology strategy — permit systems through reporting infrastructure.',
    },
    {
      name: 'Construction',
      pain: 'Project management, subcontractor, and site-operations tech — evaluated against your actual workflow.',
    },
    {
      name: 'Government & Public Sector',
      pain: 'Citizen service transformation, procurement compliance, and legacy system strategy — realistic and evidence-based.',
    },
    {
      name: 'Education & Training',
      pain: 'Student experience, LMS, and administration strategy aligned to your institution’s needs.',
    },
    {
      name: 'SMEs Scaling Operations',
      pain: 'Foundations for growth — what to build now, what to defer, how to scale without technical debt.',
    },
  ],
  stats: [
    { value: '$0', label: 'Vendor commission', sub: 'We don’t take kickbacks from any software vendor. Ever.' },
    { value: '2–3 wks', label: 'Audit duration', sub: 'From kickoff to written report — fast enough to act on.' },
    { value: 'Free', label: 'First session', sub: 'A free initial consultation. No pitch deck, no hard sell.' },
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
      q: 'What if we just need a quick second opinion?',
      a: 'That’s often the most valuable engagement. A one-session consult on a single decision (build vs buy, vendor X vs Y, scope of an upcoming project) can save weeks. Reach out — we’ll tell you up front if you even need us.',
    },
    {
      q: 'Will the consultation push us toward your other services?',
      a: 'Only when it’s the right answer. We routinely recommend off-the-shelf tools, in-house builds, or doing nothing yet. If the answer is build, we’ll tell you — and you’re free to take that to anyone.',
    },
  ],
  cta: {
    eyebrow: '06 — Start',
    headline: 'Get an honest read.',
    sub: 'Free first session. No deck. We listen, ask sharp questions, and tell you what we’d do if it were our business.',
    primary: { label: 'Book a free session', href: '#enquiry' },
    secondary: { label: 'All services', href: '/services' },
  },
};

export default function ConsultationPage() {
  return <ServiceDetailLayout data={data} />;
}
