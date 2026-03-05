import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: instructorId } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, period, courseId, notes } = await req.json();
    if (!amount || !period) {
      return NextResponse.json({ error: 'Amount and period are required' }, { status: 400 });
    }

    const instructor = await prisma.user.findUnique({
      where: { id: instructorId },
      select: { commissionRate: true },
    });
    if (!instructor) {
      return NextResponse.json({ error: 'Instructor not found' }, { status: 404 });
    }

    const instructorCut = Number(amount);
    const platformRate = 1 - instructor.commissionRate / 100;
    const platformCut = instructorCut * (platformRate / (instructor.commissionRate / 100));

    const targetCourseId = courseId || (await prisma.course.findFirst({
      where: { instructorId },
      select: { id: true },
    }))?.id;

    if (!targetCourseId) {
      return NextResponse.json({ error: 'Instructor has no courses' }, { status: 400 });
    }

    const earning = await prisma.instructorEarning.create({
      data: {
        instructorId,
        courseId: targetCourseId,
        amount: instructorCut + platformCut,
        instructorCut,
        platformCut,
        period,
      },
    });

    return NextResponse.json(earning);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: instructorId } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { commissionRate } = await req.json();
    if (commissionRate === undefined || commissionRate < 0 || commissionRate > 100) {
      return NextResponse.json({ error: 'Commission rate must be between 0 and 100' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: instructorId },
      data: { commissionRate: Number(commissionRate) },
      select: { id: true, commissionRate: true },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
