import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase/service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const posts = await db.getPosts();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartflow-ai-blog.vercel.app';

  const itemsXml = posts
    .map(
      post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid>${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
      <description><![CDATA[${post.meta_description}]]></description>
      <author>editorial@smartflow.ai (SmartFlow AI)</author>
    </item>`
    )
    .join('');

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SmartFlow AI Blog</title>
    <link>${siteUrl}</link>
    <description>Autonomous AI workflows, budget tech, and developer stacks for solopreneurs.</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
