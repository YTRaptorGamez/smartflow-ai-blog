import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/supabase/service';
import { timeAgo } from '@/lib/utils';
import { VoteButton } from '@/components/VoteButton';
import { AdSlot } from '@/components/AdSlot';
import {
  MessageSquare,
  PlusCircle,
  Pin,
  Bot,
  Search,
  Eye
} from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Forum | SmartFlow AI',
  description: 'Discuss autonomous workflows, local LLMs, and budget developer tech stacks with builders and our Gemini AI assistant.',
};

export const revalidate = 30;

interface ForumPageProps {
  searchParams: { category?: string; q?: string };
}

export default async function ForumIndexPage({ searchParams }: ForumPageProps) {
  const categories = await db.getCategories();

  let activeCategoryId: string | undefined = undefined;
  if (searchParams.category) {
    const matched = categories.find(c => c.slug === searchParams.category);
    if (matched) activeCategoryId = matched.id;
  }

  const threads = await db.getThreads(activeCategoryId, searchParams.q);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Forum Header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 border border-cyan-500/20">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Developer & Solopreneur Community</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            SmartFlow Community Forum
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Ask technical questions, share autonomous workflows, and get AI-moderated answers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/forum/new"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Start Discussion</span>
          </Link>
        </div>
      </div>

      {/* Main Forum Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Categories Tab Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            <Link
              href="/forum"
              className={`px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                !searchParams.category
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              All Topics
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/forum?category=${cat.slug}`}
                className={`px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  searchParams.category === cat.slug
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Search Box */}
          <form action="/forum" method="GET" className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              name="q"
              defaultValue={searchParams.q || ''}
              placeholder="Search discussions, tools, local LLM setups..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            {searchParams.category && (
              <input type="hidden" name="category" value={searchParams.category} />
            )}
          </form>

          {/* Threads List */}
          <div className="space-y-3">
            {threads.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
                <MessageSquare className="w-8 h-8 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No discussions found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Be the first to ask a question or start a discussion in this category!
                </p>
                <Link
                  href="/forum/new"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Start Discussion</span>
                </Link>
              </div>
            ) : (
              threads.map((thread) => (
                <div
                  key={thread.id}
                  className="flex items-start gap-3 sm:gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-200"
                >
                  {/* Upvote column */}
                  <div className="shrink-0">
                    <VoteButton
                      targetType="thread"
                      targetId={thread.id}
                      initialUpvotes={thread.upvotes}
                      initialDownvotes={thread.downvotes}
                    />
                  </div>

                  {/* Thread details */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
                      {thread.is_pinned && (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
                          <Pin className="w-3 h-3" /> Pinned
                        </span>
                      )}

                      {thread.is_seeded_by_ai && (
                        <span className="inline-flex items-center gap-1 rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
                          <Bot className="w-3 h-3" /> AI Seeded
                        </span>
                      )}

                      <span className="font-medium text-slate-300">
                        {thread.author?.display_name || 'Community Member'}
                      </span>
                      <span>•</span>
                      <span>{timeAgo(thread.created_at)}</span>
                    </div>

                    <Link href={`/forum/${thread.slug}`}>
                      <h3 className="text-base sm:text-lg font-bold text-white hover:text-indigo-400 transition-colors leading-snug">
                        {thread.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {thread.content}
                    </p>

                    {/* Metadata & Tag Footer */}
                    <div className="pt-2 flex items-center justify-between gap-4 text-xs text-slate-400 flex-wrap">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/forum/${thread.slug}`}
                          className="inline-flex items-center gap-1.5 font-medium hover:text-indigo-400 transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{thread.reply_count} replies</span>
                        </Link>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{thread.views} views</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {thread.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Forum Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Forum Sidebar Ad Slot */}
          <AdSlot position="forum-sidebar" />

          {/* AI Helper Persona Card */}
          <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-900 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">SmartFlow AI Helper</h4>
                <span className="text-[10px] text-indigo-400 font-mono">Gemini 2.5 Flash Persona</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our autonomous AI bot monitors unanswered forum questions and provides step-by-step code snippets, benchmarks, and debug advice within 24 hours.
            </p>
          </div>

          {/* Community Guidelines */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 text-xs text-slate-300">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Community Guidelines</h4>
            <ul className="space-y-2 list-disc pl-4 text-slate-400">
              <li>Share honest hardware benchmarks & latency logs.</li>
              <li>Disclose tool affiliations if you are a founder.</li>
              <li>Keep free-tier architectures reproducible.</li>
              <li>Respect fellow builders and keep discussions helpful.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
