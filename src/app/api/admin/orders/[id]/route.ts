import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notifyNewEnrollment, notifyOrderRejected } from '@/lib/notifications';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await req.json();

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (action === 'approve') {
      const [updatedOrder] = await prisma.$transaction([
        prisma.order.update({
          where: { id },
          data: { paymentStatus: 'COMPLETED' },
        }),
        prisma.enrollment.upsert({
          where: { userId_courseId: { userId: order.userId, courseId: order.courseId } },
          create: { userId: order.userId, courseId: order.courseId },
          update: {},
        }),
      ]);

      const [user, course] = await Promise.all([
        prisma.user.findUnique({ where: { id: order.userId }, select: { firstName: true, lastName: true, email: true } }),
        prisma.course.findUnique({ where: { id: order.courseId }, select: { title: true, slug: true } }),
      ]);

      if (user && course) {
        notifyNewEnrollment(
          { name: `${user.firstName} ${user.lastName}`.trim(), email: user.email },
          { title: course.title, slug: course.slug }
        ).catch(err => console.error('[OrderApproval] Failed to send enrollment email:', err));
      }

      return NextResponse.json(updatedOrder);
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { paymentStatus: 'FAILED' },
    });

    const [user, course] = await Promise.all([
      prisma.user.findUnique({ where: { id: order.userId }, select: { firstName: true, lastName: true, email: true } }),
      prisma.course.findUnique({ where: { id: order.courseId }, select: { title: true } }),
    ]);

    if (user && course) {
      notifyOrderRejected(
        { name: `${user.firstName} ${user.lastName}`.trim(), email: user.email },
        { title: course.title }
      ).catch(err => console.error('[OrderRejection] Failed to send rejection email:', err));
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[ORDER-ACTION] Error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
