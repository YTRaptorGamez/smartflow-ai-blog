import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/service';
import { submitToIndexNow } from '@/lib/seo/indexnow';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartflow-ai-blog.vercel.app';

  try {
    const [posts, threads] = await Promise.all([
      db.getPosts(),
      db.getThreads(),
    ]);

    const urls = [
      siteUrl,
      `${siteUrl}/blog`,
      `${siteUrl}/forum`,
      ...posts.map(p => `${siteUrl}/blog/${p.slug}`),
      ...threads.map(t => `${siteUrl}/forum/${t.slug}`),
    ];

    const success = await submitToIndexNow(urls);

    return NextResponse.json({
      success,
      submitted_count: urls.length,
      urls,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
