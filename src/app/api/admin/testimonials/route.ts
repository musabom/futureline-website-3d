import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(testimonials);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const data = await req.json();
    const testimonial = await prisma.testimonial.create({ data });
    return NextResponse.json(testimonial);
  } catch (error: any) {
    return NextResponse.json({ error: "An error occurred" || 'Failed' }, { status: 400 });
  }
}
