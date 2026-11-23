import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [posts, threads, queue, links, logs] = await Promise.all([
      db.getPosts(),
      db.getThreads(),
      db.getTopicQueue(),
      db.getAffiliateLinks(false),
      db.getCronLogs(),
    ]);

    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);
    const pendingTopics = queue.filter(q => q.status === 'pending').length;

    return NextResponse.json({
      totalPosts: posts.length,
      totalThreads: threads.length,
      totalViews,
      totalClicks,
      pendingTopics,
      totalAffiliateLinks: links.length,
      recentLogs: logs.slice(0, 10),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
