import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, updates } = await req.json();

    const course = await prisma.course.findFirst({
      where: { id: courseId, instructorId: session.user.id },
    });
    if (!course) {
      return NextResponse.json({ error: 'Course not found or not yours' }, { status: 403 });
    }

    const lessonIds = updates.map((u: any) => u.id);
    const lessons = await prisma.lesson.findMany({
      where: { id: { in: lessonIds }, courseId },
    });
    if (lessons.length !== lessonIds.length) {
      return NextResponse.json({ error: 'Invalid lesson IDs' }, { status: 400 });
    }

    await prisma.$transaction(
      updates.map((u: any) =>
        prisma.lesson.update({
          where: { id: u.id },
          data: { orderIndex: u.orderIndex },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}
