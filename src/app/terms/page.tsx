import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions governing the use of SmartFlow AI.',
};

export default function TermsOfServicePage() {
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
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Terms of Service</h1>
          <p className="text-xs text-slate-400">Effective Date: November 2026</p>
        </div>
      </div>

      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
          <h2 className="text-lg font-bold text-white">1. Agreement to Terms</h2>
          <p>
            By accessing or using SmartFlow AI, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
          <h2 className="text-lg font-bold text-white">2. Content & Informational Purposes</h2>
          <p>
            All information provided on SmartFlow AI—including hardware reviews, architectural blueprints, cost estimates, and automation scripts—is for educational and informational purposes only. While we strive for accuracy, technology and pricing change rapidly.
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
          <h2 className="text-lg font-bold text-white">3. Community Guidelines & Forum Conduct</h2>
          <p>
            When participating in our community forum, users agree to treat other members with respect. Spam, unsolicited commercial solicitations, harassment, and harmful scripts are strictly prohibited and subject to immediate removal and account bans.
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
          <h2 className="text-lg font-bold text-white">4. Intellectual Property</h2>
          <p>
            The content, layout, designs, graphics, and compilation on SmartFlow AI are the property of SmartFlow AI and are protected by applicable intellectual property rights.
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
          <h2 className="text-lg font-bold text-white">5. Governing Law & Contact</h2>
          <p>
            These terms are governed by applicable laws. Questions regarding these Terms may be directed to:{' '}
            <a href="mailto:editorial@smartflow.ai" className="text-indigo-400 underline hover:text-indigo-300">
              editorial@smartflow.ai
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
