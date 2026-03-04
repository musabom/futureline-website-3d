import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function GET() {
  try {
    await requireAdmin();
    const instructors = await prisma.user.findMany({
      where: { role: 'INSTRUCTOR' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        bio: true,
        commissionRate: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            courses: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const instructorsWithStats = await Promise.all(
      instructors.map(async (instructor) => {
        const enrollmentCount = await prisma.enrollment.count({
          where: { course: { instructorId: instructor.id } },
        });
        return {
          ...instructor,
          totalStudents: enrollmentCount,
        };
      })
    );

    return NextResponse.json(instructorsWithStats);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
