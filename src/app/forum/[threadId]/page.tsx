import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { db } from '@/lib/supabase/service';
import { formatDate, timeAgo } from '@/lib/utils';
import { VoteButton } from '@/components/VoteButton';
import { ReplyForm } from '@/components/ReplyForm';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { AdSlot } from '@/components/AdSlot';
import {
  ArrowLeft,
  Bot,
  MessageSquare,
  BookOpen,
  Pin,
  Eye
} from 'lucide-react';

interface ThreadPageProps {
  params: { threadId: string };
}

export const revalidate = 15;

export async function generateMetadata({ params }: ThreadPageProps): Promise<Metadata> {
  const thread = await db.getThreadBySlug(params.threadId);
  if (!thread) {
    return { title: 'Thread Not Found | SmartFlow Forum' };
  }
  return {
    title: `${thread.title} | SmartFlow Forum`,
    description: thread.content.slice(0, 160),
  };
}

export default async function ForumThreadPage({ params }: ThreadPageProps) {
  const thread = await db.getThreadBySlug(params.threadId);

  if (!thread) {
    notFound();
  }

  const replies = await db.getReplies(thread.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <Link
          href="/forum"
          className="inline-flex items-center gap-1.5 font-medium hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Discussions</span>
        </Link>
        <span className="font-mono text-[11px] text-indigo-400">
          {thread.category?.name || 'General'}
        </span>
      </div>

      {/* Main Thread Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Header tags & badges */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {thread.is_pinned && (
              <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
                <Pin className="w-3.5 h-3.5" /> Pinned
              </span>
            )}

            {thread.is_seeded_by_ai && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                <Bot className="w-3.5 h-3.5 text-indigo-400" /> AI Companion Seed
              </span>
            )}

            {thread.tags.map((t) => (
              <span
                key={t}
                className="text-[11px] font-medium text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700/60"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>{formatDate(thread.created_at)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {thread.views} views
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
          {thread.title}
        </h1>

        {/* Author badge */}
        <div className="flex items-center gap-3 py-2 border-y border-slate-800/80">
          <img
            src={thread.author?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=smartflow'}
            alt={thread.author?.display_name || 'Author'}
            className="h-10 w-10 rounded-full border border-slate-700 bg-slate-800 object-cover"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white">
                {thread.author?.display_name || 'Community Member'}
              </span>
              {thread.author?.role === 'ai_bot' && (
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-mono font-semibold">
                  BOT
                </span>
              )}
              {thread.author?.role === 'admin' && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-semibold">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {thread.author?.bio || 'Autonomous community contributor'}
            </p>
          </div>
        </div>

        {/* Linked Blog Post Callout (if seeded from an article) */}
        {thread.linked_post && (
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> Related Editorial Article
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white">
                {thread.linked_post.title}
              </h4>
            </div>
            <Link
              href={`/blog/${thread.linked_post.slug}`}
              className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
            >
              <span>Read Guide</span>
            </Link>
          </div>
        )}

        {/* Content & Vote Row */}
        <div className="flex items-start gap-5 pt-2">
          <div className="shrink-0">
            <VoteButton
              targetType="thread"
              targetId={thread.id}
              initialUpvotes={thread.upvotes}
              initialDownvotes={thread.downvotes}
            />
          </div>

          <div className="flex-1 min-w-0">
            <MarkdownRenderer content={thread.content} />
          </div>
        </div>
      </div>

      {/* Mid-page Ad Slot */}
      <AdSlot position="in-article" />

      {/* Replies Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <span>Community Replies ({replies.length})</span>
          </h2>
          <span className="text-xs text-slate-400">Sorted chronologically</span>
        </div>

        {/* Interactive Reply Form */}
        <ReplyForm threadId={thread.id} />

        {/* Replies List */}
        <div className="space-y-4">
          {replies.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-xs text-slate-400">
              No replies yet. Be the first to share your perspective!
            </div>
          ) : (
            replies.map((reply) => (
              <div
                key={reply.id}
                className={`rounded-xl border p-5 transition space-y-3 ${
                  reply.is_ai_bot
                    ? 'border-indigo-500/40 bg-gradient-to-r from-indigo-950/20 via-slate-900 to-slate-900 shadow-md'
                    : 'border-slate-800 bg-slate-900/50'
                }`}
              >
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={reply.author?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                      alt={reply.author?.display_name || 'User'}
                      className="h-8 w-8 rounded-full border border-slate-700 bg-slate-800 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">
                          {reply.author?.display_name || 'Community Member'}
                        </span>
                        {reply.is_ai_bot && (
                          <span className="inline-flex items-center gap-1 rounded bg-indigo-500/30 px-2 py-0.5 text-[10px] font-mono font-semibold text-indigo-300 border border-indigo-500/40">
                            <Bot className="w-3 h-3" /> AI HELPER
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{timeAgo(reply.created_at)}</span>
                    </div>
                  </div>

                  <VoteButton
                    targetType="reply"
                    targetId={reply.id}
                    initialUpvotes={reply.upvotes}
                    initialDownvotes={reply.downvotes}
                    orientation="horizontal"
                  />
                </div>

                {/* Reply Content */}
                <div className="pl-11">
                  <MarkdownRenderer content={reply.content} />
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
