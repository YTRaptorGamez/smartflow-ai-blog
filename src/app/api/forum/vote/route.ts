import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/data/mock-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { target_type, target_id, vote_value } = body;

    if (!target_type || !target_id || ![1, -1].includes(vote_value)) {
      return NextResponse.json({ error: 'Invalid vote parameters.' }, { status: 400 });
    }

    const updated = memoryStore.vote(target_type, target_id, vote_value);
    return NextResponse.json({ success: true, ...updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
