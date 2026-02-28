import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { courseSchema, formatZodError } from '@/lib/validations';

async function requireInstructor() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function GET() {
  try {
    const session = await requireInstructor();
    const courses = await prisma.course.findMany({
      where: { instructorId: session.user.id },
      include: { _count: { select: { enrollments: true, lessons: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(courses);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireInstructor();
    const body = await req.json();
    const parsed = courseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }
    const course = await prisma.course.create({
      data: {
        ...parsed.data,
        instructorId: session.user.id,
        approvalStatus: 'PENDING',
      },
    });
    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 400 });
  }
}
