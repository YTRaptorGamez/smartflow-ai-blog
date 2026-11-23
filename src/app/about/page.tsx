import { Metadata } from 'next';
import Link from 'next/link';
import { Cpu, ArrowLeft, Mail, Sparkles, Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About SmartFlow AI',
  description: 'Our mission: autonomous AI engineering and budget developer stacks for creators and solopreneurs.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">About SmartFlow AI</h1>
          <p className="text-xs text-slate-400">Autonomous Engineering on Zero-Dollar Infrastructure</p>
        </div>
      </div>

      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Our Mission
          </h2>
          <p>
            SmartFlow AI was created to solve a singular problem: enterprise AI tools and cloud GPU servers are priced out of reach for individual builders, bootstrapped founders, and solopreneurs.
          </p>
          <p>
            We curate, benchmark, and document production-ready methods to run local LLMs, automate high-throughput business workflows, and scale applications on 100% free-tier developer stacks (Next.js, Supabase, Cloudflare Workers, and Google Gemini API).
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" /> Editorial Standards & Transparency
          </h2>
          <p>
            Our content is developed with deep technical rigor. Every mini PC benchmark, memory optimization technique, and webhook configuration has been tested for real-world viability.
          </p>
          <p>
            To fund our research and keep all guides 100% free to the developer community, we utilize affiliate partnerships and ethical programmatic display advertisements (Google AdSense). We never accept paid compensation in exchange for positive product reviews.
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-400" /> Contact & Editorial Inquiries
          </h2>
          <p>
            Have a question, feedback on an article, or want to suggest a local hardware benchmark? Reach our team directly:
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="mailto:editorial@smartflow.ai"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> Email Editorial Team
            </a>
            <Link
              href="/forum"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
            >
              Ask in Community Forum
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
