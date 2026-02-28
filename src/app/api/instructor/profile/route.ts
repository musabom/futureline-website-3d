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

export async function GET() {
  try {
    const session = await requireInstructor();
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        commissionRate: true,
        isActive: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await requireInstructor();
    const { name, bio } = await req.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        bio: bio?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        commissionRate: true,
        isActive: true,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
