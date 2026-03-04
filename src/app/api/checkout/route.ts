import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notifyNewEnrollment } from '@/lib/notifications';
import { rateLimit, getRateLimitHeaders } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = req.headers.get('x-forwarded-for') || session.user.id;
    const rl = rateLimit(`checkout:${ip}`, 10, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: getRateLimitHeaders(rl.remaining, rl.resetIn) }
      );
    }

    const { courseId } = await req.json();
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    });
    if (existing) {
      return NextResponse.json({ enrolled: true, slug: course.slug, message: 'Already enrolled' });
    }

    if (course.price > 0) {
      return NextResponse.json({
        paymentRequired: true,
        message: 'This is a paid course. Online payment will be available soon. Please contact us to enrol.',
      });
    }

    if (course.seatCapacity) {
      const enrollmentCount = await prisma.enrollment.count({ where: { courseId } });
      if (enrollmentCount >= course.seatCapacity) {
        return NextResponse.json({ error: 'Course is full' }, { status: 400 });
      }
    }

    await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId: course.id,
      },
    });

    notifyNewEnrollment(
      { name: `${(session.user as any).firstName || ''} ${(session.user as any).lastName || ''}`.trim() || 'Student', email: session.user.email || '' },
      { title: course.title, slug: course.slug }
    );

    return NextResponse.json({ enrolled: true, slug: course.slug });
  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json({ error: 'Enrollment failed' }, { status: 500 });
  }
}
