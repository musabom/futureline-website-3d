import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { courseSchema, formatZodError, normalizeCourseData } from '@/lib/validations';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function GET() {
  try {
    await requireAdmin();
    const courses = await prisma.course.findMany({
      include: { instructor: { select: { firstName: true, lastName: true } }, _count: { select: { enrollments: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(courses);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const parsed = courseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }
    const normalized = normalizeCourseData(parsed.data);

    // Same slot-uniqueness handling as PUT — if creating with a slot that's
    // already taken, transactionally clear the prior holder so newest wins.
    const course = await prisma.$transaction(async (tx) => {
      if (typeof normalized.featuredSlot === 'number') {
        await tx.course.updateMany({
          where: { featuredSlot: normalized.featuredSlot },
          data: { featuredSlot: null },
        });
      }
      return tx.course.create({ data: normalized });
    });

    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json({ error: "An error occurred" }, { status: 400 });
  }
}
