import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/service';

export async function GET() {
  const queue = await db.getTopicQueue();
  return NextResponse.json({ queue });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topics, category, priority } = body;

    let topicsList: string[] = [];
    if (Array.isArray(topics)) {
      topicsList = topics;
    } else if (typeof topics === 'string') {
      topicsList = topics.split(/[\n,]+/).map(t => t.trim()).filter(Boolean);
    }

    if (topicsList.length === 0) {
      return NextResponse.json({ error: 'No valid topics provided' }, { status: 400 });
    }

    const addedCount = await db.addTopicQueueBulk(
      topicsList,
      category || 'AI Productivity',
      Number(priority) || 3
    );

    return NextResponse.json({ success: true, count: addedCount });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
