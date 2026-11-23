import React from 'react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  // Configure marked for clean typography rendering
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  const parsedHtml = marked.parse(content) as string;

  return (
    <div
      className={`prose prose-invert prose-indigo max-w-none 
        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-100
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-2
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:leading-relaxed prose-p:text-slate-300 prose-p:my-4
        prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
        prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
        prose-li:text-slate-300 prose-li:my-1
        prose-table:w-full prose-table:my-6 prose-table:border prose-table:border-slate-800
        prose-th:bg-slate-800/80 prose-th:p-3 prose-th:text-left prose-th:text-xs prose-th:font-semibold prose-th:text-slate-200
        prose-td:p-3 prose-td:border-t prose-td:border-slate-800 prose-td:text-sm prose-td:text-slate-300
        prose-code:text-indigo-300 prose-code:bg-slate-800/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
        prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl prose-pre:p-4
        prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-400
        ${className}`}
      dangerouslySetInnerHTML={{ __html: parsedHtml }}
    />
  );
}
