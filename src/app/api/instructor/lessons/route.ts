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

async function verifyCourseBelongsToInstructor(courseId: string, instructorId: string) {
  const course = await prisma.course.findFirst({
    where: { id: courseId, instructorId },
  });
  if (!course) throw new Error('Course not found or not yours');
  return course;
}

export async function GET(req: Request) {
  try {
    const session = await requireInstructor();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    if (!courseId) return NextResponse.json([]);

    await verifyCourseBelongsToInstructor(courseId, session.user.id);

    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { orderIndex: 'asc' },
    });
    return NextResponse.json(lessons);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireInstructor();
    const data = await req.json();
    await verifyCourseBelongsToInstructor(data.courseId, session.user.id);

    const lesson = await prisma.lesson.create({ data });
    return NextResponse.json(lesson);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
