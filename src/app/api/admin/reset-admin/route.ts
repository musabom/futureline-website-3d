import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, email, newPassword } = body;

    if (!secret || secret !== process.env.ADMIN_RESET_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email and newPassword are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    return NextResponse.json({ success: true, message: 'Admin password and role updated successfully' });
  } catch (error) {
    console.error('Reset admin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
