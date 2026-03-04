import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireAdmin();
    const data = await req.json();

    const updateData: any = {};
    if (data.commissionRate !== undefined) updateData.commissionRate = data.commissionRate;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.bio !== undefined) updateData.bio = data.bio;

    const updated = await prisma.user.update({
      where: { id: id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: "An error occurred" }, { status: 400 });
  }
}
