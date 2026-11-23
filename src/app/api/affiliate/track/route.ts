import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Increment click counter asynchronously
  if (id) {
    try {
      await db.incrementAffiliateClick(id);
    } catch (err) {
      console.warn('Failed to increment affiliate click count:', err);
    }
  }

  // Safe redirect to affiliate destination
  try {
    const parsed = new URL(targetUrl);
    // Only allow HTTP and HTTPS protocols
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return NextResponse.redirect(targetUrl, 302);
    }
  } catch {
    // Malformed URL, redirect home
  }

  return NextResponse.redirect(new URL('/', req.url));
}
