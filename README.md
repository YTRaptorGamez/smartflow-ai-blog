# SmartFlow AI: Autonomous Niche Blog & Community Forum

> A production-ready, full-stack, self-sustaining content engine and developer forum designed to run on **$0/month free-tier infrastructure**.

---

## 🚀 Key Highlights & Architecture

- **Autonomous Blog Engine (`/blog` & `/blog/[slug]`):** Automatically generates SEO-optimized, 1,000+ word articles on a schedule, complete with H2/H3 headers, code examples, comparison tables, and dynamic OpenGraph + JSON-LD Article schema.
- **Automated Affiliate Monetization:** Scans generated markdown and intelligently injects high-converting FTC-compliant product callout boxes matching target keywords against your `affiliate_links` database table.
- **Reddit/Discourse-Style Community Forum (`/forum` & `/forum/[slug]`):** Features categories, upvote/downvote counters, nested replies, search, and dynamic view tracking.
- **Engagement Seeding Pipeline:** When a new post publishes, the engine automatically creates a linked discussion thread in the forum asking an open-ended debate question.
- **AI Community Helper Bot:** Automatically scans unanswered questions and posts friendly, technically accurate responses powered by Gemini.
- **Admin Command Center (`/admin`):** One-click manual triggers for generation, bulk topic queue manager, affiliate link CRUD table, ad slot configurator, and real-time execution logs.
- **Ad Slots (`<AdSlot />`):** Pre-configured slots for Google AdSense, Ezoic, or direct sponsor banners with zero layout shift.

---

## 🛠️ $0/Month Free-Tier Tech Stack

| Layer | Service / Technology | Free-Tier Limits |
| :--- | :--- | :--- |
| **Frontend & API** | **Next.js 14 App Router** (TypeScript + Tailwind CSS) | Hosted free on Vercel Hobby Tier |
| **Database & Auth** | **Supabase (PostgreSQL + RLS)** | 500 MB Postgres database, 50,000 monthly active users |
| **AI Generation** | **Google Gemini API** (`gemini-2.5-flash`) | 15 requests/minute free via Google AI Studio |
| **Cron Scheduling** | **Vercel Cron** or **cron-job.org** | Included free with `CRON_SECRET` header |
| **Monetization** | **Affiliate Partners + Google AdSense / Ezoic** | $0 to run; direct revenue generation |

---

## 📋 Quick Start & Installation

### 1. Clone & Install Dependencies

```bash
cd niche-ai-blog-forum
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Open `.env.local` and add your keys:

```ini
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Google Gemini API Key (Get free from https://aistudio.google.com/apikey)
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
GEMINI_MODEL="gemini-2.5-flash"

# Cron Security Secret (used in Authorization: Bearer <CRON_SECRET>)
CRON_SECRET="your_custom_secret_key_123"

# Admin Passcode & Email
ADMIN_EMAIL="admin@yourdomain.com"
ADMIN_SECRET="your_admin_secret"

# Site Domain
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

> **Note:** The platform includes an intelligent in-memory fallback layer. Even before you plug in your Supabase or Gemini keys, you can run `npm run dev` and immediately test all features (blog reading, forum commenting, voting, and the admin dashboard) with high-fidelity sample data!

### 3. Initialize Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) and create a free project.
2. Navigate to **SQL Editor**.
3. Open `supabase/schema.sql` in this repo, copy its entire contents, paste into the SQL Editor, and click **Run**.
4. This will create:
   - All tables: `profiles`, `posts`, `topic_queue`, `affiliate_links`, `forum_categories`, `forum_threads`, `forum_replies`, `forum_votes`, `ad_slots`, `cron_logs`, `site_settings`.
   - All Row-Level Security (RLS) policies.
   - Initial seed data (categories, starter queue, affiliate products, and ad slots).

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚡ Automation & Cron Routes

All automation endpoints are located under `/api/cron/*` and secured with the `CRON_SECRET` token.

### Endpoints:

1. **`POST /api/cron/generate-post`**
   - Automatically picks the highest-priority pending keyword from `topic_queue`.
   - Prompts Gemini for structured JSON: Title, slug, meta description, tags, suggested product keywords, and 1,000+ words of markdown content.
   - Matches keywords against `affiliate_links` and embeds high-converting product recommendation boxes.
   - Publishes to `posts` table and calls forum seeder.
   - Triggers: Vercel Cron or `curl -X POST https://your-site.vercel.app/api/cron/generate-post -H "Authorization: Bearer <CRON_SECRET>"`

2. **`POST /api/cron/seed-forum`**
   - Checks for recently published blog articles that lack a companion discussion thread.
   - Seeds an open-ended debate thread with the "SmartFlow Assistant" bot persona.

3. **`POST /api/cron/bot-reply`**
   - Scans forum threads with 0 replies.
   - Generates a helpful, non-robotic answer with practical tips or code examples.

### Scheduling with Free External Cron (e.g. cron-job.org):
If you prefer not using Vercel Cron, set up a free recurring job on [cron-job.org](https://cron-job.org):
- **URL:** `https://yourdomain.com/api/cron/generate-post`
- **Method:** `POST` or `GET`
- **Header:** `x-cron-secret: your_custom_secret_key_123`
- **Schedule:** Monday, Wednesday, Friday at 10:00 AM UTC

---

## 💼 Monetization Guide

### 1. Affiliate Link Injection
- Go to `/admin` -> **Affiliate Manager**.
- Add your products with target keywords (e.g. Product: `Beelink SER5 Mini PC`, Keywords: `mini pc, local llm, hardware`).
- When future articles are generated, any section discussing those keywords will automatically receive a styled FTC-compliant callout card.
- Outbound clicks route through `/api/affiliate/track?id=...` which increments the click counter before redirecting to the merchant.

### 2. Ad Placement (`<AdSlot />`)
- **`header`**: High-CTR sponsor banner at top of site.
- **`in-article`**: Native sponsored box placed mid-article in blog guides.
- **`sidebar`**: Sticky sidebar box on home and blog index.
- **`forum-sidebar`**: Newsletter or sponsor spotlight in forum views.
- To switch from mock previews to live Google AdSense or Ezoic, configure `ad_type: "adsense_script"` and provide your Publisher ID in `.env.local`.

---

## 🚢 Deployment to Vercel

1. Push your repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/new), import your repository.
3. In **Settings -> Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - `CRON_SECRET`
   - `ADMIN_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-domain.vercel.app`)
4. Click **Deploy**. Vercel will automatically read `vercel.json` and schedule your free crons!

---

## 📄 License
MIT License. Built for creators and developers building autonomous digital media assets.
