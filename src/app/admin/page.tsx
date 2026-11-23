'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  Play,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Layers,
  MousePointer,
  Bot,
  ExternalLink,
  Shield,
  FileText,
  DollarSign,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { TopicQueueItem, AffiliateLink, AdSlot, CronLog } from '@/types/database';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'monetization' | 'triggers' | 'topics' | 'affiliates' | 'ads' | 'logs'>('monetization');

  // Monetization wizard state
  const [monetizationForm, setMonetizationForm] = useState({
    amazon_tag: 'weegan04-20',
    cursor_ref: 'smartflow',
    notion_ref: 'smartflow',
    make_ref: 'smartflow',
    perplexity_ref: 'smartflow',
    adsense_publisher_id: 'ca-pub-3634853583936763',
    enable_ads: true,
  });
  const [isSavingMonetization, setIsSavingMonetization] = useState(false);
  const [monetizationMessage, setMonetizationMessage] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalThreads: 0,
    totalViews: 0,
    totalClicks: 0,
    pendingTopics: 0,
    totalAffiliateLinks: 0,
    recentLogs: [] as CronLog[],
  });

  // State collections
  const [topicQueue, setTopicQueue] = useState<TopicQueueItem[]>([]);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [adSlots, setAdSlots] = useState<AdSlot[]>([]);
  const [logs, setLogs] = useState<CronLog[]>([]);

  // Trigger testing state
  const [triggerTopic, setTriggerTopic] = useState('');
  const [isTriggering, setIsTriggering] = useState<'post' | 'thread' | 'bot' | null>(null);
  const [triggerOutput, setTriggerOutput] = useState<any>(null);
  const [triggerError, setTriggerError] = useState<string | null>(null);

  // Topic Bulk Add form
  const [bulkTopics, setBulkTopics] = useState('');
  const [bulkCategory, setBulkCategory] = useState('AI Productivity');
  const [bulkPriority, setBulkPriority] = useState(3);
  const [isAddingTopics, setIsAddingTopics] = useState(false);

  // New Affiliate link form
  const [newAffiliate, setNewAffiliate] = useState({
    product_name: '',
    keywords: '',
    affiliate_url: '',
    badge_text: 'Editor Choice',
    description: '',
    price_estimate: '',
    cta_text: 'Check Best Price & Deal',
  });
  const [isAddingAffiliate, setIsAddingAffiliate] = useState(false);

  // Load stats and data
  const loadData = async () => {
    try {
      const [statsRes, queueRes, affRes, slotsRes] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.json()).catch(() => null),
        fetch('/api/admin/topic-queue').then(r => r.json()).catch(() => null),
        fetch('/api/admin/affiliate-links').then(r => r.json()).catch(() => null),
        fetch('/api/admin/ad-slots').then(r => r.json()).catch(() => null),
      ]);

      if (statsRes) {
        setStats(statsRes);
        if (statsRes.recentLogs) setLogs(statsRes.recentLogs);
      }
      if (queueRes?.queue) setTopicQueue(queueRes.queue);
      if (affRes?.links) setAffiliateLinks(affRes.links);
      if (slotsRes?.slots) setAdSlots(slotsRes.slots);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1. One-Click Trigger Handlers
  const handleTriggerGeneratePost = async () => {
    setIsTriggering('post');
    setTriggerOutput(null);
    setTriggerError(null);

    try {
      const res = await fetch('/api/cron/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: triggerTopic.trim() || undefined }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate post');

      setTriggerOutput(data);
      setTriggerTopic('');
      await loadData();
    } catch (err: any) {
      setTriggerError(err.message || 'Trigger execution failed');
    } finally {
      setIsTriggering(null);
    }
  };

  const handleTriggerSeedForum = async () => {
    setIsTriggering('thread');
    setTriggerOutput(null);
    setTriggerError(null);

    try {
      const res = await fetch('/api/cron/seed-forum', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to seed thread');

      setTriggerOutput(data);
      await loadData();
    } catch (err: any) {
      setTriggerError(err.message || 'Trigger execution failed');
    } finally {
      setIsTriggering(null);
    }
  };

  const handleTriggerBotReply = async () => {
    setIsTriggering('bot');
    setTriggerOutput(null);
    setTriggerError(null);

    try {
      const res = await fetch('/api/cron/bot-reply', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to trigger bot reply');

      setTriggerOutput(data);
      await loadData();
    } catch (err: any) {
      setTriggerError(err.message || 'Trigger execution failed');
    } finally {
      setIsTriggering(null);
    }
  };

  // 2. Topic Queue Bulk Submit
  const handleBulkAddTopics = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkTopics.trim() || isAddingTopics) return;

    setIsAddingTopics(true);
    try {
      const res = await fetch('/api/admin/topic-queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topics: bulkTopics,
          category: bulkCategory,
          priority: bulkPriority,
        }),
      });

      if (!res.ok) throw new Error('Failed to add topics');
      setBulkTopics('');
      await loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsAddingTopics(false);
    }
  };

  // 3. New Affiliate Product Submit
  const handleAddAffiliate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAffiliate.product_name || !newAffiliate.affiliate_url || isAddingAffiliate) return;

    setIsAddingAffiliate(true);
    try {
      const res = await fetch('/api/admin/affiliate-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAffiliate),
      });

      if (!res.ok) throw new Error('Failed to create affiliate link');
      setNewAffiliate({
        product_name: '',
        keywords: '',
        affiliate_url: '',
        badge_text: 'Editor Choice',
        description: '',
        price_estimate: '',
        cta_text: 'Check Best Price & Deal',
      });
      await loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsAddingAffiliate(false);
    }
  };

  // 4. Save Monetization Tracking IDs
  const handleSaveMonetization = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMonetization(true);
    setMonetizationMessage(null);

    try {
      const res = await fetch('/api/admin/monetization-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(monetizationForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save monetization settings');

      setMonetizationMessage(data.message || 'Payout tags updated successfully!');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Error saving monetization setup');
    } finally {
      setIsSavingMonetization(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Automation & Pipeline Management
          </h1>
          <p className="text-xs text-slate-300">
            Control automated Gemini generation pipelines, bulk seed topic queues, and monitor affiliate conversions.
          </p>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Published Articles</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-white">{stats.totalPosts}</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-[11px] text-slate-400">{stats.totalViews} total views</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Topic Queue Backlog</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-amber-400">{stats.pendingTopics}</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-[11px] text-slate-400">Ready for automated cron</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Forum Discussions</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-cyan-400">{stats.totalThreads}</span>
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-[11px] text-slate-400">AI seeded + user threads</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Affiliate Link Clicks</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-emerald-400">{stats.totalClicks}</span>
            <MousePointer className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[11px] text-slate-400">Tracked partner referrals</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('monetization')}
          className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-1.5 ${
            activeTab === 'monetization'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-emerald-400 border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>💵 Monetization & Payout Setup</span>
        </button>
        <button
          onClick={() => setActiveTab('triggers')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === 'triggers'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          ⚡ One-Click Triggers
        </button>
        <button
          onClick={() => setActiveTab('topics')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === 'topics'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          📝 Topic Queue ({stats.pendingTopics})
        </button>
        <button
          onClick={() => setActiveTab('affiliates')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === 'affiliates'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          💰 Affiliate Manager ({affiliateLinks.length})
        </button>
        <button
          onClick={() => setActiveTab('ads')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === 'ads'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          📢 Ad Slots & Monetization
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === 'logs'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          📊 Execution Logs
        </button>
      </div>

      {/* Tab 0: Monetization Setup & Earnings Wizard */}
      {activeTab === 'monetization' && (
        <div className="space-y-8">
          {/* Main Wizard Form */}
          <form onSubmit={handleSaveMonetization} className="rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 via-slate-900 to-slate-900 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Affiliate & Ad Earnings Engine</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  Configure Your Payout Tracking IDs
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                  Replace the default demo tags with your personal affiliate accounts. Every time Gemini publishes an article, it automatically embeds these IDs into high-converting callout cards and ad banners.
                </p>
              </div>

              {monetizationMessage && (
                <div className="rounded-xl bg-emerald-950/80 border border-emerald-500/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{monetizationMessage}</span>
                </div>
              )}
            </div>

            {/* Section 1: Affiliate Networks */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>1. Hardware & SaaS Affiliate Tracking Tags</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Amazon Associates */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Amazon Associates Tag</span>
                      <span className="text-amber-400 text-[10px] font-mono">(Mini PCs & Tech)</span>
                    </label>
                    <a
                      href="https://affiliate-program.amazon.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-indigo-400 hover:underline inline-flex items-center gap-0.5"
                    >
                      Sign Up Free <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <input
                    type="text"
                    value={monetizationForm.amazon_tag}
                    onChange={(e) => setMonetizationForm({ ...monetizationForm, amazon_tag: e.target.value })}
                    placeholder="e.g. yourtag-20"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Earns 3%–4% on Beelink/Minisforum local LLM rigs ($10–$25 per sale).
                  </p>
                </div>

                {/* Cursor AI Partner */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Cursor AI Referral Ref</span>
                      <span className="text-indigo-400 text-[10px] font-mono">(Code Editor)</span>
                    </label>
                    <a
                      href="https://cursor.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-indigo-400 hover:underline inline-flex items-center gap-0.5"
                    >
                      Cursor Portal <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <input
                    type="text"
                    value={monetizationForm.cursor_ref}
                    onChange={(e) => setMonetizationForm({ ...monetizationForm, cursor_ref: e.target.value })}
                    placeholder="e.g. yourusername"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Earns 20% recurring monthly commission on $20/mo Pro subscriptions.
                  </p>
                </div>

                {/* Notion AI */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Notion AI Affiliate ID</span>
                      <span className="text-cyan-400 text-[10px] font-mono">(Productivity)</span>
                    </label>
                    <a
                      href="https://notion.so/affiliates"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-indigo-400 hover:underline inline-flex items-center gap-0.5"
                    >
                      Notion Affiliates <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <input
                    type="text"
                    value={monetizationForm.notion_ref}
                    onChange={(e) => setMonetizationForm({ ...monetizationForm, notion_ref: e.target.value })}
                    placeholder="e.g. your_notion_aff_id"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Earns 50% first-year commissions on team & creator workspace subscriptions.
                  </p>
                </div>

                {/* Make.com */}
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Make.com Automation Partner Ref</span>
                      <span className="text-purple-400 text-[10px] font-mono">(Workflows)</span>
                    </label>
                    <a
                      href="https://make.com/en/partner"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-indigo-400 hover:underline inline-flex items-center gap-0.5"
                    >
                      Make Partner <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <input
                    type="text"
                    value={monetizationForm.make_ref}
                    onChange={(e) => setMonetizationForm({ ...monetizationForm, make_ref: e.target.value })}
                    placeholder="e.g. your_make_ref"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    Earns 20% recurring monthly payout on paid automation operation tiers.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Display Advertising (AdSense / Ezoic) */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-indigo-400" />
                  <span>2. Display Advertising (Google AdSense / Ezoic)</span>
                </h4>
                <a
                  href="/ads.txt"
                  target="_blank"
                  className="text-xs text-indigo-400 hover:underline font-mono inline-flex items-center gap-1"
                >
                  View Live /ads.txt <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400">
                    Google AdSense Publisher ID
                  </label>
                  <input
                    type="text"
                    value={monetizationForm.adsense_publisher_id}
                    onChange={(e) => setMonetizationForm({ ...monetizationForm, adsense_publisher_id: e.target.value })}
                    placeholder="ca-pub-0000000000000000"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white font-mono placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="enable_ads"
                    checked={monetizationForm.enable_ads}
                    onChange={(e) => setMonetizationForm({ ...monetizationForm, enable_ads: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                  />
                  <label htmlFor="enable_ads" className="text-xs text-slate-200 font-medium cursor-pointer">
                    Enable Ad Units across Header, Sidebar, and Articles
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-4">
              <span className="text-[11px] text-slate-400">
                Clicking save updates all existing articles, affiliate tables, and .env.local on disk.
              </span>
              <button
                type="submit"
                disabled={isSavingMonetization}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 disabled:opacity-50 transition"
              >
                {isSavingMonetization ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating Affiliate Links...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Payout Tags & Activate Monetization</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* 30-Day Revenue Execution Playbook */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">The 4-Step Playbook to $1,000/Month</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                <span className="rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] px-2 py-0.5 font-bold">STEP 1</span>
                <h4 className="text-sm font-bold text-white">Submit Sitemap to Google Search Console</h4>
                <p className="text-slate-400 leading-relaxed">
                  Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google Search Console</a>, add your domain, and submit <code className="text-indigo-300">/sitemap.xml</code>. Google will begin indexing your high-intent long-tail keywords.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                <span className="rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] px-2 py-0.5 font-bold">STEP 2</span>
                <h4 className="text-sm font-bold text-white">Activate $0/mo Vercel Autopilot Cron</h4>
                <p className="text-slate-400 leading-relaxed">
                  Deploy to Vercel with your free Gemini API key. Vercel automatically runs <code className="text-emerald-300">vercel.json</code> to publish 3 long-tail SEO posts per week and seeds companion forum threads without any manual intervention.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                <span className="rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] px-2 py-0.5 font-bold">STEP 3</span>
                <h4 className="text-sm font-bold text-white">Distribute Companion Forum Threads</h4>
                <p className="text-slate-400 leading-relaxed">
                  Share your seeded forum questions and benchmarks into <code className="text-slate-200">r/LocalLLaMA</code>, <code className="text-slate-200">r/selfhosted</code>, and <code className="text-slate-200">r/SideProject</code>. Authentic discussions drive direct, high-converting buyer traffic.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                <span className="rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] px-2 py-0.5 font-bold">STEP 4</span>
                <h4 className="text-sm font-bold text-white">Earn Double: Hardware Sales + Recurring SaaS</h4>
                <p className="text-slate-400 leading-relaxed">
                  Mini PC recommendations yield upfront payouts ($15–$25 per box), while Cursor and Make.com subscriptions generate compounding monthly recurring affiliate revenue.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: One-Click Triggers */}
      {activeTab === 'triggers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Trigger 1: Generate Blog Post */}
            <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 via-slate-900 to-slate-900 p-6 space-y-4 shadow-lg flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Generate Blog Post Now</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pulls next topic from queue (or trending topic), calls Gemini 2.5 Flash, formats structured JSON, injects affiliate callouts, publishes post, and seeds companion forum thread.
                </p>

                <div className="pt-2">
                  <input
                    type="text"
                    value={triggerTopic}
                    onChange={(e) => setTriggerTopic(e.target.value)}
                    placeholder="Optional: custom topic override..."
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                onClick={handleTriggerGeneratePost}
                disabled={isTriggering !== null}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition"
              >
                {isTriggering === 'post' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating Post with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run Blog Generator</span>
                  </>
                )}
              </button>
            </div>

            {/* Trigger 2: Seed Forum Thread */}
            <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 via-slate-900 to-slate-900 p-6 space-y-4 shadow-lg flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-9 w-9 rounded-xl bg-cyan-600 flex items-center justify-center text-white">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Seed Forum Discussion</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Checks for unseeded blog articles or generates an organic community debate topic with the &apos;SmartFlow Assistant&apos; persona.
                </p>
              </div>

              <button
                onClick={handleTriggerSeedForum}
                disabled={isTriggering !== null}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 text-xs font-semibold text-white shadow-md shadow-cyan-600/30 hover:bg-cyan-500 disabled:opacity-50 transition"
              >
                {isTriggering === 'thread' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Seeding Thread...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Seed Community Thread</span>
                  </>
                )}
              </button>
            </div>

            {/* Trigger 3: Run AI Helper Bot Reply */}
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-slate-900 to-slate-900 p-6 space-y-4 shadow-lg flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Trigger AI Helper Reply</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Scans unanswered community threads and generates a technical, high-quality answer with code examples and troubleshooting steps.
                </p>
              </div>

              <button
                onClick={handleTriggerBotReply}
                disabled={isTriggering !== null}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-semibold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500 disabled:opacity-50 transition"
              >
                {isTriggering === 'bot' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI Helper Drafting Reply...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Trigger AI Helper Reply</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Trigger Result Console */}
          {triggerOutput && (
            <div className="rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Job Completed Successfully ({triggerOutput.execution_time_ms} ms)</span>
              </div>

              {triggerOutput.data?.post && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-indigo-400">Generated Article</span>
                  <h4 className="text-base font-bold text-white">{triggerOutput.data.post.title}</h4>
                  <div className="flex items-center gap-3 pt-1">
                    <Link
                      href={`/blog/${triggerOutput.data.post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                      <span>View Live Post</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    {triggerOutput.data.seeded_forum_thread && (
                      <Link
                        href={`/forum/${triggerOutput.data.seeded_forum_thread.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                      >
                        <span>View Seeded Forum Thread</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {triggerOutput.thread && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-cyan-400">Seeded Thread</span>
                  <h4 className="text-sm font-bold text-white">{triggerOutput.thread.title}</h4>
                  <Link
                    href={`/forum/${triggerOutput.thread.slug}`}
                    className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline pt-1"
                  >
                    <span>View Thread in Forum</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {triggerOutput.data?.reply && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-emerald-400">AI Helper Reply Added</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    &ldquo;{triggerOutput.data.reply.content.slice(0, 180)}...&rdquo;
                  </p>
                </div>
              )}
            </div>
          )}

          {triggerError && (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-950/30 p-5 flex items-center gap-3 text-rose-300 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <div>
                <strong className="block font-semibold">Trigger Error:</strong>
                <span>{triggerError}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Topic Queue Manager */}
      {activeTab === 'topics' && (
        <div className="space-y-6">
          {/* Bulk Paste Box */}
          <form onSubmit={handleBulkAddTopics} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Bulk Add Keywords / Topics to Queue</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Paste long-tail topics or keywords (one per line or separated by commas). The scheduled cron pipeline will automatically draft, inject affiliate products, and publish articles sequentially.
            </p>

            <textarea
              value={bulkTopics}
              onChange={(e) => setBulkTopics(e.target.value)}
              rows={4}
              placeholder={`Best AMD Mini PC for 70B Quantized LLMs\nHow to Deploy Next.js to Cloudflare Pages for $0\nTop 5 Notion AI Automations for Micro-SaaS`}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Niche Subcategory</label>
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                >
                  <option value="AI Productivity">AI Productivity</option>
                  <option value="Budget Tech & Hardware">Budget Tech & Hardware</option>
                  <option value="Developer & Solopreneur Stacks">Developer & Solopreneur Stacks</option>
                  <option value="Tool Reviews & Benchmarks">Tool Reviews & Benchmarks</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Priority (1 = Low, 5 = High)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={bulkPriority}
                  onChange={(e) => setBulkPriority(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAddingTopics || !bulkTopics.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingTopics ? 'Queueing Topics...' : 'Add Topics to Queue'}</span>
            </button>
          </form>

          {/* Queue Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Current Topic Backlog ({topicQueue.length})</h4>
              <span className="text-xs text-slate-400">Processed highest priority first</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Topic / Keyword</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Date Added</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {topicQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-medium text-white max-w-sm truncate">
                        {item.keyword_or_topic}
                      </td>
                      <td className="p-3.5 text-slate-400">{item.niche_category}</td>
                      <td className="p-3.5 font-mono text-indigo-400 font-bold">{item.priority}</td>
                      <td className="p-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            item.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : item.status === 'processing'
                              ? 'bg-cyan-500/20 text-cyan-400 animate-pulse'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Affiliate Links Manager */}
      {activeTab === 'affiliates' && (
        <div className="space-y-6">
          {/* Add New Affiliate Product */}
          <form onSubmit={handleAddAffiliate} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 shadow-lg">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Add New Affiliate Product for AI Embedding</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When the AI drafts future blog posts, it automatically matches product keywords and embeds responsive callout cards with your affiliate tracking parameters.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Product Name *</label>
                <input
                  type="text"
                  value={newAffiliate.product_name}
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, product_name: e.target.value })}
                  placeholder="e.g. Minisforum UM780 XTX Mini PC"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Affiliate URL *</label>
                <input
                  type="url"
                  value={newAffiliate.affiliate_url}
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, affiliate_url: e.target.value })}
                  placeholder="https://amazon.com/dp/.../?tag=your-tag"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Trigger Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={newAffiliate.keywords}
                  onChange={(e) => setNewAffiliate({ ...newAffiliate, keywords: e.target.value })}
                  placeholder="mini pc, local llm, hardware, deepseek"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Badge Text & Price</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newAffiliate.badge_text}
                    onChange={(e) => setNewAffiliate({ ...newAffiliate, badge_text: e.target.value })}
                    placeholder="Top Pick"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={newAffiliate.price_estimate}
                    onChange={(e) => setNewAffiliate({ ...newAffiliate, price_estimate: e.target.value })}
                    placeholder="$399.00"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">Short Description</label>
              <textarea
                value={newAffiliate.description}
                onChange={(e) => setNewAffiliate({ ...newAffiliate, description: e.target.value })}
                rows={2}
                placeholder="Brief reason why this product is recommended for solopreneurs..."
                className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isAddingAffiliate}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-500 disabled:opacity-50 transition"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingAffiliate ? 'Saving Product...' : 'Add Affiliate Product'}</span>
            </button>
          </form>

          {/* Links Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">Active Affiliate Products ({affiliateLinks.length})</h4>
              <span className="text-xs text-slate-400">Automatic keyword injection</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Product Name</th>
                    <th className="p-3.5">Matched Keywords</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Clicks Tracked</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {affiliateLinks.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-bold text-white">
                        <div>{item.product_name}</div>
                        <span className="text-[10px] text-slate-400 font-normal">{item.badge_text}</span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex gap-1 flex-wrap max-w-xs">
                          {item.keywords.map((k) => (
                            <span key={k} className="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded text-[10px]">
                              {k}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-emerald-400">{item.price_estimate || '—'}</td>
                      <td className="p-3.5 font-mono font-bold text-indigo-400">{item.clicks}</td>
                      <td className="p-3.5">
                        <span className="rounded bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-semibold">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Monetization & Ad Slots */}
      {activeTab === 'ads' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Monetization Units & Ad Slots</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Configure slots for Google AdSense, Ezoic, or direct sponsor banners across your blog and community forum.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {adSlots.map((slot) => (
                <div key={slot.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-400 uppercase">{slot.position_key}</span>
                    <span className="rounded bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-semibold">
                      {slot.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">{slot.title || 'Slot Title'}</h5>
                    <p className="text-xs text-slate-400">{slot.subtitle || 'Slot Subtitle'}</p>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">
                    Target: {slot.banner_link_url || 'https://cloudflare.com'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Cron Logs */}
      {activeTab === 'logs' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Automation Execution Logs ({logs.length})</h4>
            <span className="text-xs text-slate-400">Recorded execution history</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Job Type</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Latency</th>
                  <th className="p-3.5">Details</th>
                  <th className="p-3.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 font-mono text-indigo-400 font-bold">{log.job_type}</td>
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          log.status === 'success'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">{log.execution_time_ms} ms</td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-400 max-w-xs truncate">
                      {JSON.stringify(log.details)}
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
