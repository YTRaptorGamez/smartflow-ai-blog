import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/auth/cron-auth';
import { db } from '@/lib/supabase/service';
import { generateBotReplyForThread } from '@/lib/ai/gemini';

export const dynamic = 'force-dynamic';
export const maxDuration = 45;

export async function POST(req: NextRequest) {
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized. Invalid CRON_SECRET.' }, { status: 401 });
  }

  const startTime = Date.now();

  try {
    const threads = await db.getThreads();
    // Find threads with 0 replies, or threads that haven't been answered by the AI bot yet
    let targetThread = threads.find(t => t.reply_count === 0);

    if (!targetThread) {
      // Find any thread not created by bot
      targetThread = threads.find(t => t.author_id !== 'usr-bot') || threads[0];
    }

    if (!targetThread) {
      return NextResponse.json({
        success: true,
        message: 'No eligible threads found needing AI helper assistance.',
      });
    }

    const reply = await generateBotReplyForThread(targetThread);
    const executionTimeMs = Date.now() - startTime;

    await db.logCronExecution(
      'bot-reply',
      'success',
      {
        thread_id: targetThread.id,
        thread_title: targetThread.title,
        reply_id: reply.id,
      },
      executionTimeMs
    );

    return NextResponse.json({
      success: true,
      message: 'AI Community Helper reply generated successfully.',
      execution_time_ms: executionTimeMs,
      data: {
        thread_id: targetThread.id,
        thread_title: targetThread.title,
        reply,
      },
    });
  } catch (err: any) {
    const executionTimeMs = Date.now() - startTime;
    console.error('Error in bot-reply cron:', err);

    await db.logCronExecution(
      'bot-reply',
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
