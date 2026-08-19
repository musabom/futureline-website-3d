import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { rateLimit } from './rateLimit';

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
    async jwt({ token, user }) {
      if (user) {
        // Credentials sign-in carries role/firstName/lastName. Google (OAuth)
        // only gives us name/email/image, so derive names from `name` and
        // default the role — otherwise the session would read "undefined
        // undefined" and have no role.
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
