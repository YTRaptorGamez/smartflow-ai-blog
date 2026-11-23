import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Cookie Disclosure',
  description: 'Our privacy practices, third-party advertising cookie disclosures, and affiliate compensation transparency.',
};

export default function PrivacyPolicyPage() {
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
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Last updated: November 2026</p>
        </div>
      </div>

      <div className="prose prose-invert prose-slate max-w-none space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
          <h2 className="text-lg font-bold text-white">1. Introduction</h2>
          <p>
            SmartFlow AI (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects your privacy and is committed to protecting personal data. This privacy policy informs you about how we handle visitor data when you visit our website (smartflow-ai-blog.vercel.app), your privacy rights, and how applicable data protection laws safeguard you.
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
          <h2 className="text-lg font-bold text-white">2. Google AdSense & Third-Party Advertising</h2>
          <p>
            We use Google AdSense and third-party advertising companies to serve advertisements when you visit our website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li>
              <strong>Cookies & Web Beacons:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.
            </li>
            <li>
              <strong>Google DART Cookie:</strong> Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.
            </li>
            <li>
              <strong>Opting Out:</strong> Users may opt out of personalized advertising by visiting{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 underline hover:text-indigo-300"
              >
                Google Ads Settings
              </a>{' '}
              or via{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 underline hover:text-indigo-300"
              >
                aboutads.info
              </a>.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
          <h2 className="text-lg font-bold text-white">3. Affiliate Links & FTC Disclosure</h2>
          <p>
            SmartFlow AI participates in various affiliate marketing programs. As an Amazon Associate, we earn from qualifying purchases made through links on our site (Amazon Associates Store ID: <code>weegan04-20</code>).
          </p>
          <p>
            When you click on an affiliate link and make a purchase, we may receive a small commission at no additional cost to you. We only recommend hardware, software tools, and cloud services that align with our editorial standards for solopreneurs and developers.
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
          <h2 className="text-lg font-bold text-white">4. Log Data & Analytics</h2>
          <p>
            Like most standard website servers, we collect information that your browser sends whenever you visit our Service. This may include internet protocol (IP) addresses, browser type, internet service provider (ISP), referring/exit pages, platform type, date/time stamp, and number of clicks to analyze trends and administer the site.
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
          <h2 className="text-lg font-bold text-white">5. Contact Information</h2>
          <p>
            If you have any questions about this Privacy Policy or our practices, please contact us at:{' '}
            <a href="mailto:editorial@smartflow.ai" className="text-indigo-400 underline hover:text-indigo-300">
              editorial@smartflow.ai
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
