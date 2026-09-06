/**
 * POST /api/waitlist — record a signed-in visitor's place on a course waitlist.
 *
 * The "Join the waitlist" button in the Vibe Coding promo sends people through
 * Google sign-in and returns them to the course page with ?waitlist=<slug>;
 * the page then calls here. Without this the button would just be a sign-in
 * link and nobody would ever know who wanted the course.
 *
 * A waitlist entry is a Lead tagged with the course, so it lands in the CRM
 * the team already works from rather than a table nobody looks at.
 *
 * Requires a session: the identity comes from the signed-in user, never from
 * the request body, so this can't be used to enrol somebody else.
 */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notifyLeadConfirmation, notifyAdminNewLead } from '@/lib/notifications';

/** Courses that can be joined this way, and how they should read in the CRM. */
const WAITLISTS: Record<string, { title: string; source: string }> = {
  'vibe-coding': { title: 'Vibe Coding — waitlist', source: 'Vibe Coding Waitlist' },
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const slug = typeof body?.course === 'string' ? body.course : '';
    const course = WAITLISTS[slug];
    if (!course) {
      return NextResponse.json({ error: 'Unknown waitlist' }, { status: 400 });
    }

    // People land back on the course page every time they sign in, and they
    // reload pages. Joining twice should be a no-op, not a duplicate lead.
    const existing = await prisma.lead.findFirst({
      where: { email, tourType: course.title },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ success: true, already: true });
    }

    // Google gives us a single display name; the CRM wants two fields.
    const parts = (session.user?.name ?? '').trim().split(/\s+/).filter(Boolean);
    const firstName = parts[0] || email.split('@')[0];
    const lastName = parts.slice(1).join(' ') || '—';

    const message =
      'Requested a place on the Vibe Coding waitlist at the early price of OMR 99 (instead of OMR 149).';

    const lead = await prisma.lead.create({
      data: {
        firstName,
        lastName,
        email,
        tourType: course.title,
        message,
        source: course.source,
        stage: 'NEW',
        priority: 'MEDIUM',
        tags: 'waitlist,vibe-coding',
      },
    });

    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        type: 'LEAD_CREATED',
        description: `Joined the ${course.title} via the course promo`,
      },
    });

    // Not awaited: the visitor shouldn't wait on the mail provider to see
    // their confirmation.
    notifyLeadConfirmation({
      name: firstName,
      email,
      topic: course.title,
      message,
      source: course.source,
    });
    notifyAdminNewLead({
      name: `${firstName} ${lastName}`.trim(),
      email,
      tourType: course.title,
      message,
      source: course.source,
    });

    return NextResponse.json({ success: true, id: lead.id });
  } catch (error) {
    console.error('Waitlist join error:', error);
    return NextResponse.json({ error: 'Failed to join the waitlist' }, { status: 500 });
  }
}
