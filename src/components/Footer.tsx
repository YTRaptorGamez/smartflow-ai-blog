import React from 'react';
import Link from 'next/link';
import { Terminal, Shield, Rss } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950 text-slate-400 text-xs">
      {/* Top Footer Banner */}
      <div className="border-b border-slate-850 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">SmartFlow AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Self-sustaining content and developer community platform exploring autonomous AI workflows, budget tech, and solopreneur stacks on $0/month free-tier infrastructure.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Runs on $0/mo Free-Tier Stack
            </div>
          </div>

          {/* Blog & Resources */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">AI Blog Engine</h4>
            <ul className="space-y-2">
              <li><Link href="/blog" className="hover:text-indigo-400 transition">Latest Articles</Link></li>
              <li><Link href="/blog/best-budget-local-llm-mini-pc-setup-2026" className="hover:text-indigo-400 transition">Local LLM Hardware</Link></li>
              <li><Link href="/blog/automate-content-marketing-free-tier-stack" className="hover:text-indigo-400 transition">Zero-Dollar Content Stack</Link></li>
              <li><Link href="/feed.xml" className="inline-flex items-center gap-1 hover:text-indigo-400 transition"><Rss className="w-3 h-3 text-amber-500" /> RSS Feed</Link></li>
            </ul>
          </div>

          {/* Community Forum */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Community Forum</h4>
            <ul className="space-y-2">
              <li><Link href="/forum" className="hover:text-indigo-400 transition">All Discussions</Link></li>
              <li><Link href="/forum?category=ai-workflows" className="hover:text-indigo-400 transition">AI Workflow Automation</Link></li>
              <li><Link href="/forum?category=budget-hardware" className="hover:text-indigo-400 transition">Budget Tech & Hardware</Link></li>
              <li><Link href="/forum?category=solopreneur-stacks" className="hover:text-indigo-400 transition">Developer Stacks</Link></li>
              <li><Link href="/forum/new" className="hover:text-indigo-400 transition">Ask a Question</Link></li>
            </ul>
          </div>

          {/* Admin & Automation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Transparency & Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-indigo-400 transition">About SmartFlow AI</Link></li>
              <li><Link href="/privacy" className="hover:text-indigo-400 transition">Privacy & Cookie Policy</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-400 transition">Terms of Service</Link></li>
              <li><a href="/ads.txt" target="_blank" className="hover:text-indigo-400 transition">IAB ads.txt</a></li>
              <li><Link href="/sitemap.xml" className="hover:text-indigo-400 transition">XML Sitemap</Link></li>
              <li><Link href="/admin" className="inline-flex items-center gap-1 hover:text-indigo-400 transition"><Shield className="w-3 h-3 text-indigo-400" /> Admin Command Center</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* FTC Affiliate Disclosure & Copyright */}
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
        <p className="max-w-2xl leading-relaxed text-center md:text-left">
          <strong className="text-slate-300">Affiliate & Sponsorship Disclosure:</strong> SmartFlow AI is reader-supported. Some links on this site are affiliate partner links from which we may receive a commission. We only recommend tools, hardware, and services verified through rigorous hands-on testing.
        </p>
        <p className="shrink-0 text-slate-400">
          © {new Date().getFullYear()} SmartFlow AI Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
