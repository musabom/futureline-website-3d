const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const CLEANUP_INTERVAL = 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

export function rateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): { success: boolean; remaining: number; resetIn: number } {
  cleanup();

  const now = Date.now();
  const key = identifier;
  const existing = rateLimitMap.get(key);

  if (!existing || now > existing.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1, resetIn: windowMs };
  }

  if (existing.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetIn: existing.resetTime - now,
    };
  }

  existing.count++;
  return {
    success: true,
    remaining: limit - existing.count,
    resetIn: existing.resetTime - now,
  };
}

export function getRateLimitHeaders(remaining: number, resetIn: number) {
  return {
    'X-RateLimit-Remaining': String(remaining),
    'Retry-After': String(Math.ceil(resetIn / 1000)),
  };
}
