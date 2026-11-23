import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AdSlot } from '@/components/AdSlot';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'SmartFlow AI | Autonomous Workflows & Budget Tech Stack for Solopreneurs',
    template: '%s | SmartFlow AI',
  },
  description: 'A self-sustaining content engine and developer forum covering autonomous AI workflows, budget hardware, and zero-dollar SaaS architectures.',
  keywords: ['AI Productivity', 'Autonomous Agents', 'Local LLMs', 'Solopreneur', 'Free Tier Architecture', 'Next.js', 'Supabase', 'Mini PC'],
  authors: [{ name: 'SmartFlow AI Editorial' }],
  creator: 'SmartFlow AI',
  publisher: 'SmartFlow AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'SmartFlow AI',
    title: 'SmartFlow AI | Autonomous Workflows & Budget Tech Stack',
    description: 'Self-sustaining content engine and community forum for solo builders and creators running on $0/month free-tier infrastructure.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'SmartFlow AI Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartFlow AI | Autonomous Workflows & Budget Tech Stack',
    description: 'Autonomous AI workflows, budget local LLM hardware, and $0/mo free-tier engineering.',
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isRealAdsenseId = adsenseClientId && adsenseClientId !== 'ca-pub-0000000000000000';

  return (
    <html lang="en" className="dark">
      <head>
        {isRealAdsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        <AdSlot position="header" />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
