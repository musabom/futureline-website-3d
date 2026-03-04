// C2: Database-backed rate limiting for multi-instance deployments
import { db } from '@replit/database';

async function cleanup() {
  // Database-backed cleanup is handled by expiry/overwriting
}

export async function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): Promise<{ success: boolean; remaining: number; resetIn: number }> {
  const now = Date.now();
  const key = `rl:${identifier}`;
  
  try {
    const existing = await db.get(key) as string;
    let data = existing ? JSON.parse(existing) : null;

    if (!data || now > data.resetTime) {
      data = { count: 1, resetTime: now + windowMs };
      await db.set(key, JSON.stringify(data));
      return { success: true, remaining: limit - 1, resetIn: windowMs };
    }

    if (data.count >= limit) {
      return {
        success: false,
        remaining: 0,
        resetIn: data.resetTime - now,
      };
    }

    data.count++;
    await db.set(key, JSON.stringify(data));
    return {
      success: true,
      remaining: limit - data.count,
      resetIn: data.resetTime - now,
    };
  } catch (error) {
    console.error('[RATE-LIMIT] DB Error:', error);
    // Fallback to allow if DB fails
    return { success: true, remaining: 1, resetIn: windowMs };
  }
}

export function getRateLimitHeaders(remaining: number, resetIn: number) {
  return {
    'X-RateLimit-Remaining': String(remaining),
    'Retry-After': String(Math.ceil(resetIn / 1000)),
  };
}
