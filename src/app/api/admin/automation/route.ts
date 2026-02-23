import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rules = await prisma.automationRule.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(rules);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch automation rules' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, triggerType, triggerConfig, actionType, actionConfig, delayHours } = await req.json();
    if (!name || !triggerType || !actionType) {
      return NextResponse.json({ error: 'Name, trigger type and action type are required' }, { status: 400 });
    }

    const rule = await prisma.automationRule.create({
      data: {
        name,
        description,
        triggerType,
        triggerConfig: triggerConfig || {},
        actionType,
        actionConfig: actionConfig || {},
        delayHours: delayHours || 0,
      },
    });

    return NextResponse.json(rule);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create automation rule' }, { status: 500 });
  }
}
