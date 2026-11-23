'use client';

import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface SocialShareBarProps {
  title: string;
  url: string;
}

export function SocialShareBar({ title, url }: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const shareLinks = [
    {
      name: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:bg-slate-800 text-slate-300 hover:text-white',
    },
    {
      name: 'Reddit',
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color: 'hover:bg-orange-500/20 text-orange-400 border border-orange-500/30',
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:bg-blue-600/20 text-blue-400 border border-blue-500/30',
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
        <Share2 className="w-4 h-4 text-indigo-400" />
        <span>Share this guide:</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {shareLinks.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${item.color}`}
          >
            {item.name}
          </a>
        ))}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
