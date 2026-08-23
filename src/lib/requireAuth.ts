import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

export async function requireAuth(roles?: string[]) {
  const session = await getServerSession(authOptions);
  // Keep the visitor's active locale on the redirect. With localePrefix
  // 'always' every route is prefixed, so a bare '/login' would 307 to the
  // English '/en/login' and strip an Arabic user's locale.
  const locale = await getLocale();
  if (!session) redirect(`/${locale}/login`);
  if (roles && !roles.includes(session.user.role)) redirect(`/${locale}/dashboard`);
  return session;
}
