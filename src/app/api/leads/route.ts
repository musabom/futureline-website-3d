import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, tourType, message } = body;

    if (!name || !email || !tourType || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: { name, email, tourType, message },
    });

    return NextResponse.json({ success: true, id: lead.id });
  } catch (error) {
    console.error('Lead creation error:', error);
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Lead fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
