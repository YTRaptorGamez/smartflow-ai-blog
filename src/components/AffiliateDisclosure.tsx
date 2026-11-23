import React from 'react';
import { Info } from 'lucide-react';

export function AffiliateDisclosure({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-lg border border-slate-700/60 bg-slate-900/60 p-3 sm:p-4 text-xs text-slate-300 flex items-start gap-3 my-6 not-prose ${className}`}>
      <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
      <p className="leading-relaxed">
        <strong className="text-white font-medium">Reader Supported & FTC Disclosure:</strong>{' '}
        SmartFlow AI conducts independent benchmarks and real-world developer testing. When you buy through links on our site, we may earn an affiliate commission at no extra cost to you. We only recommend tools we thoroughly verify.
      </p>
    </div>
  );
}
