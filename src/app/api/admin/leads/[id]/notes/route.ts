import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: 'Note content is required' }, { status: 400 });
    }

    const note = await prisma.leadNote.create({
      data: {
        leadId: id,
        content: content.trim(),
        authorId: (session.user as any).id,
      },
      include: { author: { select: { id: true, firstName: true, lastName: true } } },
    });

    await prisma.leadActivity.create({
      data: {
        leadId: id,
        type: 'NOTE_ADDED',
        description: 'Note added',
        performedBy: (session.user as any).id,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add note' }, { status: 500 });
  }
}
