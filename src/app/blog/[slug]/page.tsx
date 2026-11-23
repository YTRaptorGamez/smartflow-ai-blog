import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { db } from '@/lib/supabase/service';
import { formatDate } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure';
import { AdSlot } from '@/components/AdSlot';
import { JsonLdArticle } from '@/components/JsonLdArticle';
import { SocialShareBar } from '@/components/SocialShareBar';
import { Clock, Eye, Calendar, ArrowLeft, MessageSquare, Bot } from 'lucide-react';

interface BlogPostPageProps {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await db.getPostBySlug(params.slug);
  if (!post) {
    return { title: 'Post Not Found | SmartFlow AI' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartflow-ai-blog.vercel.app';

  return {
    title: `${post.title} | SmartFlow AI`,
    description: post.meta_description,
    keywords: post.tags,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.meta_description,
      url: `${siteUrl}/blog/${post.slug}`,
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      images: post.featured_image
        ? [
            {
              url: post.featured_image,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.meta_description,
      creator: '@weegantube',
      site: '@weegantube',
      images: post.featured_image ? [post.featured_image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await db.getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartflow-ai-blog.vercel.app';

  // Find linked companion forum thread
  const threads = await db.getThreads();
  const linkedThread = threads.find(t => t.linked_post_id === post.id);

  // Get related articles
  const allPosts = await db.getPosts();
  const relatedPosts = allPosts.filter(p => p.id !== post.id).slice(0, 2);

  return (
    <>
      <JsonLdArticle post={post} siteUrl={siteUrl} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Breadcrumb & Back Link */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-medium hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </Link>
          <span className="font-mono text-[11px] text-slate-400">SmartFlow Editorial</span>
        </div>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/20"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {post.meta_description}
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-y border-slate-800 py-3">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(post.published_at)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {post.read_time_minutes} min read
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              {post.views} views
            </span>
          </div>

          <SocialShareBar title={post.title} url={`${siteUrl}/blog/${post.slug}`} />
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
            <img
              src={post.featured_image}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* FTC Affiliate Disclosure */}
        <AffiliateDisclosure />

        {/* Article Body */}
        <article className="py-2">
          <MarkdownRenderer content={post.content} />
        </article>

        <SocialShareBar title={post.title} url={`${siteUrl}/blog/${post.slug}`} />

        {/* In-Article Ad Slot */}
        <AdSlot position="in-article" />

        {/* Companion Forum Discussion Box */}
        {linkedThread && (
          <div className="my-10 rounded-2xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" /> Community Discussion
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {linkedThread.reply_count} replies
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              Join the Conversation in the Forum
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
              Have you tried this setup or run benchmarks on similar hardware? Share your feedback, alternative tools, or questions with fellow builders!
            </p>
            <Link
              href={`/forum/${linkedThread.slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Discuss in Forum Thread ({linkedThread.reply_count} comments)</span>
            </Link>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="pt-8 border-t border-slate-800 space-y-6">
            <h3 className="text-xl font-bold text-white">Recommended Reading</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((r) => (
                <Link
                  key={r.id}
                  href={`/blog/${r.slug}`}
                  className="group rounded-xl border border-slate-800 bg-slate-900/40 p-5 hover:border-slate-700 transition"
                >
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug mb-2">
                    {r.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {r.meta_description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
