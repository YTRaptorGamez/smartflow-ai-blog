import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AdSlot } from '@/components/AdSlot';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'SmartFlow AI | Smart Tech Deals, Everyday AI Tools & Productivity',
    template: '%s | SmartFlow AI',
  },
  description: 'Your definitive guide to everyday AI tools, budget tech deals, smart desk setups, and modern productivity hacks.',
  keywords: ['Tech Deals', 'AI Tools', 'Budget Tech', 'Productivity', 'Amazon Finds', 'Laptops', 'Headphones', 'ChatGPT', 'Remote Work', 'Desk Setup', 'Mini PC'],
  authors: [{ name: 'SmartFlow AI Editorial' }],
  creator: 'SmartFlow AI',
  publisher: 'SmartFlow AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'SmartFlow AI',
    title: 'SmartFlow AI | Smart Tech Deals, Everyday AI Tools & Productivity',
    description: 'Discover the best free AI tools, budget tech deals on Amazon, and productivity workflows to supercharge your daily life.',
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
  verification: {
    google: 'TOhEevctGO8ftQILFFVvbaZKaXx93oRonabl9k1xx2k',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-3634853583936763';
  const isRealAdsenseId = adsenseClientId && adsenseClientId !== 'ca-pub-0000000000000000';

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="google-site-verification" content="TOhEevctGO8ftQILFFVvbaZKaXx93oRonabl9k1xx2k" />
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
