import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, description, metadata } = await req.json();
    if (!type || !description) {
      return NextResponse.json({ error: 'Type and description required' }, { status: 400 });
    }

    const activity = await prisma.leadActivity.create({
      data: {
        leadId: params.id,
        type,
        description,
        metadata: metadata || undefined,
        performedBy: (session.user as any).id,
      },
    });

    if (type === 'EMAIL_SENT' || type === 'CALL' || type === 'MESSAGE') {
      await prisma.lead.update({
        where: { id: params.id },
        data: { lastContactedAt: new Date() },
      });
    }

    return NextResponse.json(activity);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 });
  }
}
