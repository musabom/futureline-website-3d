import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

if (!process.env.NEXTAUTH_URL && process.env.REPLIT_DOMAINS) {
  const domain = process.env.REPLIT_DOMAINS.split(',')[0];
  process.env.NEXTAUTH_URL = `https://${domain}`;
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
        console.log('[AUTH DEBUG] authorize called, email:', credentials?.email);
        console.log('[AUTH DEBUG] NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
        console.log('[AUTH DEBUG] NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
        console.log('[AUTH DEBUG] SESSION_SECRET exists:', !!process.env.SESSION_SECRET);
        console.log('[AUTH DEBUG] DATABASE_URL exists:', !!process.env.DATABASE_URL);

        if (!credentials?.email || !credentials?.password) {
          console.log('[AUTH DEBUG] Missing credentials');
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          console.log('[AUTH DEBUG] User found:', !!user, user ? `id=${user.id} role=${user.role} active=${user.isActive} email=${user.email}` : 'N/A');
          console.log('[AUTH DEBUG] Password hash prefix:', user ? user.password.substring(0, 20) : 'N/A');

          if (!user) return null;
          if (!user.isActive) {
            console.log('[AUTH DEBUG] User not active');
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          console.log('[AUTH DEBUG] Password valid:', isValid);
          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('[AUTH DEBUG] Error in authorize:', error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};
