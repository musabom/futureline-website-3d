import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized');
  return session;
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireAdmin();
    const course = await prisma.course.findUnique({ where: { id: id } });
    if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(course);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireAdmin();
    const data = await req.json();
    const { id: _id, createdAt, instructor, _count, ...updateData } = data;
    const course = await prisma.course.update({ where: { id: id }, data: updateData });
    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireAdmin();

    // Delete all related records first to allow course deletion
    await prisma.$transaction([
      prisma.lesson.deleteMany({ where: { courseId: id } }),
      prisma.enrollment.deleteMany({ where: { courseId: id } }),
      prisma.order.deleteMany({ where: { courseId: id } }),
      prisma.instructorEarning.deleteMany({ where: { courseId: id } }),
      prisma.course.delete({ where: { id: id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 400 });
  }
}
