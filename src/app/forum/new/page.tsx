'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { ForumCategory } from '@/types/database';

export default function NewThreadPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Default categories if loading
    setCategories([
      { id: 'cat-1', name: 'AI Workflow Automation', slug: 'ai-workflows', icon: 'Workflow', display_order: 1, created_at: '' },
      { id: 'cat-2', name: 'Budget Tech & Hardware', slug: 'budget-hardware', icon: 'Cpu', display_order: 2, created_at: '' },
      { id: 'cat-3', name: 'Developer & Solopreneur Stacks', slug: 'solopreneur-stacks', icon: 'Code', display_order: 3, created_at: '' },
      { id: 'cat-4', name: 'Tool Reviews & Comparisons', slug: 'tool-reviews', icon: 'Star', display_order: 4, created_at: '' },
      { id: 'cat-5', name: 'Ask the Community & AI', slug: 'ask-community', icon: 'HelpCircle', display_order: 5, created_at: '' },
    ]);
    setCategoryId('cat-1');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const parsedTags = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/forum/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: categoryId,
          title: title.trim(),
          content: content.trim(),
          tags: parsedTags.length > 0 ? parsedTags : ['General'],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create discussion thread');
      }

      router.push(`/forum/${data.thread.slug}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <Link
        href="/forum"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Forum</span>
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Start a New Discussion
        </h1>
        <p className="text-xs text-slate-300">
          Ask a technical question, share a benchmark, or discuss autonomous toolchains.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-950/60 border border-rose-500/30 p-4 text-xs text-rose-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6 shadow-xl">
        {/* Category Picker */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-200">
            Category <span className="text-rose-400">*</span>
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-200">
            Discussion Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Best mini PC specs for local DeepSeek inference under $400?"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-200">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Local LLM, Hardware, Ollama, Free Tier"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Content Body */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-200">
            Body Content (Markdown Supported) <span className="text-rose-400">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            placeholder="Provide context, system specs, error logs, or code snippets..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
            required
          />
        </div>

        {/* Action button */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            AI Bot actively monitors and replies to new questions
          </span>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? (
              <span>Publishing...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Publish Thread</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
