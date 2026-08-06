import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/notifications';
import { rateLimit, getRateLimitHeaders } from '@/lib/rateLimit';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rl = await rateLimit(`forgot-password:${ip}`, 3, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: getRateLimitHeaders(rl.remaining, rl.resetIn) }
      );
    }

    const body = await req.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: 'If an account exists with that email, we have sent a password reset link.' },
        { status: 200 }
      );
    }

    const { email } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && user.isActive) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expiry = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: hashedToken,
          resetTokenExpiry: expiry,
        },
      });

      // Build the reset link from a trusted, server-configured base URL only.
      // NEVER derive it from the request Host / X-Forwarded-Proto headers:
      // those are attacker-controlled, so a spoofed Host would embed a valid
      // reset token into a link pointing at the attacker's domain
      // (host-header injection → account-takeover). If no base URL is
      // configured we refuse to send rather than send a poisonable link.
      const baseUrl = process.env.APP_URL || process.env.NEXTAUTH_URL;
      if (!baseUrl) {
        console.error(
          '[forgot-password] APP_URL / NEXTAUTH_URL is not set — refusing to send a reset link built from untrusted request headers.',
        );
        return NextResponse.json({
          message:
            'If an account exists with that email, we have sent a password reset link.',
        });
      }
      const resetUrl = `${baseUrl.replace(/\/$/, '')}/reset-password?token=${rawToken}`;

      await sendEmail({
        to: user.email,
        subject: 'FutureLine - Password Reset Request',
        body: `Dear ${user.firstName},\n\nWe received a request to reset your password.\n\nClick the link below to set a new password:\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nFutureLine Team`,
        metadata: { type: 'password_reset', userId: user.id },
      });
    }

    return NextResponse.json({
      message: 'If an account exists with that email, we have sent a password reset link.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({
      message: 'If an account exists with that email, we have sent a password reset link.',
    });
  }
}
