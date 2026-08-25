import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { prisma } from './prisma';
import { rateLimit } from './rateLimit';
import { notifyWelcome } from './notifications';

// Default to the production origin only in production. In dev, leaving this
// unset lets NextAuth infer the URL from the request host (localhost), so the
// Google OAuth callback doesn't wrongly redirect to the prod domain. Set
// NEXTAUTH_URL in .env.local to be explicit when testing Google locally.
if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === 'production') {
  process.env.NEXTAUTH_URL = 'https://futureline.ai';
}

// Google is optional: the button on the get-started sign-in page always
// renders, but the provider only lights up when both OAuth secrets are
// present. Without them we simply don't register the provider, so builds
// and the existing email/password login are unaffected.
const providers: NextAuthOptions['providers'] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Always show Google's account-chooser screen (like the reference)
      // instead of silently reusing an existing Google session.
      authorization: { params: { prompt: 'select_account' } },
    }),
  );
}

providers.push(
  CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const rl = await rateLimit(`login:${credentials.email}`, 5, 60 * 1000);
        if (!rl.success) {
          console.warn(`[AUTH] Rate limit exceeded for ${credentials.email}`);
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) return null;
          if (!user.isActive) return null;

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.warn(`[AUTH] Failed login attempt for ${credentials.email}`);
            return null;
          }

          console.info(`[AUTH] Successful login for ${credentials.email}`);
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`.trim(),
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          };
        } catch (error) {
          console.error('[AUTH DEBUG] Error in authorize:', error);
          return null;
        }
      },
    }),
);

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 2, // 2 hours absolute session limit
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    // OAuth failures (including a cancelled Google consent) are routed here.
    // Google is the only OAuth provider and it's used solely by the
    // get-started flow, so we send errors back to that Welcome page, which
    // reads ?error and shows a friendly message. Credentials sign-in uses
    // redirect:false and surfaces its own inline errors, so admin/instructor
    // login is unaffected by this.
    error: '/get-started/signin',
  },
  callbacks: {
    // Persist Google (OAuth) sign-ins to the User table. There is no NextAuth
    // adapter (jwt strategy), so without this a Google user would have a
    // session whose id is the Google `sub` — matching no User row — and every
    // downstream prisma.user lookup (checkout, change-password, enrolment)
    // would fail. Upsert by email links to an existing credentials account of
    // the same email rather than creating a duplicate.
    async signIn({ user, account }) {
      if (account?.provider !== 'google') return true;
      const email = user.email;
      if (!email) return false;

      const existing = await prisma.user.findUnique({
        where: { email },
        select: { isActive: true },
      });
      if (existing && !existing.isActive) return false; // deactivated account

      if (!existing) {
        const nameParts = (user.name ?? '').trim().split(/\s+/).filter(Boolean);
        // Random password — Google users authenticate via OAuth, never with a
        // password, but the column is required and credentials login must fail.
        const randomPassword = await bcrypt.hash(randomBytes(24).toString('hex'), 12);
        await prisma.user.create({
          data: {
            email,
            firstName: nameParts[0] ?? '',
            lastName: nameParts.slice(1).join(' '),
            image: (user as any).image ?? null,
            password: randomPassword,
            role: 'CUSTOMER',
          },
        });

        // Credentials sign-up sends a welcome from /api/auth/register; Google
        // sign-up had no equivalent, so first-time Google users received
        // nothing at all. Fire-and-forget so a mail failure can't block login.
        notifyWelcome({
          name: `${nameParts[0] ?? ''} ${nameParts.slice(1).join(' ')}`.trim() || 'there',
          email,
        }).catch((err) => console.error('[AUTH] Welcome email failed:', err));
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Google: resolve the token to the real DB row (created/linked in the
        // signIn callback) so session.user.id is a valid User id, not the
        // Google `sub`.
        if (account?.provider === 'google' && user.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { id: true, role: true, firstName: true, lastName: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;
            return token;
          }
        }
        // Credentials sign-in carries role/firstName/lastName.
        const nameParts = (user.name ?? '').trim().split(/\s+/).filter(Boolean);
        token.id = user.id;
        token.role = (user as any).role ?? token.role ?? 'CUSTOMER';
        token.firstName = (user as any).firstName ?? nameParts[0] ?? '';
        token.lastName = (user as any).lastName ?? nameParts.slice(1).join(' ') ?? '';
      } else if (token.id) {
        // C1: Re-verify role from DB on refresh to prevent stale admin sessions
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
          }
        } catch (error) {
          console.error('[AUTH] Failed to refresh token role:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).firstName = token.firstName;
        (session.user as any).lastName = token.lastName;
        session.user.name = `${token.firstName} ${token.lastName}`.trim();
      }
      return session;
    },
  },
};
