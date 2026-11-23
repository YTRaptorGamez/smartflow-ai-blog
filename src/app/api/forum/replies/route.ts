import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { thread_id, content, parent_reply_id } = body;

    if (!thread_id || !content || !content.trim()) {
      return NextResponse.json(
        { error: 'Thread ID and content are required.' },
        { status: 400 }
      );
    }

    const reply = await db.createReply({
      thread_id,
      content: content.trim(),
      parent_reply_id,
      author_id: 'usr-sarah', // User demo author
      is_ai_bot: false,
    });

    return NextResponse.json({ success: true, reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
