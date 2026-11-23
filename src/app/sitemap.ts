import { MetadataRoute } from 'next';
import { db } from '@/lib/supabase/service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartflow.ai';

  const [posts, threads] = await Promise.all([
    db.getPosts(),
    db.getThreads(),
  ]);

  const postUrls = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const threadUrls = threads.map((thread) => ({
    url: `${siteUrl}/forum/${thread.slug}`,
    lastModified: new Date(thread.updated_at || thread.created_at),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/forum`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    ...postUrls,
    ...threadUrls,
  ];
}
