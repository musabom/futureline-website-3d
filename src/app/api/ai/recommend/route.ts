import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { goal, skillLevel, deliveryPref, budget } = await req.json();

    const where: any = { status: 'PUBLISHED' };

    if (skillLevel) where.level = skillLevel;
    if (deliveryPref) where.deliveryType = deliveryPref;

    const courses = await prisma.course.findMany({ where });

    let scored = courses.map((course) => {
      let matchScore = 0;

      if (goal) {
        const goalLower = goal.toLowerCase();
        const titleMatch = course.title.toLowerCase().includes(goalLower);
        const descMatch = course.shortDescription.toLowerCase().includes(goalLower);
        const catMatch = course.category.toLowerCase().includes(goalLower);
        if (titleMatch) matchScore += 30;
        if (descMatch) matchScore += 20;
        if (catMatch) matchScore += 25;

        const goalWords = goalLower.split(/\s+/).filter((w: string) => w.length > 2);
        goalWords.forEach((word: string) => {
          if (course.title.toLowerCase().includes(word)) matchScore += 10;
          if (course.category.toLowerCase().includes(word)) matchScore += 8;
          if (course.shortDescription.toLowerCase().includes(word)) matchScore += 5;
          if (course.fullDescription.toLowerCase().includes(word)) matchScore += 3;
        });
      }

      if (skillLevel && course.level === skillLevel) matchScore += 15;
      if (deliveryPref && course.deliveryType === deliveryPref) matchScore += 10;

      const effectivePrice = course.discountPrice ?? course.price;
      if (budget && effectivePrice <= budget) matchScore += 10;

      return { ...course, matchScore };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    const recommendations = scored.slice(0, 3).filter((c) => c.matchScore > 0);

    return NextResponse.json({ recommendations });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 });
  }
}
