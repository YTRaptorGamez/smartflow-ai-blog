-- ====================================================================
-- SmartFlow AI Platform - Database Schema (Supabase / PostgreSQL)
-- Production-Ready Schema with Full Row-Level Security (RLS) Policies
-- Free-Tier Optimized ($0/month)
-- ====================================================================

-- 1. Enable Required Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- 2. Profiles Table (Extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  role text default 'user' check (role in ('user', 'admin', 'ai_bot')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Index for username searches and role queries
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_username on public.profiles(username);

-- 3. Topic Queue Table (Feeds automated AI blog pipeline)
create table if not exists public.topic_queue (
  id uuid primary key default gen_random_uuid(),
  keyword_or_topic text not null,
  niche_category text default 'AI Productivity' not null,
  priority integer default 1 not null,
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')) not null,
  error_message text,
  created_at timestamptz default now() not null,
  processed_at timestamptz
);

create index if not exists idx_topic_queue_status_prio on public.topic_queue(status, priority desc, created_at asc);

-- 4. Affiliate Links Table (Keyword matching & high-converting CTA cards)
create table if not exists public.affiliate_links (
  id uuid primary key default gen_random_uuid(),
  product_name text not null,
  keywords text[] not null default '{}',
  affiliate_url text not null,
  badge_text text default 'Editor Choice',
  description text,
  price_estimate text,
  cta_text text default 'View Tool & Current Pricing',
  disclosure text default 'Affiliate Partner Link',
  is_active boolean default true not null,
  clicks integer default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_affiliate_links_active on public.affiliate_links(is_active);

-- 5. Blog Posts Table (SEO-optimized articles with OpenGraph & Schema)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  meta_description text not null,
  content text not null, -- Markdown with embedded affiliate cards
  raw_summary text,
  tags text[] not null default '{}',
  suggested_product_keywords text[] not null default '{}',
  featured_image text,
  read_time_minutes integer default 5 not null,
  status text default 'published' check (status in ('draft', 'published', 'archived')) not null,
  views integer default 0 not null,
  published_at timestamptz default now() not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_posts_slug on public.posts(slug);
create index if not exists idx_posts_published on public.posts(status, published_at desc);
create index if not exists idx_posts_tags on public.posts using gin(tags);

-- 6. Forum Categories Table
create table if not exists public.forum_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text default 'MessageSquare' not null,
  display_order integer default 0 not null,
  created_at timestamptz default now() not null
);

-- 7. Forum Threads Table
create table if not exists public.forum_threads (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.forum_categories(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete set null,
  title text not null,
  slug text not null,
  content text not null,
  tags text[] not null default '{}',
  linked_post_id uuid references public.posts(id) on delete set null,
  is_seeded_by_ai boolean default false not null,
  upvotes integer default 0 not null,
  downvotes integer default 0 not null,
  views integer default 0 not null,
  reply_count integer default 0 not null,
  is_pinned boolean default false not null,
  is_locked boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_threads_category on public.forum_threads(category_id, created_at desc);
create index if not exists idx_threads_linked_post on public.forum_threads(linked_post_id);
create index if not exists idx_threads_seeded on public.forum_threads(is_seeded_by_ai);

-- 8. Forum Replies Table (Supports nested conversations)
create table if not exists public.forum_replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references public.forum_threads(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete set null,
  parent_reply_id uuid references public.forum_replies(id) on delete cascade,
  content text not null,
  is_ai_bot boolean default false not null,
  upvotes integer default 0 not null,
  downvotes integer default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index if not exists idx_replies_thread on public.forum_replies(thread_id, created_at asc);
create index if not exists idx_replies_parent on public.forum_replies(parent_reply_id);

-- 9. Forum Votes Table (Reddit-style voting with duplicate prevention)
create table if not exists public.forum_votes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  target_type text not null check (target_type in ('thread', 'reply')),
  target_id uuid not null,
  vote_value integer not null check (vote_value in (1, -1)),
  created_at timestamptz default now() not null,
  constraint unique_user_vote unique (user_id, target_type, target_id)
);

create index if not exists idx_votes_target on public.forum_votes(target_type, target_id);

-- 10. Ad Slots Table (Monetization slots for Google AdSense / Ezoic / Custom)
create table if not exists public.ad_slots (
  id uuid primary key default gen_random_uuid(),
  position_key text not null unique check (position_key in ('header', 'sidebar', 'in-article', 'forum-sidebar', 'footer')),
  ad_type text default 'mock_preview' check (ad_type in ('mock_preview', 'custom_banner', 'adsense_script')) not null,
  title text,
  subtitle text,
  banner_image_url text,
  banner_link_url text,
  script_code text,
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 11. Cron Execution Logs Table
create table if not exists public.cron_logs (
  id uuid primary key default gen_random_uuid(),
  job_type text not null check (job_type in ('generate-post', 'seed-forum', 'bot-reply', 'manual-trigger')),
  status text not null check (status in ('success', 'failed', 'skipped')),
  details jsonb default '{}'::jsonb not null,
  execution_time_ms integer default 0 not null,
  created_at timestamptz default now() not null
);

create index if not exists idx_cron_logs_job on public.cron_logs(job_type, created_at desc);

-- 12. Site Settings Table
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamptz default now() not null
);

-- ====================================================================
-- Helper Functions & Triggers
-- ====================================================================

-- Trigger: Automatically create public.profiles entry upon auth.users signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, username, display_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.id::text),
    case when new.email = (select value->>'admin_email' from public.site_settings where key = 'admin_config') then 'admin' else 'user' end
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger: Update forum_threads reply_count upon reply insertion/deletion
create or replace function public.update_thread_reply_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if (TG_OP = 'INSERT') then
    update public.forum_threads
    set reply_count = reply_count + 1, updated_at = now()
    where id = new.thread_id;
    return new;
  elsif (TG_OP = 'DELETE') then
    update public.forum_threads
    set reply_count = greatest(0, reply_count - 1), updated_at = now()
    where id = old.thread_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists trg_thread_reply_count on public.forum_replies;
create trigger trg_thread_reply_count
  after insert or delete on public.forum_replies
  for each row execute function public.update_thread_reply_count();

-- Function: Atomic increment for post views
create or replace function public.increment_post_views(target_post_id uuid)
returns void
language sql
security definer
as $$
  update public.posts
  set views = views + 1
  where id = target_post_id;
$$;

-- Function: Atomic increment for affiliate clicks
create or replace function public.increment_affiliate_clicks(target_link_id uuid)
returns void
language sql
security definer
as $$
  update public.affiliate_links
  set clicks = clicks + 1
  where id = target_link_id;
$$;

-- Function: Check if current user is admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

alter table public.profiles enable row level security;
alter table public.topic_queue enable row level security;
alter table public.affiliate_links enable row level security;
alter table public.posts enable row level security;
alter table public.forum_categories enable row level security;
alter table public.forum_threads enable row level security;
alter table public.forum_replies enable row level security;
alter table public.forum_votes enable row level security;
alter table public.ad_slots enable row level security;
alter table public.cron_logs enable row level security;
alter table public.site_settings enable row level security;

-- PROFILES Policies
create policy "Profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- POSTS Policies
create policy "Published posts are viewable by everyone" on public.posts
  for select using (status = 'published' or public.is_admin());

create policy "Admins can insert/update/delete posts" on public.posts
  for all using (public.is_admin());

-- TOPIC QUEUE Policies
create policy "Admins can view and manage topic queue" on public.topic_queue
  for all using (public.is_admin());

-- AFFILIATE LINKS Policies
create policy "Active affiliate links are viewable by everyone" on public.affiliate_links
  for select using (is_active = true or public.is_admin());

create policy "Admins can manage affiliate links" on public.affiliate_links
  for all using (public.is_admin());

-- FORUM CATEGORIES Policies
create policy "Forum categories are viewable by everyone" on public.forum_categories
  for select using (true);

create policy "Admins can manage forum categories" on public.forum_categories
  for all using (public.is_admin());

-- FORUM THREADS Policies
create policy "Forum threads are viewable by everyone" on public.forum_threads
  for select using (true);

create policy "Authenticated users can create forum threads" on public.forum_threads
  for insert with check (auth.role() = 'authenticated');

create policy "Authors or admins can update forum threads" on public.forum_threads
  for update using (auth.uid() = author_id or public.is_admin());

create policy "Authors or admins can delete forum threads" on public.forum_threads
  for delete using (auth.uid() = author_id or public.is_admin());

-- FORUM REPLIES Policies
create policy "Forum replies are viewable by everyone" on public.forum_replies
  for select using (true);

create policy "Authenticated users can create replies" on public.forum_replies
  for insert with check (auth.role() = 'authenticated');

create policy "Authors or admins can update replies" on public.forum_replies
  for update using (auth.uid() = author_id or public.is_admin());

create policy "Authors or admins can delete replies" on public.forum_replies
  for delete using (auth.uid() = author_id or public.is_admin());

-- FORUM VOTES Policies
create policy "Votes are viewable by everyone" on public.forum_votes
  for select using (true);

create policy "Users can vote once per item" on public.forum_votes
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own vote" on public.forum_votes
  for update using (auth.uid() = user_id);

create policy "Users can delete their vote" on public.forum_votes
  for delete using (auth.uid() = user_id);

-- AD SLOTS Policies
create policy "Active ad slots are viewable by everyone" on public.ad_slots
  for select using (is_active = true or public.is_admin());

create policy "Admins can manage ad slots" on public.ad_slots
  for all using (public.is_admin());

-- CRON LOGS Policies
create policy "Admins can view cron logs" on public.cron_logs
  for select using (public.is_admin());

-- SITE SETTINGS Policies
create policy "Site settings are viewable by everyone" on public.site_settings
  for select using (true);

create policy "Admins can modify site settings" on public.site_settings
  for all using (public.is_admin());

-- ====================================================================
-- SEED DATA: Categories, Topic Queue, Affiliate Products, Ad Slots
-- ====================================================================

-- 1. Forum Categories
insert into public.forum_categories (name, slug, description, icon, display_order)
values
  ('AI Workflow Automation', 'ai-workflows', 'Share n8n, Make, Zapier, and autonomous agent setups', 'Workflow', 1),
  ('Budget Tech & Hardware', 'budget-hardware', 'Affordable mini PCs, local LLM rigs, audio gear, and desk setups', 'Cpu', 2),
  ('Developer & Solopreneur Stacks', 'solopreneur-stacks', 'Free-tier hosting, open-source SaaS, and Next.js/Supabase architectures', 'Code', 3),
  ('Tool Reviews & Comparisons', 'tool-reviews', 'Honest discussions and benchmarks: Cursor vs Copilot, Claude vs Gemini', 'Star', 4),
  ('Ask the Community & AI', 'ask-community', 'Get help debugging workflows, choosing tools, or optimizing productivity', 'HelpCircle', 5)
on conflict (slug) do nothing;

-- 2. Initial Topic Queue Seeds
insert into public.topic_queue (keyword_or_topic, niche_category, priority, status)
values
  ('Best Budget Local LLM Mini PC Setup for Solopreneurs in 2026', 'Budget Tech & Hardware', 5, 'pending'),
  ('How to Automate 80% of Content Marketing on a $0 Free Tier Stack', 'AI Workflow Automation', 4, 'pending'),
  ('Supabase vs Firebase for Solo SaaS: Performance, Cost & Free Tier Limits', 'Developer & Solopreneur Stacks', 4, 'pending'),
  ('Top 7 Free AI Productivity Tools That Beat Expensive Paid Subscriptions', 'AI Workflow Automation', 3, 'pending'),
  ('Complete Guide to Running DeepSeek and Gemma 4 Locally on 16GB RAM', 'Budget Tech & Hardware', 3, 'pending'),
  ('Building an Autonomous Customer Support Agent with Next.js and Gemini API', 'Developer & Solopreneur Stacks', 2, 'pending')
on conflict do nothing;

-- 3. Initial Affiliate Links (Real, high-converting products in AI productivity & budget tech)
insert into public.affiliate_links (product_name, keywords, affiliate_url, badge_text, description, price_estimate, cta_text)
values
  (
    'Beelink SER5 Pro Mini PC (32GB RAM / 1TB SSD)',
    ARRAY['mini pc', 'local llm', 'budget hardware', 'hardware', 'deepseek', 'gemma', 'ram'],
    'https://amazon.com/dp/B0B5TFF75V?tag=weegan04-20',
    'Best Budget Local LLM Box',
    'The most cost-effective hardware solution to host 7B-14B parameter AI models locally without cloud GPU bills.',
    '$349.00',
    'Check Amazon Discount & Availability'
  ),
  (
    'Cursor AI Code Editor Pro',
    ARRAY['cursor', 'ai code editor', 'copilot', 'coding', 'developer stack', 'vscode'],
    'https://cursor.com/?ref=smartflow',
    'Editor Choice - Dev Productivity',
    'The frontier AI-first code editor that speeds up full-stack software development by 300%.',
    'Free tier / $20/mo',
    'Start Free Trial with Cursor'
  ),
  (
    'Notion AI Productivity Suite',
    ARRAY['notion', 'productivity', 'second brain', 'workspace', 'notes', 'workflow'],
    'https://notion.so/?aff=smartflow',
    'Essential Solopreneur Brain',
    'All-in-one workspace for documentation, editorial calendar, client portals, and automated AI summaries.',
    'Free tier / $10/mo',
    'Try Notion AI Free'
  ),
  (
    'Make.com Visual Automation Platform',
    ARRAY['make.com', 'automation', 'zapier', 'workflows', 'webhook', 'no-code'],
    'https://make.com/?ref=smartflow',
    'Best Free-Tier Automation',
    'Connect 1,000+ apps visually. 1,000 free operations/month makes it ideal for automated content & lead pipelines.',
    'Free tier / $9/mo',
    'Get 1,000 Free Operations on Make'
  ),
  (
    'Keychron K2 Wireless Mechanical Keyboard',
    ARRAY['keychron', 'keyboard', 'desk setup', 'budget tech', 'ergonomics', 'hardware'],
    'https://amazon.com/dp/B07QCP6656?tag=weegan04-20',
    'Top Ergonomic Pick',
    'Hot-swappable tactile mechanical keyboard engineered for marathon developer typing sessions.',
    '$79.99',
    'Check Amazon Discount'
  ),
  (
    'Crucial RAM 32GB Kit (2x16GB) DDR4/DDR5 Laptop/Mini PC Memory',
    ARRAY['crucial', 'ram', 'memory', 'ddr4', 'ddr5', 'upgrade', 'local llm hardware'],
    'https://amazon.com/dp/B08C4X98GK?tag=weegan04-20',
    'Essential LLM Upgrade',
    'Double your mini PC memory to easily load 14B and 32B quantized AI models with low latency.',
    '$64.99',
    'View on Amazon'
  ),
  (
    'Samsung 990 PRO 2TB PCIe 4.0 NVMe SSD',
    ARRAY['ssd', 'nvme', 'samsung', 'storage', 'fast drive', 'model weights', 'download'],
    'https://amazon.com/dp/B0BHJJ9Y77?tag=weegan04-20',
    'High-Speed LLM Storage',
    'Blazing 7,450 MB/s read speeds for instant model checkpoint loading into system memory.',
    '$169.99',
    'View on Amazon'
  ),
  (
    'Acer Aspire 5 Slim Laptop (15.6 FHD / 512GB SSD)',
    ARRAY['laptop', 'budget laptop', 'notebook', 'acer', 'computer', 'school', 'remote work', 'pc'],
    'https://amazon.com/dp/B0BSLV1ZTX?tag=weegan04-20',
    'Best Budget Laptop Under $400',
    'Crisp 1080p IPS display, fast 512GB SSD storage, and all-day battery life for productivity, remote work, and studying.',
    '$389.99',
    'Check Amazon Deal & Availability'
  ),
  (
    'Anker Soundcore Space Q20 Hybrid Active Noise Cancelling Headphones',
    ARRAY['headphones', 'noise cancelling', 'audio', 'anker', 'soundcore', 'focus', 'music'],
    'https://amazon.com/dp/B07NM3RSRQ?tag=weegan04-20',
    'Top Budget ANC Pick',
    'Custom hybrid active noise cancellation cuts ambient background chatter by up to 90% with 40-hour battery life.',
    '$59.99',
    'View Deal on Amazon'
  ),
  (
    'Ergonomic Memory Foam Seat Cushion & Lumbar Support',
    ARRAY['chair', 'seat cushion', 'ergonomic', 'back pain', 'desk setup', 'home office'],
    'https://amazon.com/dp/B01EBDV9BU?tag=weegan04-20',
    'Essential Desk Comfort',
    'Orthopedic memory foam cushion designed to relieve tailbone pressure and prevent lower back pain during long hours.',
    '$34.99',
    'Shop on Amazon'
  ),
  (
    'Anker 7-in-1 USB-C Hub Adapter (4K HDMI, 100W Power Delivery)',
    ARRAY['usb-c', 'hub', 'adapter', 'dongle', 'ports', 'hdmi', 'laptop accessory', 'gadget'],
    'https://amazon.com/dp/B07ZVKTP53?tag=weegan04-20',
    'Best Tech Gadget Under $30',
    'Instant 4K HDMI, 100W Power Delivery pass-through charging, dual USB-A ports, and SD card readers.',
    '$29.99',
    'Check Amazon Discount'
  ),
  (
    'Nulaxy Adjustable Aluminum Laptop Stand for Desk',
    ARRAY['laptop stand', 'stand', 'desk accessory', 'ergonomics', 'cooling', 'amazon find'],
    'https://amazon.com/dp/B089K62799?tag=weegan04-20',
    'Bestselling Desk Accessory',
    'Raises your laptop screen to eye level to prevent neck strain and forward head posture while maximizing airflow.',
    '$19.99',
    'View on Amazon'
  )
on conflict do nothing;

-- 4. Initial Ad Slots
insert into public.ad_slots (position_key, ad_type, title, subtitle, banner_image_url, banner_link_url, is_active)
values
  ('header', 'mock_preview', 'Supercharge Your AI Workflows with Cloudflare Workers', 'Deploy edge AI models in 60 seconds with zero server cost.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80', 'https://cloudflare.com', true),
  ('sidebar', 'mock_preview', 'Build Faster with Supabase Free Tier', 'The open source Firebase alternative with Postgres database, Auth, and Storage.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80', 'https://supabase.com', true),
  ('in-article', 'mock_preview', 'Run Local LLMs Fast & Private', 'Discover the top recommended budget hardware rigs tested by our engineers.', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80', '/forum', true),
  ('forum-sidebar', 'mock_preview', 'Join 10,000+ AI Builders in Our Weekly Digest', 'Get curated open-source workflows and hardware deals delivered every Sunday.', '', '/#newsletter', true)
on conflict (position_key) do nothing;

-- 5. Site Settings
insert into public.site_settings (key, value, description)
values
  ('site_info', '{"name": "SmartFlow AI", "niche": "AI Productivity & Budget Autonomous Tech Stack", "tagline": "Autonomous workflows, budget tech, and free-tier engineering for creators & solopreneurs.", "url": "https://smartflowai.com"}'::jsonb, 'General site branding and configuration'),
  ('admin_config', '{"admin_email": "keegan@example.com", "ai_bot_name": "SmartFlow Bot", "ai_bot_avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=smartflow-bot"}'::jsonb, 'Admin and AI Bot configuration'),
  ('monetization_settings', '{"enable_ads": true, "enable_affiliate_injection": true, "adsense_publisher_id": "ca-pub-0000000000000000", "ftc_disclosure_text": "SmartFlow AI is reader-supported. When you purchase through links on our site, we may earn an affiliate commission at no extra cost to you."}'::jsonb, 'AdSense and affiliate disclosure configuration')
on conflict (key) do nothing;
