import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { enrollmentId, progressPercentage } = await req.json();

    if (typeof enrollmentId !== 'string' || !enrollmentId) {
      return NextResponse.json({ error: 'Invalid enrollmentId' }, { status: 400 });
    }
    // Guard against undefined/NaN/negative — an unvalidated value flows
    // straight into a numeric DB column (NaN throws) and the completed flag.
    const pct = Number(progressPercentage);
    if (!Number.isFinite(pct)) {
      return NextResponse.json({ error: 'Invalid progressPercentage' }, { status: 400 });
    }
    const clamped = Math.max(0, Math.min(100, pct));

    const enrollment = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
    if (!enrollment || enrollment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progressPercentage: clamped,
        completed: clamped >= 100,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
