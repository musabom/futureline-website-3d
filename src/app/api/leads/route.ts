import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { leadSchema, formatZodError } from '@/lib/validations';
import { rateLimit, getRateLimitHeaders } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rl = rateLimit(`leads:${ip}`, 5, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: getRateLimitHeaders(rl.remaining, rl.resetIn) }
      );
    }

    const body = await req.json();
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }
    const { firstName, lastName, email, phone, tourType, message, source } = parsed.data;

    const lead = await prisma.lead.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        tourType: tourType || 'General Enquiry',
        message,
        source: source || 'FL Tourism',
        stage: 'NEW',
        priority: 'MEDIUM',
      },
    });

    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: 'LEAD_CREATED',
        description: `New lead submitted via ${source || 'FL Tourism'} contact form`,
      },
    });

    return NextResponse.json({ success: true, id: lead.id });
  } catch (error) {
    console.error('Lead creation error:', error);
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
  }
}
