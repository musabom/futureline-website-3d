import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, reason } = await req.json();

    if (action === 'approve') {
      await prisma.course.update({
        where: { id: id },
        data: { approvalStatus: 'APPROVED', rejectionReason: null },
      });
    } else if (action === 'reject') {
      await prisma.course.update({
        where: { id: id },
        data: { approvalStatus: 'REJECTED', rejectionReason: reason || null },
      });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "An error occurred" || 'Failed' }, { status: 500 });
  }
}
