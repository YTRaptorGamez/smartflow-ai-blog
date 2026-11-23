import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/auth/cron-auth';
import { generateBlogPost } from '@/lib/ai/gemini';
import { db } from '@/lib/supabase/service';
import { submitToIndexNow } from '@/lib/seo/indexnow';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds max runtime for generative AI

export async function POST(req: NextRequest) {
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized. Invalid CRON_SECRET.' }, { status: 401 });
  }

  const startTime = Date.now();
  let topicOverride: string | undefined = undefined;

  try {
    const body = await req.json().catch(() => ({}));
    if (body.topic) {
      topicOverride = body.topic;
    }
  } catch {
    // No body provided
  }

  try {
    const { post, seededThread } = await generateBlogPost(topicOverride);
    const executionTimeMs = Date.now() - startTime;

    // Submit newly minted URLs to IndexNow for instant search engine indexing
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartflow-ai-blog.vercel.app';
    const urlsToIndex = [`${siteUrl}/blog/${post.slug}`];
    if (seededThread) {
      urlsToIndex.push(`${siteUrl}/forum/${seededThread.slug}`);
    }
    submitToIndexNow(urlsToIndex).catch((e) => console.error('Failed to notify IndexNow:', e));

    await db.logCronExecution(
      'generate-post',
      'success',
      {
        post_id: post.id,
        post_title: post.title,
        post_slug: post.slug,
        read_time_minutes: post.read_time_minutes,
        seeded_thread_id: seededThread?.id,
        seeded_thread_title: seededThread?.title,
      },
      executionTimeMs
    );

    return NextResponse.json({
      success: true,
      message: 'Blog post generated and published successfully.',
      execution_time_ms: executionTimeMs,
      data: {
        post: {
          id: post.id,
          title: post.title,
          slug: post.slug,
          published_at: post.published_at,
          read_time_minutes: post.read_time_minutes,
        },
        seeded_forum_thread: seededThread
          ? {
              id: seededThread.id,
              title: seededThread.title,
              slug: seededThread.slug,
            }
          : null,
      },
    });
  } catch (err: any) {
    const executionTimeMs = Date.now() - startTime;
    console.error('Error generating blog post in cron:', err);

    await db.logCronExecution(
      'generate-post',
      'failed',
      { error: err.message || 'Unknown error occurred' },
      executionTimeMs
    );

    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Internal error generating blog post',
        execution_time_ms: executionTimeMs,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Support GET triggers for standard web cron providers (like cron-job.org)
  return POST(req);
}
