import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId, moduleOrder } = await req.json();

    if (!courseId || !Array.isArray(moduleOrder)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { orderIndex: 'asc' },
    });

    const moduleGroups: Record<string, typeof lessons> = {};
    const existingModuleOrder: string[] = [];
    for (const lesson of lessons) {
      if (!moduleGroups[lesson.moduleTitle]) {
        moduleGroups[lesson.moduleTitle] = [];
        existingModuleOrder.push(lesson.moduleTitle);
      }
      moduleGroups[lesson.moduleTitle].push(lesson);
    }

    const finalOrder = [...moduleOrder];
    for (const name of existingModuleOrder) {
      if (!finalOrder.includes(name)) {
        finalOrder.push(name);
      }
    }

    let currentIndex = 0;
    const updates: Promise<any>[] = [];

    for (const moduleName of finalOrder) {
      const moduleLessons = moduleGroups[moduleName];
      if (!moduleLessons) continue;

      for (const lesson of moduleLessons) {
        if (lesson.orderIndex !== currentIndex) {
          updates.push(
            prisma.lesson.update({
              where: { id: lesson.id },
              data: { orderIndex: currentIndex },
            })
          );
        }
        currentIndex++;
      }
    }

    if (updates.length > 0) {
      await Promise.all(updates);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}
