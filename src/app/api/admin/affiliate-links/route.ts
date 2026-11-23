import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/service';

export async function GET() {
  const links = await db.getAffiliateLinks(false);
  return NextResponse.json({ links });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_name, keywords, affiliate_url, badge_text, description, price_estimate, cta_text } = body;

    if (!product_name || !affiliate_url) {
      return NextResponse.json({ error: 'Product name and affiliate URL are required.' }, { status: 400 });
    }

    const keywordsArray = Array.isArray(keywords)
      ? keywords
      : typeof keywords === 'string'
      ? keywords.split(',').map((k: string) => k.trim()).filter(Boolean)
      : [];

    const link = await db.createAffiliateLink({
      product_name,
      keywords: keywordsArray,
      affiliate_url,
      badge_text: badge_text || 'Recommended',
      description: description || '',
      price_estimate: price_estimate || '',
      cta_text: cta_text || 'View Offer',
      disclosure: 'Affiliate Partner Link',
      is_active: true,
    });

    return NextResponse.json({ success: true, link });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
