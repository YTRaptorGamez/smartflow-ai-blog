import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/auth/cron-auth';
import { db } from '@/lib/supabase/service';
import { seedForumThreadForPost } from '@/lib/ai/gemini';

export const dynamic = 'force-dynamic';
export const maxDuration = 45;

export async function POST(req: NextRequest) {
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized. Invalid CRON_SECRET.' }, { status: 401 });
  }

  const startTime = Date.now();

  try {
    const posts = await db.getPosts();
    const threads = await db.getThreads();
    const linkedPostIds = new Set(threads.map(t => t.linked_post_id).filter(Boolean));

    // Find the latest post that doesn't have a forum thread yet
    const unseededPost = posts.find(p => !linkedPostIds.has(p.id));

    if (!unseededPost) {
      // If all posts already seeded, generate an organic discussion question in the general category
      const categories = await db.getCategories();
      const cat = categories[0] || { id: 'cat-1' };

      const organicTopics = [
        {
          title: 'Weekly Check-in: What autonomous agent or workflow saved you the most hours this week?',
          content: 'Drop your favorite tool stack, n8n recipe, or custom prompt below. Let us know how many hours it shaved off your weekly workload!',
          tags: ['Weekly Check-in', 'Automation', 'Productivity'],
        },
        {
          title: 'Poll: Are you running local LLMs on a mini PC or sticking with cloud API endpoints?',
          content: 'With Ollama, GGUF quantizations, and models like DeepSeek-R1 and Gemma 4, hosting locally is cheaper than ever. But are latency and prompt caching worth the hardware investment for your use-case? Share your benchmarks below!',
          tags: ['Local LLM', 'Mini PC', 'Hardware', 'Cloud vs Local'],
        },
        {
          title: 'Favorite Free-Tier SaaS tools for bootstrapping solo products in 2026',
          content: 'What are the most generous developer free tiers you are currently using? (e.g. Supabase, Cloudflare Workers, Resend, Vercel). Where are the hidden limits?',
          tags: ['Free Tier', 'Solopreneur Stacks', 'SaaS'],
        },
      ];

      const pick = organicTopics[Math.floor(Math.random() * organicTopics.length)];
      const newThread = await db.createThread({
        category_id: cat.id,
        author_id: 'usr-bot',
        title: pick.title,
        slug: `discuss-${Date.now().toString(36)}`,
        content: pick.content,
        tags: pick.tags,
        is_seeded_by_ai: true,
      });

      const executionTimeMs = Date.now() - startTime;
      await db.logCronExecution(
        'seed-forum',
        'success',
        { thread_id: newThread.id, thread_title: newThread.title, type: 'organic_prompt' },
        executionTimeMs
      );

      return NextResponse.json({
        success: true,
        message: 'Organic forum discussion thread seeded successfully.',
        execution_time_ms: executionTimeMs,
        thread: newThread,
      });
    }

    // Seed for unseeded post
    const thread = await seedForumThreadForPost(unseededPost);
    const executionTimeMs = Date.now() - startTime;

    await db.logCronExecution(
      'seed-forum',
      'success',
      {
        thread_id: thread.id,
        thread_title: thread.title,
        linked_post_id: unseededPost.id,
        linked_post_title: unseededPost.title,
      },
      executionTimeMs
    );

    return NextResponse.json({
      success: true,
      message: 'Companion forum thread seeded for recent blog post.',
      execution_time_ms: executionTimeMs,
      thread,
    });
  } catch (err: any) {
    const executionTimeMs = Date.now() - startTime;
    console.error('Error seeding forum in cron:', err);

    await db.logCronExecution(
      'seed-forum',
      'failed',
      { error: err.message },
      executionTimeMs
    );

    return NextResponse.json(
      { success: false, error: err.message, execution_time_ms: executionTimeMs },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
