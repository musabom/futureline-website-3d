import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ enrolled: true, message: 'Already enrolled' });
    }

    if (course.seatCapacity) {
      const enrollmentCount = await prisma.enrollment.count({ where: { courseId } });
      if (enrollmentCount >= course.seatCapacity) {
        return NextResponse.json({ error: 'Course is full' }, { status: 400 });
      }
    }

    const effectivePrice = course.discountPrice ?? course.price;

    if (process.env.STRIPE_SECRET_KEY) {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: course.title,
                description: course.shortDescription,
              },
              unit_amount: Math.round(effectivePrice * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXTAUTH_URL || req.headers.get('origin')}/dashboard?enrolled=${courseId}`,
        cancel_url: `${process.env.NEXTAUTH_URL || req.headers.get('origin')}/courses/${course.slug}`,
        metadata: {
          userId: session.user.id,
          courseId: course.id,
        },
      });

      return NextResponse.json({ url: checkoutSession.url });
    }

    await prisma.order.create({
      data: {
        userId: session.user.id,
        courseId: course.id,
        amount: effectivePrice,
        paymentStatus: 'COMPLETED',
      },
    });

    await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId: course.id,
      },
    });

    return NextResponse.json({ enrolled: true });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
