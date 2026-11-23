import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/supabase/service';
import { formatDate } from '@/lib/utils';
import { AdSlot } from '@/components/AdSlot';
import { VoteButton } from '@/components/VoteButton';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Eye,
  MessageSquare,
  Bot,
  Zap,
  Cpu,
  Layers,
  TrendingUp
} from 'lucide-react';

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export default async function HomePage() {
  const [posts, threads, categories, affiliateLinks] = await Promise.all([
    db.getPosts(),
    db.getThreads(),
    db.getCategories(),
    db.getAffiliateLinks(true),
  ]);

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1, 4);
  const hotThreads = threads.slice(0, 4);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.18),rgba(255,255,255,0))]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Self-Sustaining $0/Month Infrastructure</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Autonomous AI Workflows & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-300">Budget Tech Stack</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Automated SEO content generation, budget hardware benchmarks, and a developer community built for solopreneurs—running entirely on free-tier Next.js, Supabase, and Google Gemini API.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:shadow-indigo-500/40 transition"
              >
                <span>Read Blog Guides</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/forum"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Join Community Forum</span>
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3.5 text-xs font-semibold text-slate-400 hover:text-indigo-400 hover:border-indigo-500/40 transition"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Pipeline</span>
              </Link>
            </div>

            {/* Micro Stats Banner */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-400 block">Hosting Cost</span>
                <strong className="text-emerald-400 font-mono text-sm">$0.00 / month</strong>
              </div>
              <div>
                <span className="text-slate-400 block">AI Engine</span>
                <strong className="text-slate-200 font-mono text-sm">Gemini 2.5 Flash</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Database</span>
                <strong className="text-slate-200 font-mono text-sm">Supabase Postgres</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Monetization</span>
                <strong className="text-indigo-400 font-mono text-sm">Affiliate + Ads</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Feed Column (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Featured Post Card */}
            {featuredPost && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    <span>Featured Blueprint</span>
                  </h2>
                  <Link href="/blog" className="text-xs font-semibold text-indigo-400 hover:underline">
                    View all posts →
                  </Link>
                </div>

                <div className="group rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden hover:border-slate-700 transition-all shadow-xl">
                  {featuredPost.featured_image && (
                    <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                      <img
                        src={featuredPost.featured_image}
                        alt={featuredPost.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 flex-wrap">
                        {featuredPost.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-slate-900/90 backdrop-blur-md px-3 py-1 text-xs font-medium text-indigo-300 border border-slate-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-6 sm:p-8 space-y-4">
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>{formatDate(featuredPost.published_at)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredPost.read_time_minutes} min read
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {featuredPost.views} views
                      </span>
                    </div>

                    <Link href={`/blog/${featuredPost.slug}`}>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-indigo-400 transition-colors leading-snug">
                        {featuredPost.title}
                      </h3>
                    </Link>

                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
                      {featuredPost.meta_description}
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                      >
                        <span>Read Full Guide</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* In-Article / Mid-feed Ad Slot */}
            <AdSlot position="in-article" />

            {/* Recent Articles Grid */}
            {regularPosts.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Recent Deep Dives
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {regularPosts.map((post) => (
                    <article
                      key={post.id}
                      className="group rounded-xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between hover:border-slate-700 transition shadow-md"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          {post.tags.slice(0, 2).map((t) => (
                            <span key={t} className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                              {t}
                            </span>
                          ))}
                        </div>
                        <Link href={`/blog/${post.slug}`}>
                          <h4 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug">
                            {post.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                          {post.meta_description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 mt-4">
                        <span>{formatDate(post.published_at)}</span>
                        <span>{post.read_time_minutes} min read</span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Community Forum Highlight Feed */}
            <section className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    <span>Hot Community Discussions</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real debates, architecture teardowns, and AI bot-assisted troubleshooting.
                  </p>
                </div>
                <Link href="/forum" className="text-xs font-semibold text-indigo-400 hover:underline">
                  Visit Forum →
                </Link>
              </div>

              <div className="space-y-3">
                {hotThreads.map((thread) => (
                  <div
                    key={thread.id}
                    className="flex items-start gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-slate-700 transition"
                  >
                    <div className="shrink-0 pt-0.5">
                      <VoteButton
                        targetType="thread"
                        targetId={thread.id}
                        initialUpvotes={thread.upvotes}
                        initialDownvotes={thread.downvotes}
                      />
                    </div>

                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
                        {thread.is_seeded_by_ai && (
                          <span className="inline-flex items-center gap-1 rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
                            <Bot className="w-3 h-3" /> AI Seeded
                          </span>
                        )}
                        <span className="text-slate-300 font-medium">{thread.author?.display_name || 'Community Member'}</span>
                        <span>•</span>
                        <span>{formatDate(thread.created_at)}</span>
                      </div>

                      <Link href={`/forum/${thread.slug}`}>
                        <h4 className="text-sm sm:text-base font-bold text-white hover:text-indigo-400 transition-colors leading-snug">
                          {thread.title}
                        </h4>
                      </Link>

                      <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                        {thread.content}
                      </p>

                      <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          {thread.reply_count} replies
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          {thread.views} views
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Column (4 cols) */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Sidebar Ad Slot */}
            <AdSlot position="sidebar" />

            {/* Forum Categories Quick Nav */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Forum Categories</span>
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/forum?category=${cat.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/80 transition text-xs text-slate-300 hover:text-white"
                  >
                    <span className="font-medium truncate">{cat.name}</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 font-mono">
                      {cat.thread_count || 0}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Curated Affiliate Tech Picks */}
            <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 to-slate-900/80 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <span>Editor Hardware Picks</span>
                </h3>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Tested
                </span>
              </div>

              <div className="space-y-3">
                {affiliateLinks.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white truncate max-w-[170px]">{item.product_name}</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold">{item.price_estimate}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{item.description}</p>
                    <a
                      href={`/api/affiliate/track?id=${encodeURIComponent(item.id)}&url=${encodeURIComponent(item.affiliate_url)}`}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="block text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 py-1.5 rounded transition"
                    >
                      {item.cta_text}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div id="newsletter" className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-center space-y-3">
              <div className="h-10 w-10 mx-auto rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Join 12,000+ Solopreneurs</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive weekly open-source autonomous workflows, free API tips, and hardware deals directly in your inbox.
              </p>
              <form action="#" className="space-y-2">
                <input
                  type="email"
                  placeholder="you@domain.com"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md transition"
                >
                  Subscribe for Free
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
