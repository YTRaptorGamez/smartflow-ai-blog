import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/supabase/service';
import { formatDate } from '@/lib/utils';
import { AdSlot } from '@/components/AdSlot';
import { Clock, Eye, BookOpen, ArrowRight, Tag } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Productivity & Tech Blog',
  description: 'Deep dives, benchmarks, and tutorials on autonomous AI workflows, local LLMs, and budget engineering for solopreneurs.',
};

export const revalidate = 60;

export default async function BlogIndexPage() {
  const posts = await db.getPosts();

  // Extract all unique tags
  const allTags = Array.from(new Set(posts.flatMap(p => p.tags)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Blog Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/20">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Automated Editorial Pipeline</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
          AI Productivity & Autonomous Stacks
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Comprehensive, benchmark-backed guides written for developers, creators, and solo founders building self-sustaining systems on free-tier infrastructure.
        </p>

        {/* Tag pills */}
        <div className="flex items-center gap-2 flex-wrap pt-2">
          <span className="text-xs text-slate-400 font-medium">Topics:</span>
          {allTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-medium text-slate-300"
            >
              <Tag className="w-3 h-3 text-indigo-400" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Main Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden hover:border-slate-700 hover:shadow-xl transition-all duration-300"
          >
            <div>
              {post.featured_image && (
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    {post.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-indigo-300 border border-slate-700/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{formatDate(post.published_at)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.read_time_minutes} min
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {post.views}
                  </span>
                </div>

                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {post.meta_description}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-800/60 mt-4 flex items-center justify-between text-xs font-semibold text-indigo-400">
              <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 hover:text-indigo-300">
                <span>Read Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* In-feed Ad Banner */}
      <AdSlot position="in-article" />
    </div>
  );
}
