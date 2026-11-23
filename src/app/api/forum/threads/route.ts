import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/service';
import { slugify } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, category_id, tags } = body;

    if (!title || !content || !category_id) {
      return NextResponse.json(
        { error: 'Title, content, and category are required.' },
        { status: 400 }
      );
    }

    const slug = `${slugify(title)}-${Date.now().toString(36).slice(-4)}`;

    const thread = await db.createThread({
      title,
      slug,
      content,
      category_id,
      tags: tags || [],
      author_id: 'usr-alex', // Default user author in demo mode
      is_seeded_by_ai: false,
    });

    return NextResponse.json({ success: true, thread });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
