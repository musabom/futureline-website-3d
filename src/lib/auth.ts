import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = 'https://futureline.ai';
}

export const authOptions: NextAuthOptions = {
  providers: [
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

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) return null;
          if (!user.isActive) return null;

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.warn(`[AUTH] Failed login attempt`);
            return null;
          }

          console.info(`[AUTH] Successful login`);
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
  ],
  session: { 
    strategy: 'jwt',
    maxAge: 60 * 60 * 2, // 2 hours absolute session limit
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
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
