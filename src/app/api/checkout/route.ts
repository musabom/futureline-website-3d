import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await req.json();
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });
    if (existing) {
      return NextResponse.json({ enrolled: true, slug: course.slug, message: 'Already enrolled' });
    }

    if (course.seatCapacity) {
      const enrollmentCount = await prisma.enrollment.count({ where: { courseId } });
      if (enrollmentCount >= course.seatCapacity) {
        return NextResponse.json({ error: 'Course is full' }, { status: 400 });
      }
    }

    await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId: course.id,
      },
    });

    return NextResponse.json({ enrolled: true, slug: course.slug });
  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json({ error: 'Enrollment failed' }, { status: 500 });
  }
}
