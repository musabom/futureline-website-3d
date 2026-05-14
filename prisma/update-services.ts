/**
 * Run with:  npx tsx prisma/update-services.ts
 *
 * Updates the 4 core FutureLine services with marketing-grade descriptions.
 * Matches by title (case-insensitive contains) so it works regardless of
 * whether the title has a trailing space, different casing, etc.
 * If a service doesn't exist yet it will be created.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SERVICES = [
  {
    match: 'digitalisation',
    data: {
      title: 'Digitalisation',
      description:
        'Transform paper-heavy, manual operations into lean digital workflows. We map your existing processes, eliminate bottlenecks, and deploy tailored digital tools that give every level of your business — from field operations to the boardroom — real-time clarity and control.',
      category: 'Digital',
      pricingModel: 'Custom Quote',
      featured: true,
      status: 'ACTIVE',
    },
  },
  {
    match: 'custom software',
    data: {
      title: 'Custom Software',
      description:
        'Off-the-shelf software is built for everyone — which means it fits no one perfectly. We design and build bespoke applications engineered precisely around your workflows. Fully owned by you, built to scale with you, and maintained on your terms.',
      category: 'Digital',
      pricingModel: 'Fixed Price / Retainer',
      featured: true,
      status: 'ACTIVE',
    },
  },
  {
    match: 'automation',
    data: {
      title: 'Automations',
      description:
        'Stop paying skilled people to do what machines do better. We identify the repetitive, error-prone tasks consuming your team\'s time and replace them with reliable automated pipelines — freeing your workforce to focus on high-value, high-impact work.',
      category: 'AI & Automation',
      pricingModel: 'Custom Quote',
      featured: true,
      status: 'ACTIVE',
    },
  },
  {
    match: 'consult',
    data: {
      title: 'Consultation',
      description:
        'Not sure where to start? Our experts sit alongside your leadership team, audit your current operations end-to-end, and produce a clear, prioritised technology roadmap. No jargon, no vendor lock-in — just an honest plan that makes business and commercial sense.',
      category: 'Consulting',
      pricingModel: 'Day Rate',
      featured: false,
      status: 'ACTIVE',
    },
  },
];

async function main() {
  console.log('🔧 Updating FutureLine services...\n');

  for (const svc of SERVICES) {
    // Try to find an existing service by title (case-insensitive)
    const existing = await prisma.service.findFirst({
      where: { title: { contains: svc.match, mode: 'insensitive' } },
    });

    if (existing) {
      await prisma.service.update({
        where: { id: existing.id },
        data: svc.data,
      });
      console.log(`✅  Updated  → ${svc.data.title}`);
    } else {
      await prisma.service.create({ data: svc.data });
      console.log(`🆕  Created  → ${svc.data.title}`);
    }
  }

  console.log('\n✨ Done.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
