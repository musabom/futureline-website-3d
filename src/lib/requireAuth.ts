import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { redirect } from 'next/navigation';

export async function requireAuth(roles?: string[]) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  if (roles && !roles.includes(session.user.role)) redirect('/dashboard');
  return session;
}
