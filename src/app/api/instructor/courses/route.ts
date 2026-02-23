import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    const data = await req.json();
    const course = await prisma.course.create({
      data: {
        ...data,
        instructorId: session.user.id,
        approvalStatus: 'PENDING',
      },
    });
    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 400 });
  }
}
