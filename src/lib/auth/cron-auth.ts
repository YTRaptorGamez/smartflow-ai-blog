import { NextRequest } from 'next/server';

export function verifyCronAuth(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET || 'dev_cron_secret_123';
  const adminSecret = process.env.ADMIN_SECRET || 'admin123';

  // Check Bearer authorization
  const authHeader = req.headers.get('authorization');
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (token === secret || token === adminSecret) {
      return true;
    }
  }

  // Check x-cron-secret header (common with custom cron providers like cron-job.org)
  const cronHeader = req.headers.get('x-cron-secret');
  if (cronHeader && (cronHeader === secret || cronHeader === adminSecret)) {
    return true;
  }

  // Check query param (?secret=...) for manual testing
  const url = new URL(req.url);
  const secretParam = url.searchParams.get('secret');
  if (secretParam && (secretParam === secret || secretParam === adminSecret)) {
    return true;
  }

  // In local development, if CRON_SECRET is unchanged default, allow testing
  if (process.env.NODE_ENV === 'development' && secret === 'dev_cron_secret_123') {
    return true;
  }

  return false;
}
