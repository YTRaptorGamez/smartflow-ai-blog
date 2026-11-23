'use client';

import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { AdSlot as AdSlotType } from '@/types/database';

interface AdSlotProps {
  position: 'header' | 'sidebar' | 'in-article' | 'forum-sidebar' | 'footer';
  className?: string;
  fallbackData?: Partial<AdSlotType>;
}

export function AdSlot({ position, className = '', fallbackData }: AdSlotProps) {
  // Check if ads are enabled
  const enableAds = process.env.NEXT_PUBLIC_ENABLE_ADS !== 'false';
  if (!enableAds) return null;

  // Defaults per position
  const defaults: Record<string, { title: string; subtitle: string; link: string; image: string }> = {
    header: {
      title: 'Deploy Edge AI in 60s With Cloudflare Workers',
      subtitle: 'Zero cold starts, global edge network, and free tier for solopreneurs.',
      link: 'https://cloudflare.com',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    },
    sidebar: {
      title: 'Build Faster with Supabase Free Tier',
      subtitle: 'Postgres database, Authentication, and Edge Functions ready in seconds.',
      link: 'https://supabase.com',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    },
    'in-article': {
      title: 'Run 14B Local LLMs Silently Under $400',
      subtitle: 'Check out our benchmark testing of top budget mini PCs for developers.',
      link: '/blog/best-budget-local-llm-mini-pc-setup-2026',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
    },
    'forum-sidebar': {
      title: 'Join 12,000+ Autonomous Builders',
      subtitle: 'Get free prompt workflows and hardware deals delivered every Sunday.',
      link: '#newsletter',
      image: '',
    },
    footer: {
      title: 'Autonomous Tech Stack 2026',
      subtitle: 'Curated developer blueprints and free-tier infrastructure templates.',
      link: '/blog',
      image: '',
    },
  };

  const current = {
    title: fallbackData?.title || defaults[position]?.title || 'Featured Developer Partner',
    subtitle: fallbackData?.subtitle || defaults[position]?.subtitle || 'Optimized for high-throughput autonomous workflows.',
    link: fallbackData?.banner_link_url || defaults[position]?.link || 'https://smartflow.ai',
    image: fallbackData?.banner_image_url || defaults[position]?.image || '',
  };

  if (position === 'header') {
    return (
      <div className={`w-full bg-slate-900 border-b border-indigo-500/20 py-2.5 px-4 text-center text-xs text-slate-300 ${className}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-3 h-3" /> Sponsor
          </span>
          <span className="font-medium text-white">{current.title}</span>
          <span className="hidden sm:inline text-slate-400">— {current.subtitle}</span>
          <a
            href={current.link}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 ml-1"
          >
            Learn More <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  if (position === 'sidebar' || position === 'forum-sidebar') {
    return (
      <div className={`rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg relative overflow-hidden ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Sponsored</span>
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        </div>
        {current.image && (
          <div className="relative mb-3 h-32 w-full overflow-hidden rounded-lg">
            <img
              src={current.image}
              alt={current.title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">{current.title}</h4>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">{current.subtitle}</p>
        <a
          href={current.link}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="block w-full text-center rounded-lg bg-indigo-600/90 hover:bg-indigo-600 py-2 text-xs font-semibold text-white shadow-md transition-all"
        >
          Check It Out
        </a>
      </div>
    );
  }

  // in-article position
  return (
    <div className={`my-8 rounded-xl border border-dashed border-indigo-500/40 bg-indigo-950/20 p-5 sm:p-6 not-prose ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">Partner Spotlight</span>
        <span className="text-[10px] text-slate-400">Ad Slot</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white mb-1">{current.title}</h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">{current.subtitle}</p>
        </div>
        <a
          href={current.link}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          <span>Explore Tool</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
