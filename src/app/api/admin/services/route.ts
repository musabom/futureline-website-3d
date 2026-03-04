import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const services = await prisma.service.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(services);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const data = await req.json();
    const service = await prisma.service.create({ data });
    return NextResponse.json(service);
  } catch (error: any) {
    return NextResponse.json({ error: "An error occurred" || 'Failed' }, { status: 400 });
  }
}
