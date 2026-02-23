import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireInstructorOwnership(courseId: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'INSTRUCTOR') {
    throw new Error('Unauthorized');
  }
  const course = await prisma.course.findFirst({
    where: { id: courseId, instructorId: session.user.id },
  });
  if (!course) throw new Error('Course not found or not yours');
  return { session, course };
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { course } = await requireInstructorOwnership(params.id);
    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireInstructorOwnership(params.id);
    const data = await req.json();
    delete data.instructorId;
    delete data.approvalStatus;
    const updated = await prisma.course.update({
      where: { id: params.id },
      data: { ...data, approvalStatus: 'PENDING' },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireInstructorOwnership(params.id);
    await prisma.course.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
