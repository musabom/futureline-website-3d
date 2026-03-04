import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const settings = await prisma.aISettings.findFirst();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const data = await req.json();
    let settings = await prisma.aISettings.findFirst();
    if (settings) {
      settings = await prisma.aISettings.update({ where: { id: settings.id }, data });
    } else {
      settings = await prisma.aISettings.create({ data });
    }
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: "An error occurred" || 'Failed' }, { status: 400 });
  }
}
