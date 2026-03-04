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

    const { courseId, oldName, newName } = await req.json();

    const course = await prisma.course.findFirst({
      where: { id: courseId, instructorId: session.user.id },
    });
    if (!course) {
      return NextResponse.json({ error: 'Course not found or not yours' }, { status: 403 });
    }

    await prisma.lesson.updateMany({
      where: { courseId, moduleTitle: oldName },
      data: { moduleTitle: newName.trim() },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "An error occurred" || 'Failed' }, { status: 500 });
  }
}
