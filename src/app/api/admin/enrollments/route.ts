import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const enrollments = await prisma.enrollment.findMany({
      include: { user: { select: { firstName: true, lastName: true, email: true } }, course: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(enrollments);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
