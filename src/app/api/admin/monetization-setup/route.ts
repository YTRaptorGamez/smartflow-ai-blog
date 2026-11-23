import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/service';
import { memoryStore } from '@/lib/data/mock-store';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amazon_tag,
      cursor_ref,
      notion_ref,
      make_ref,
      perplexity_ref,
      adsense_publisher_id,
      enable_ads,
    } = body;

    let updatedCount = 0;
    const allLinks = await db.getAffiliateLinks(false);

    for (const link of allLinks) {
      let newUrl = link.affiliate_url;

      // Update Amazon hardware links
      if (amazon_tag && newUrl.includes('amazon.com')) {
        newUrl = newUrl.replace(/tag=[^&]+/i, `tag=${encodeURIComponent(amazon_tag.trim())}`);
        updatedCount++;
      }

      // Update Cursor AI link
      if (cursor_ref && newUrl.includes('cursor.com')) {
        newUrl = newUrl.replace(/ref=[^&]+/i, `ref=${encodeURIComponent(cursor_ref.trim())}`);
        updatedCount++;
      }

      // Update Notion link
      if (notion_ref && newUrl.includes('notion.so')) {
        newUrl = newUrl.replace(/aff=[^&]+/i, `aff=${encodeURIComponent(notion_ref.trim())}`);
        updatedCount++;
      }

      // Update Make.com link
      if (make_ref && newUrl.includes('make.com')) {
        newUrl = newUrl.replace(/ref=[^&]+/i, `ref=${encodeURIComponent(make_ref.trim())}`);
        updatedCount++;
      }

      // Update Perplexity link
      if (perplexity_ref && newUrl.includes('perplexity.ai')) {
        newUrl = newUrl.replace(/ref=[^&]+/i, `ref=${encodeURIComponent(perplexity_ref.trim())}`);
        updatedCount++;
      }

      link.affiliate_url = newUrl;
    }

    // Update Ad Slots if AdSense ID is provided
    if (adsense_publisher_id && adsense_publisher_id.trim()) {
      const cleanId = adsense_publisher_id.trim();
      const slots = ['header', 'sidebar', 'in-article', 'forum-sidebar'];
      for (const pos of slots) {
        await db.updateAdSlot(pos, {
          ad_type: 'adsense_script',
          script_code: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cleanId}" crossorigin="anonymous"></script>`,
          is_active: enable_ads ?? true,
        });
      }
    }

    // Persist to .env.local file if on disk
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');

        if (adsense_publisher_id) {
          if (envContent.includes('NEXT_PUBLIC_ADSENSE_CLIENT_ID=')) {
            envContent = envContent.replace(
              /NEXT_PUBLIC_ADSENSE_CLIENT_ID=.*/,
              `NEXT_PUBLIC_ADSENSE_CLIENT_ID="${adsense_publisher_id.trim()}"`
            );
          } else {
            envContent += `\nNEXT_PUBLIC_ADSENSE_CLIENT_ID="${adsense_publisher_id.trim()}"`;
          }
        }

        if (enable_ads !== undefined) {
          if (envContent.includes('NEXT_PUBLIC_ENABLE_ADS=')) {
            envContent = envContent.replace(
              /NEXT_PUBLIC_ENABLE_ADS=.*/,
              `NEXT_PUBLIC_ENABLE_ADS="${enable_ads}"`
            );
          }
        }

        fs.writeFileSync(envPath, envContent, 'utf8');
      }
    } catch (fsErr) {
      console.warn('Could not update .env.local on disk:', fsErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Monetization settings and affiliate tracking IDs saved successfully!',
      updated_affiliate_links_count: updatedCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
