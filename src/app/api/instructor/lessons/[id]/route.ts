import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireInstructorLessonOwnership(lessonId: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized');
  }
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: { select: { instructorId: true } } },
  });
  if (!lesson || lesson.course.instructorId !== session.user.id) {
    throw new Error('Lesson not found or not yours');
  }
  return { session, lesson };
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireInstructorLessonOwnership(params.id);
    const data = await req.json();
    delete data.courseId;
    const updated = await prisma.lesson.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireInstructorLessonOwnership(params.id);
    await prisma.lesson.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
