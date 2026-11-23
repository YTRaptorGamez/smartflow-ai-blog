export type UserRole = 'user' | 'admin' | 'ai_bot';

export interface Profile {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url: string;
  bio?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  meta_description: string;
  content: string;
  raw_summary?: string;
  tags: string[];
  suggested_product_keywords: string[];
  featured_image?: string;
  read_time_minutes: number;
  status: 'draft' | 'published' | 'archived';
  views: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface TopicQueueItem {
  id: string;
  keyword_or_topic: string;
  niche_category: string;
  priority: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  created_at: string;
  processed_at?: string;
}

export interface AffiliateLink {
  id: string;
  product_name: string;
  keywords: string[];
  affiliate_url: string;
  badge_text: string;
  description?: string;
  price_estimate?: string;
  cta_text: string;
  disclosure: string;
  is_active: boolean;
  clicks: number;
  created_at: string;
  updated_at: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  display_order: number;
  created_at: string;
  thread_count?: number;
}

export interface ForumThread {
  id: string;
  category_id: string;
  author_id?: string;
  author?: Profile;
  category?: ForumCategory;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  linked_post_id?: string;
  linked_post?: Post;
  is_seeded_by_ai: boolean;
  upvotes: number;
  downvotes: number;
  views: number;
  reply_count: number;
  is_pinned: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface ForumReply {
  id: string;
  thread_id: string;
  author_id?: string;
  author?: Profile;
  parent_reply_id?: string;
  content: string;
  is_ai_bot: boolean;
  upvotes: number;
  downvotes: number;
  created_at: string;
  updated_at: string;
  children?: ForumReply[];
}

export interface ForumVote {
  id: string;
  user_id: string;
  target_type: 'thread' | 'reply';
  target_id: string;
  vote_value: 1 | -1;
  created_at: string;
}

export interface AdSlot {
  id: string;
  position_key: 'header' | 'sidebar' | 'in-article' | 'forum-sidebar' | 'footer';
  ad_type: 'mock_preview' | 'custom_banner' | 'adsense_script';
  title?: string;
  subtitle?: string;
  banner_image_url?: string;
  banner_link_url?: string;
  script_code?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CronLog {
  id: string;
  job_type: 'generate-post' | 'seed-forum' | 'bot-reply' | 'manual-trigger';
  status: 'success' | 'failed' | 'skipped';
  details: Record<string, any>;
  execution_time_ms: number;
  created_at: string;
}

export interface SiteSettings {
  site_info: {
    name: string;
    niche: string;
    tagline: string;
    url: string;
  };
  admin_config: {
    admin_email: string;
    ai_bot_name: string;
    ai_bot_avatar: string;
  };
  monetization_settings: {
    enable_ads: boolean;
    enable_affiliate_injection: boolean;
    adsense_publisher_id: string;
    ftc_disclosure_text: string;
  };
}
