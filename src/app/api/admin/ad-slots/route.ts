import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/service';

export async function GET() {
  const slots = await db.getAllAdSlots();
  return NextResponse.json({ slots });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { position_key, updates } = body;

    if (!position_key || !updates) {
      return NextResponse.json({ error: 'Position key and updates required' }, { status: 400 });
    }

    const updated = await db.updateAdSlot(position_key, updates);
    return NextResponse.json({ success: true, slot: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
