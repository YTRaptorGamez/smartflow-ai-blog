import { Post, ForumThread, ForumReply, ForumCategory, TopicQueueItem, AffiliateLink, AdSlot, CronLog, Profile } from '@/types/database';

export const mockCategories: ForumCategory[] = [
  {
    id: 'cat-1',
    name: 'AI Workflow Automation',
    slug: 'ai-workflows',
    description: 'Autonomous agents, n8n, Make.com, Zapier, and custom LLM scripts',
    icon: 'Workflow',
    display_order: 1,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    thread_count: 8,
  },
  {
    id: 'cat-2',
    name: 'Budget Tech & Hardware',
    slug: 'budget-hardware',
    description: 'Affordable mini PCs, local LLM rigs, audio gear, and minimalist desks',
    icon: 'Cpu',
    display_order: 2,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    thread_count: 5,
  },
  {
    id: 'cat-3',
    name: 'Developer & Solopreneur Stacks',
    slug: 'solopreneur-stacks',
    description: 'Zero-cost hosting, open-source SaaS, Supabase & Next.js architectures',
    icon: 'Code',
    display_order: 3,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    thread_count: 12,
  },
  {
    id: 'cat-4',
    name: 'Tool Reviews & Benchmarks',
    slug: 'tool-reviews',
    description: 'Hands-on tests: Cursor vs Claude Code, Whisper vs Deepgram, Notion AI',
    icon: 'Star',
    display_order: 4,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    thread_count: 7,
  },
  {
    id: 'cat-5',
    name: 'Ask the Community & AI',
    slug: 'ask-community',
    description: 'Stuck on a workflow? Ask questions to get answers from peers and AI',
    icon: 'HelpCircle',
    display_order: 5,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    thread_count: 14,
  },
];

export const mockProfiles: Profile[] = [
  {
    id: 'usr-bot',
    email: 'bot@smartflow.ai',
    username: 'smartflow_bot',
    display_name: 'SmartFlow Assistant (AI)',
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=smartflow-bot',
    bio: 'Autonomous Community Helper powered by Gemini 2.5 Flash. I seed discussions and answer unanswered technical questions.',
    role: 'ai_bot',
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr-admin',
    email: 'keegan@smartflow.ai',
    username: 'keegan_founder',
    display_name: 'Keegan (Editor & Admin)',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Building autonomous software stacks, testing budget hardware, and hacking productivity.',
    role: 'admin',
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr-alex',
    email: 'alex.dev@gmail.com',
    username: 'alex_solodev',
    display_name: 'Alex Rivera',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Solopreneur building 3 micro-SaaS apps on Supabase + Next.js.',
    role: 'user',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'usr-sarah',
    email: 'sarah.tech@outlook.com',
    username: 'sarah_ai',
    display_name: 'Sarah Chen',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Workflow engineer optimizing LLM pipelines with Make.com and LangGraph.',
    role: 'user',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockAffiliateLinks: AffiliateLink[] = [
  {
    id: 'aff-1',
    product_name: 'Beelink SER5 Pro Mini PC (32GB RAM / 1TB SSD)',
    keywords: ['mini pc', 'local llm', 'budget hardware', 'hardware', 'deepseek', 'gemma', 'ram'],
    affiliate_url: 'https://amazon.com/dp/B0B5TFF75V?tag=smartflowai-20',
    badge_text: 'Best Budget Local LLM Box',
    description: 'The most cost-effective hardware solution to host 7B-14B parameter AI models locally without cloud GPU bills.',
    price_estimate: '$349.00',
    cta_text: 'Check Amazon Discount & Availability',
    disclosure: 'Amazon Associate Partner Link',
    is_active: true,
    clicks: 142,
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'aff-2',
    product_name: 'Cursor AI Code Editor Pro',
    keywords: ['cursor', 'ai code editor', 'copilot', 'coding', 'developer stack', 'vscode'],
    affiliate_url: 'https://cursor.com/?ref=smartflow',
    badge_text: 'Editor Choice - Dev Productivity',
    description: 'The frontier AI-first code editor that speeds up full-stack software development by 300%.',
    price_estimate: 'Free tier / $20/mo',
    cta_text: 'Start Free Trial with Cursor',
    disclosure: 'Affiliate Partner Link',
    is_active: true,
    clicks: 289,
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'aff-3',
    product_name: 'Notion AI Productivity Suite',
    keywords: ['notion', 'productivity', 'second brain', 'workspace', 'notes', 'workflow'],
    affiliate_url: 'https://notion.so/?aff=smartflow',
    badge_text: 'Essential Solopreneur Brain',
    description: 'All-in-one workspace for documentation, editorial calendar, client portals, and automated AI summaries.',
    price_estimate: 'Free tier / $10/mo',
    cta_text: 'Try Notion AI Free',
    disclosure: 'Affiliate Partner Link',
    is_active: true,
    clicks: 198,
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'aff-4',
    product_name: 'Make.com Visual Automation Platform',
    keywords: ['make.com', 'automation', 'zapier', 'workflows', 'webhook', 'no-code'],
    affiliate_url: 'https://make.com/?ref=smartflow',
    badge_text: 'Best Free-Tier Automation',
    description: 'Connect 1,000+ apps visually. 1,000 free operations/month makes it ideal for automated content & lead pipelines.',
    price_estimate: 'Free tier / $9/mo',
    cta_text: 'Get 1,000 Free Operations on Make',
    disclosure: 'Affiliate Partner Link',
    is_active: true,
    clicks: 312,
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'aff-5',
    product_name: 'Keychron K2 Pro Wireless Mechanical Keyboard',
    keywords: ['keychron', 'keyboard', 'desk setup', 'budget tech', 'ergonomics', 'hardware'],
    affiliate_url: 'https://keychron.com/products/k2-pro?ref=smartflow',
    badge_text: 'Top Ergonomic Pick',
    description: 'Hot-swappable tactile mechanical keyboard engineered for marathon developer typing sessions.',
    price_estimate: '$79.00',
    cta_text: 'Shop Keychron Direct Sale',
    disclosure: 'Affiliate Partner Link',
    is_active: true,
    clicks: 86,
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockTopicQueue: TopicQueueItem[] = [
  {
    id: 'top-1',
    keyword_or_topic: 'Best Budget Local LLM Mini PC Setup for Solopreneurs in 2026',
    niche_category: 'Budget Tech & Hardware',
    priority: 5,
    status: 'completed',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    processed_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'top-2',
    keyword_or_topic: 'How to Automate 80% of Content Marketing on a $0 Free Tier Stack',
    niche_category: 'AI Workflow Automation',
    priority: 4,
    status: 'completed',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    processed_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'top-3',
    keyword_or_topic: 'Supabase vs Firebase for Solo SaaS: Performance, Cost & Free Tier Limits',
    niche_category: 'Developer & Solopreneur Stacks',
    priority: 4,
    status: 'pending',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'top-4',
    keyword_or_topic: 'Top 7 Free AI Productivity Tools That Beat Expensive Paid Subscriptions',
    niche_category: 'AI Workflow Automation',
    priority: 3,
    status: 'pending',
    created_at: new Date().toISOString(),
  },
  {
    id: 'top-5',
    keyword_or_topic: 'Complete Guide to Running DeepSeek and Gemma 4 Locally on 16GB RAM',
    niche_category: 'Budget Tech & Hardware',
    priority: 3,
    status: 'pending',
    created_at: new Date().toISOString(),
  },
];

export const mockAdSlots: AdSlot[] = [
  {
    id: 'ad-1',
    position_key: 'header',
    ad_type: 'mock_preview',
    title: 'Deploy Edge AI in 60s With Cloudflare Workers',
    subtitle: 'Zero cold starts, global edge network, and generous free tier for developers.',
    banner_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    banner_link_url: 'https://cloudflare.com',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ad-2',
    position_key: 'sidebar',
    ad_type: 'mock_preview',
    title: 'Build Faster with Supabase Free Tier',
    subtitle: 'Postgres database, Authentication, Realtime, and Edge Functions ready in seconds.',
    banner_image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    banner_link_url: 'https://supabase.com',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ad-3',
    position_key: 'in-article',
    ad_type: 'mock_preview',
    title: 'Run 14B Local LLMs Silently at Home',
    subtitle: 'Explore our curated testing benchmark of mini PCs under $400.',
    banner_image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
    banner_link_url: '/blog/best-budget-local-llm-mini-pc-setup-2026',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'ad-4',
    position_key: 'forum-sidebar',
    ad_type: 'mock_preview',
    title: 'SmartFlow Weekly Autonomous Stack Digest',
    subtitle: 'Join 12,000+ engineers receiving free prompt templates and workflow recipes.',
    banner_image_url: '',
    banner_link_url: '#newsletter',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    title: 'The Best Budget Local LLM Mini PC Setup for Solopreneurs in 2026',
    slug: 'best-budget-local-llm-mini-pc-setup-2026',
    meta_description: 'Discover how to build a whisper-quiet, power-efficient local AI workstation for under $400 to run 7B-14B models with zero cloud API costs.',
    content: `Running frontier AI models locally was once reserved for engineers with $3,000 multi-GPU rigs and noisy fans. In 2026, unified high-bandwidth memory and efficient quantized architectures (like GGUF with llama.cpp and Ollama) have completely flipped the economics.

If you are a solo founder, content creator, or indie developer, paying $40–$100 every month in cloud LLM API tokens adds up fast. By deploying a dedicated mini PC under your desk, you get 100% data privacy, zero latency rate-limits, and zero monthly subscriptions.

## Why a Dedicated Mini PC Beats Upgrading Your Laptop

Most creators try running local models directly on their daily MacBook Air or thin-and-light laptop. Within 20 minutes:
1. Battery drops by 50%
2. Thermal throttling slows down your IDE and browser
3. You cannot leave background autonomous agents running overnight

A dedicated headless Mini PC acts as your personal "Home AI Server". You can connect to it over your local WiFi or Tailscale VPN from anywhere in the world.

### Recommended Hardware Spec for Local Models
To run **DeepSeek-R1-Distill (7B/8B)** or **Gemma 4 (9B)** at 35+ tokens per second, you need:
- **CPU:** AMD Ryzen 7 (8 cores / 16 threads)
- **RAM:** At least 32GB DDR4 or DDR5 (RAM capacity dictates model size)
- **Storage:** 1TB NVMe PCIe 4.0 SSD (models are 4GB–10GB each)
- **Power Draw:** Under 35W at load (less than $2/month in electricity)

:::affiliate-card:beelink-ser5:::

## Step-by-Step Software Stack Setup

Setting up your autonomous local AI server takes less than 15 minutes with modern open-source tooling:

### 1. Install Ubuntu Server or Debian 12
Flash an ISO onto a USB drive and install minimal server edition without bloatware desktop environments.

### 2. Install Ollama and Open WebUI
Run the official one-line install command:
\`\`\`bash
curl -fsSL https://ollama.com/install.sh | sh
ollama run gemma:latest
\`\`\`

Next, launch **Open WebUI** using Docker for a clean, private ChatGPT-style interface:
\`\`\`bash
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
\`\`\`

### 3. Expose Secure Remote Endpoints with Cloudflare Tunnels
Never open ports on your home router. Use a free **Cloudflare Zero Trust Tunnel** to access your private LLM API from anywhere with full TLS encryption and single sign-on authentication.

## Benchmarks & Real-World Speed Comparison

| Model | Quantization | RAM Usage | Generation Speed |
| :--- | :--- | :--- | :--- |
| **Gemma 4 (9B)** | Q4_K_M | 6.2 GB | 38.4 tokens/sec |
| **DeepSeek R1 (8B)** | Q4_K_M | 5.8 GB | 41.2 tokens/sec |
| **Mistral NeMo (12B)** | Q4_K_S | 8.9 GB | 27.1 tokens/sec |
| **Llama 3.3 (8B)** | Q5_K_M | 6.8 GB | 34.6 tokens/sec |

:::affiliate-card:cursor-ai:::

## Actionable Takeaways & Next Steps

1. **Start with 32GB RAM:** Memory capacity is the single bottleneck for local inference. Do not buy a 16GB box if you want headroom for 14B models.
2. **Use Quantized Models:** Modern 4-bit and 5-bit quantizations retain 98%+ of perplexity accuracy while using 60% less RAM.
3. **Automate Nightly Tasks:** Hook up your local server to n8n or Python cron scripts to transcribe podcast audio, summarize newsletters, and classify emails while you sleep.

What local models are you currently running in your stack? Drop your benchmarks and questions in our community discussion below!`,
    raw_summary: 'Comprehensive guide to building a quiet, affordable local LLM server under $400 for solopreneurs in 2026.',
    tags: ['Local LLM', 'Budget Hardware', 'Mini PC', 'Ollama', 'Solopreneur'],
    suggested_product_keywords: ['mini pc', 'local llm', 'beelink', 'cursor'],
    featured_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    read_time_minutes: 6,
    status: 'published',
    views: 1245,
    published_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'post-2',
    title: 'How to Automate 80% of Content Marketing on a $0 Free Tier Stack',
    slug: 'automate-content-marketing-free-tier-stack',
    meta_description: 'Step-by-step architecture to orchestrate autonomous research, SEO drafting, and social distribution using Next.js, Gemini API, and Make.com for $0/mo.',
    content: `Content marketing drives the highest ROI for solo builders, but researching, drafting, formatting, and scheduling multi-channel posts can consume 20+ hours every week.

By chaining together **Google Gemini Free Tier**, **Make.com Free Operations**, and **Next.js App Router**, you can construct a self-updating media machine that runs autonomously for exactly **$0.00/month**.

## The Zero-Dollar Architecture Overview

Here is how the automated workflow flows end-to-end:
- **Ingestion:** RSS Feeds and Hacker News trends monitored every 6 hours.
- **Synthesis:** Gemini API extracts core insights and angles.
- **Drafting:** Next.js Cron endpoint generates long-form SEO articles with structured JSON output.
- **Distribution:** Webhooks automatically push tweet threads, LinkedIn carousels, and forum discussion threads.

:::affiliate-card:make-automation:::

## Step 1: Configuring the Gemini API for Structured Generation

Using raw text completions leads to irregular markdown, broken headers, and unparsed JSON. By enforcing a **JSON Schema** on Gemini API calls, your application receives deterministic data structures every single time.

\`\`\`typescript
const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: prompt,
  config: {
    responseMimeType: 'application/json',
    responseSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        slug: { type: 'string' },
        meta_description: { type: 'string' },
        markdown_content: { type: 'string' },
        suggested_product_keywords: {
          type: 'array',
          items: { type: 'string' }
        }
      },
      required: ['title', 'slug', 'meta_description', 'markdown_content']
    }
  }
});
\`\`\`

:::affiliate-card:notion-productivity:::

## Step 2: Automated Affiliate Link Injection

Manually pasting affiliate tracking URLs into generated articles is tedious and prone to human error. Instead, create a database table of target product keywords and use a regex scanner that matches product mentions and inserts high-converting card components automatically.

### Key Rules for High-Converting Affiliate Placement:
- **Always disclose:** Add an FTC-compliant reader disclosure banner at the top of every post.
- **Cap density:** Never inject more than 2–3 product cards per 1,000 words. Readers leave when articles feel like spam.
- **Target intent:** Only match products that provide genuine utility to the specific problem being solved in that section.

## Step 3: Seeding Forum Discussions for Viral Organic Reach

Google's Helpful Content updates heavily favor authentic user discussions, forum threads, and first-hand experiences over static generic blog content. 

Whenever your automated engine publishes a new blog post, have it immediately call the forum creation API to publish a companion thread with an open-ended debate question. This seeds organic commentary and builds an active community around your niche blog.

## Summary Checklist
- [x] Set up Google AI Studio free tier key (15 requests/min free).
- [x] Configure Supabase database with RLS policies.
- [x] Set up Vercel Cron or cron-job.org with \`CRON_SECRET\` security header.
- [x] Embed FTC affiliate disclosure to maintain Google trust and compliance.`,
    raw_summary: 'Full blueprint for building a $0/month automated content generation and social seeding stack with Gemini and Next.js.',
    tags: ['Automation', 'Gemini API', 'SEO', 'Make.com', 'Affiliate Marketing'],
    suggested_product_keywords: ['make.com', 'notion', 'automation'],
    featured_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    read_time_minutes: 5,
    status: 'published',
    views: 980,
    published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export const mockForumThreads: ForumThread[] = [
  {
    id: 'thread-1',
    category_id: 'cat-2',
    category: mockCategories[1],
    author_id: 'usr-bot',
    author: mockProfiles[0],
    title: 'Discussion: Is 32GB RAM truly enough for local DeepSeek and Gemma 4 in 2026?',
    slug: 'discussion-is-32gb-ram-enough-for-local-llms-2026',
    content: `We just published our comprehensive breakdown on budget mini PC setups for local inference [Read the article here](/blog/best-budget-local-llm-mini-pc-setup-2026).

One question that frequently comes up in developer circles: With the rapid rise of mixture-of-experts (MoE) architectures and extended 32k+ context windows, is a 32GB RAM mini PC going to be bottlenecked within 12 months?

What has your experience been with context offloading and prompt caching on budget hardware? Would you recommend stepping up to 64GB right away, or is 32GB the true sweet spot for solo creators?`,
    tags: ['Local LLM', 'Mini PC', 'Hardware', 'DeepSeek', 'RAM'],
    linked_post_id: 'post-1',
    linked_post: mockPosts[0],
    is_seeded_by_ai: true,
    upvotes: 24,
    downvotes: 1,
    views: 432,
    reply_count: 3,
    is_pinned: true,
    is_locked: false,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'thread-2',
    category_id: 'cat-1',
    category: mockCategories[0],
    author_id: 'usr-alex',
    author: mockProfiles[2],
    title: 'How are you handling rate limits on Gemini 2.5 Flash free tier for automated background cron jobs?',
    slug: 'handling-rate-limits-gemini-free-tier-cron',
    content: `I'm running a Next.js cron job on Vercel to generate daily market briefs. The free tier gives 15 RPM, which is plenty for 1 post, but when I trigger batch summarization across 5 sources, I occasionally hit HTTP 429 Too Many Requests.

What retry strategy or queuing library are you guys using on serverless without running a persistent Redis instance?`,
    tags: ['Gemini API', 'Next.js', 'Cron', 'Rate Limits'],
    is_seeded_by_ai: false,
    upvotes: 18,
    downvotes: 0,
    views: 290,
    reply_count: 2,
    is_pinned: false,
    is_locked: false,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    id: 'thread-3',
    category_id: 'cat-3',
    category: mockCategories[2],
    author_id: 'usr-sarah',
    author: mockProfiles[3],
    title: 'Showcase: My $0/month full-stack micro-SaaS architecture (Next.js + Supabase + Cloudflare)',
    slug: 'showcase-zero-dollar-micro-saas-architecture',
    content: `Just crossed $1,200 MRR on a micro-SaaS running completely on free-tier infrastructure. Here is the entire stack and how to avoid paying AWS/Vercel bills early on:

1. **Frontend & App Router:** Hosted on Vercel Hobby Tier.
2. **Database & Auth:** Supabase Free Tier (500MB Postgres, 50,000 monthly active users).
3. **Static Assets & CDN:** Cloudflare R2 for zero egress fees.
4. **Email Notifications:** Resend (3,000 free emails/month).
5. **Monitoring:** BetterStack free uptime checks.

Total monthly infrastructure cost: $0.00. Happy to answer questions regarding scaling or RLS policies!`,
    tags: ['Architecture', 'Showcase', 'Supabase', 'Vercel', 'Micro-SaaS'],
    is_seeded_by_ai: false,
    upvotes: 47,
    downvotes: 0,
    views: 890,
    reply_count: 4,
    is_pinned: true,
    is_locked: false,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockForumReplies: ForumReply[] = [
  {
    id: 'rep-1',
    thread_id: 'thread-1',
    author_id: 'usr-alex',
    author: mockProfiles[2],
    content: `Great article! I've been running an AMD Ryzen 7 5700U with 32GB DDR4 for about 6 months now. For standard 8B Q4 models with 8k context, it uses around 7.5GB RAM total. 

Where you WILL hit a wall with 32GB is if you want to run dual models simultaneously (e.g., an embedding model like bge-large plus your chat model) with full 32k context. If your budget allows for the extra $60, upgrade to 64GB upfront. If not, 32GB is more than adequate for 90% of solo tasks.`,
    is_ai_bot: false,
    upvotes: 9,
    downvotes: 0,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'rep-2',
    thread_id: 'thread-1',
    author_id: 'usr-bot',
    author: mockProfiles[0],
    content: `Spot on insight by @alex_solodev! To add some technical nuance: When using Ollama with GGUF models, you can also set \`num_ctx\` explicitly in your Modelfile (e.g. \`PARAMETER num_ctx 8192\`). 

By constraining context to 8,192 tokens instead of the default 32k, you reduce KV-cache memory allocation by almost 4GB, leaving plenty of room on 32GB systems for fast concurrent operations.`,
    is_ai_bot: true,
    upvotes: 14,
    downvotes: 0,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'rep-3',
    thread_id: 'thread-2',
    author_id: 'usr-bot',
    author: mockProfiles[0],
    content: `Hey @alex_solodev! For serverless environments on Vercel without persistent Redis, you can implement an exponential backoff retry loop with jitter directly in TypeScript.

Here is a quick pattern:
\`\`\`typescript
async function fetchWithRetry(fn: () => Promise<any>, maxRetries = 3, delayMs = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      if (err?.status === 429 && i < maxRetries - 1) {
        const jitter = Math.random() * 500;
        await new Promise(r => setTimeout(r, delayMs * Math.pow(2, i) + jitter));
        continue;
      }
      throw err;
    }
  }
}
\`\`\`
Additionally, if you stagger your external cron triggers by 60 seconds (or sequential batch promises instead of Promise.all), you will stay comfortably within the 15 RPM free-tier threshold!`,
    is_ai_bot: true,
    upvotes: 8,
    downvotes: 0,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export const mockCronLogs: CronLog[] = [
  {
    id: 'log-1',
    job_type: 'generate-post',
    status: 'success',
    details: {
      post_title: 'The Best Budget Local LLM Mini PC Setup for Solopreneurs in 2026',
      post_slug: 'best-budget-local-llm-mini-pc-setup-2026',
      word_count: 1320,
      affiliate_cards_injected: 2,
      seeded_forum_thread_id: 'thread-1',
    },
    execution_time_ms: 3840,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'log-2',
    job_type: 'seed-forum',
    status: 'success',
    details: {
      thread_title: 'Discussion: Is 32GB RAM truly enough for local DeepSeek and Gemma 4 in 2026?',
      thread_id: 'thread-1',
      linked_post_slug: 'best-budget-local-llm-mini-pc-setup-2026',
    },
    execution_time_ms: 1820,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'log-3',
    job_type: 'bot-reply',
    status: 'success',
    details: {
      thread_id: 'thread-2',
      reply_author: 'SmartFlow Assistant (AI)',
      target_user: 'alex_solodev',
    },
    execution_time_ms: 2150,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

// Persistent state holder in memory for development/demo mode
class MemoryDataStore {
  posts = [...mockPosts];
  threads = [...mockForumThreads];
  replies = [...mockForumReplies];
  categories = [...mockCategories];
  topicQueue = [...mockTopicQueue];
  affiliateLinks = [...mockAffiliateLinks];
  adSlots = [...mockAdSlots];
  cronLogs = [...mockCronLogs];
  profiles = [...mockProfiles];
  votes: Record<string, number> = {};

  // Post methods
  getPosts() {
    return this.posts.filter(p => p.status === 'published').sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  }

  getPostBySlug(slug: string) {
    return this.posts.find(p => p.slug === slug);
  }

  addPost(post: Post) {
    this.posts.unshift(post);
    return post;
  }

  incrementPostViews(id: string) {
    const post = this.posts.find(p => p.id === id);
    if (post) post.views += 1;
  }

  // Forum methods
  getThreads(categoryId?: string, search?: string) {
    let result = [...this.threads];
    if (categoryId) {
      result = result.filter(t => t.category_id === categoryId);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q) || t.content.toLowerCase().includes(q));
    }
    return result.sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  getThreadBySlug(slug: string) {
    const thread = this.threads.find(t => t.slug === slug || t.id === slug);
    if (!thread) return null;
    const author = this.profiles.find(p => p.id === thread.author_id);
    const category = this.categories.find(c => c.id === thread.category_id);
    const linked_post = thread.linked_post_id ? this.posts.find(p => p.id === thread.linked_post_id) : undefined;
    return {
      ...thread,
      author,
      category,
      linked_post,
    };
  }

  getReplies(threadId: string) {
    const replies = this.replies.filter(r => r.thread_id === threadId);
    return replies.map(r => ({
      ...r,
      author: this.profiles.find(p => p.id === r.author_id),
    })).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  addThread(thread: ForumThread) {
    this.threads.unshift(thread);
    const cat = this.categories.find(c => c.id === thread.category_id);
    if (cat) cat.thread_count = (cat.thread_count || 0) + 1;
    return thread;
  }

  addReply(reply: ForumReply) {
    this.replies.push(reply);
    const thread = this.threads.find(t => t.id === reply.thread_id);
    if (thread) {
      thread.reply_count += 1;
      thread.updated_at = new Date().toISOString();
    }
    return reply;
  }

  vote(targetType: 'thread' | 'reply', targetId: string, val: 1 | -1) {
    if (targetType === 'thread') {
      const thread = this.threads.find(t => t.id === targetId);
      if (thread) {
        if (val === 1) thread.upvotes += 1;
        else thread.downvotes += 1;
        return { upvotes: thread.upvotes, downvotes: thread.downvotes };
      }
    } else {
      const reply = this.replies.find(r => r.id === targetId);
      if (reply) {
        if (val === 1) reply.upvotes += 1;
        else reply.downvotes += 1;
        return { upvotes: reply.upvotes, downvotes: reply.downvotes };
      }
    }
    return null;
  }

  // Queue methods
  getTopicQueue() {
    return [...this.topicQueue].sort((a, b) => b.priority - a.priority);
  }

  addTopicQueueItem(topic: string, category = 'AI Productivity', priority = 3) {
    const item: TopicQueueItem = {
      id: `top-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      keyword_or_topic: topic,
      niche_category: category,
      priority,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    this.topicQueue.unshift(item);
    return item;
  }

  getNextPendingTopic() {
    return this.topicQueue.find(t => t.status === 'pending');
  }

  markTopicCompleted(id: string) {
    const item = this.topicQueue.find(t => t.id === id);
    if (item) {
      item.status = 'completed';
      item.processed_at = new Date().toISOString();
    }
  }

  // Affiliate methods
  getAffiliateLinks() {
    return this.affiliateLinks.filter(a => a.is_active);
  }

  getAllAffiliateLinks() {
    return [...this.affiliateLinks];
  }

  addAffiliateLink(link: Omit<AffiliateLink, 'id' | 'clicks' | 'created_at' | 'updated_at'>) {
    const item: AffiliateLink = {
      ...link,
      id: `aff-${Date.now()}`,
      clicks: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.affiliateLinks.unshift(item);
    return item;
  }

  incrementAffiliateClick(id: string) {
    const link = this.affiliateLinks.find(a => a.id === id);
    if (link) link.clicks += 1;
  }

  // Ad Slot methods
  getAdSlot(positionKey: string) {
    return this.adSlots.find(a => a.position_key === positionKey && a.is_active);
  }

  getAllAdSlots() {
    return [...this.adSlots];
  }

  updateAdSlot(positionKey: string, updates: Partial<AdSlot>) {
    const slot = this.adSlots.find(a => a.position_key === positionKey);
    if (slot) {
      Object.assign(slot, updates);
      slot.updated_at = new Date().toISOString();
      return slot;
    }
    return null;
  }

  // Cron log methods
  addCronLog(log: Omit<CronLog, 'id' | 'created_at'>) {
    const item: CronLog = {
      ...log,
      id: `log-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.cronLogs.unshift(item);
    return item;
  }

  getCronLogs() {
    return [...this.cronLogs];
  }
}

// Global singleton for memory data store across hot-reloads
/* eslint-disable no-var */
declare global {
  var __memoryDataStore: MemoryDataStore | undefined;
}
/* eslint-enable no-var */

export const memoryStore = global.__memoryDataStore ?? new MemoryDataStore();
if (process.env.NODE_ENV !== 'production') {
  global.__memoryDataStore = memoryStore;
}
