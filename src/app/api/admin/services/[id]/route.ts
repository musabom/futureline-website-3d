import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const data = await req.json();
    const { id: _id, createdAt, ...updateData } = data;
    const service = await prisma.service.update({ where: { id: id }, data: updateData });
    return NextResponse.json(service);
  } catch (error: any) {
    return NextResponse.json({ error: "An error occurred" || 'Failed' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await prisma.service.delete({ where: { id: id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "An error occurred" || 'Failed' }, { status: 400 });
  }
}
