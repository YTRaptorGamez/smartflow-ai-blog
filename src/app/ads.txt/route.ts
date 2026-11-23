import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-3634853583936763';
  const pubCode = adsenseId.replace(/^ca-/, '');

  // Standard IAB-compliant ads.txt content
  const adsTxt = `# Google AdSense verification
google.com, ${pubCode}, DIRECT, f08c47fec0942fa0

# SmartFlow AI Monetization Verification
contact=editorial@smartflow.ai
`;

  return new NextResponse(adsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
