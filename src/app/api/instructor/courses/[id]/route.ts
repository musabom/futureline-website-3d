import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { normalizeCourseData } from '@/lib/validations';

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

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { course } = await requireInstructorOwnership(id);
    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireInstructorOwnership(id);
    const data = await req.json();
    delete data.instructorId;
    delete data.approvalStatus;
    const updated = await prisma.course.update({
      where: { id: id },
      data: { ...normalizeCourseData(data), approvalStatus: 'PENDING' },
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireInstructorOwnership(id);

    const [enrollmentCount, orderCount] = await Promise.all([
      prisma.enrollment.count({ where: { courseId: id } }),
      prisma.order.count({ where: { courseId: id } }),
    ]);

    if (enrollmentCount > 0 || orderCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete this course — it has ${enrollmentCount} enrolled student(s) and ${orderCount} order(s). Please contact an admin to remove it.` },
        { status: 400 }
      );
    }

    await prisma.course.delete({ where: { id: id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
