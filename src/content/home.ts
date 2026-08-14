/**
 * Home page content, sourced from the FutureLine company profile.
 *
 * Most section copy is co-located in its own component, matching the repo's
 * existing convention (TOPICS in NeuralPathway, SERVICE_CARDS in
 * DualWalkway). The FAQ lives here instead because it is consumed twice —
 * once to render the accordion and once to emit FAQPage JSON-LD — and those
 * two must never drift apart.
 */

export interface FaqItem {
  question: string;
  answer: string;
}

export const HOME_FAQ: FaqItem[] = [
  {
    question: "Our data can't leave our premises. Can you still build for us?",
    answer:
      'Yes — that is what our Safe Build Protocol is for. We build inside closed environments for government entities and organisations with sensitive data, so nothing ever leaves your walls.',
  },
  {
    question: 'What is the Vibe Coding programme?',
    answer:
      'It takes you from an idea to a deployed product with no programming background. You finish the programme with a real, published product rather than a certificate.',
  },
  {
    question: 'How fast can we see something working?',
    answer:
      'Days, not months. We take an idea to a working prototype quickly, prove the case, and only then talk about larger investment.',
  },
];

/** FAQPage structured data — same source as the rendered accordion. */
export function faqJsonLd(items: FaqItem[] = HOME_FAQ) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
