import { isSupabaseConfigured, createAdminClient } from './server';
import { memoryStore } from '../data/mock-store';
import { Post, ForumThread, ForumReply, TopicQueueItem, AffiliateLink, AdSlot, CronLog, ForumCategory } from '@/types/database';

export const db = {
  // ==================== BLOG POSTS ====================
  async getPosts(): Promise<Post[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (!error && data && data.length > 0) return data as Post[];
      } catch (err) {
        console.warn('Supabase query error, falling back to local store:', err);
      }
    }
    return memoryStore.getPosts();
  },

  async getPostBySlug(slug: string): Promise<Post | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (!error && data) {
          // Increment views asynchronously
          try {
            await supabase.rpc('increment_post_views', { target_post_id: data.id });
          } catch {}
          return data as Post;
        }
      } catch (err) {
        console.warn('Supabase getPostBySlug error, falling back to local store:', err);
      }
    }
    const post = memoryStore.getPostBySlug(slug);
    if (post) memoryStore.incrementPostViews(post.id);
    return post || null;
  },

  async createPost(postData: Omit<Post, 'id' | 'views' | 'created_at' | 'updated_at'>): Promise<Post> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from('posts')
          .insert({
            ...postData,
            views: 0,
            status: postData.status || 'published',
            published_at: postData.published_at || new Date().toISOString(),
          })
          .select()
          .single();

        if (!error && data) return data as Post;
        if (error) console.error('Supabase createPost error:', error);
      } catch (err) {
        console.error('Supabase createPost exception:', err);
      }
    }

    const newPost: Post = {
      ...postData,
      id: `post-${Date.now()}`,
      views: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: postData.published_at || new Date().toISOString(),
    };
    return memoryStore.addPost(newPost);
  },

  // ==================== FORUM CATEGORIES ====================
  async getCategories(): Promise<ForumCategory[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from('forum_categories')
          .select('*')
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) return data as ForumCategory[];
      } catch (err) {
        console.warn('Supabase categories error:', err);
      }
    }
    return memoryStore.categories;
  },

  // ==================== FORUM THREADS ====================
  async getThreads(categoryId?: string, search?: string): Promise<ForumThread[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        let query = supabase
          .from('forum_threads')
          .select('*, author:profiles(*), category:forum_categories(*), linked_post:posts(*)');

        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }
        if (search) {
          query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
        }

        query = query.order('is_pinned', { ascending: false }).order('created_at', { ascending: false });

        const { data, error } = await query;
        if (!error && data && data.length > 0) return data as ForumThread[];
      } catch (err) {
        console.warn('Supabase getThreads error:', err);
      }
    }
    return memoryStore.getThreads(categoryId, search);
  },

  async getThreadBySlug(slug: string): Promise<ForumThread | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from('forum_threads')
          .select('*, author:profiles(*), category:forum_categories(*), linked_post:posts(*)')
          .or(`slug.eq.${slug},id.eq.${slug}`)
          .single();

        if (!error && data) return data as ForumThread;
      } catch (err) {
        console.warn('Supabase getThreadBySlug error:', err);
      }
    }
    return memoryStore.getThreadBySlug(slug);
  },

  async createThread(threadData: {
    category_id: string;
    author_id?: string;
    title: string;
    slug: string;
    content: string;
    tags?: string[];
    linked_post_id?: string;
    is_seeded_by_ai?: boolean;
  }): Promise<ForumThread> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from('forum_threads')
          .insert({
            ...threadData,
            tags: threadData.tags || [],
            upvotes: 1,
            downvotes: 0,
            views: 1,
            reply_count: 0,
            is_pinned: false,
            is_locked: false,
          })
          .select('*, author:profiles(*), category:forum_categories(*)')
          .single();

        if (!error && data) return data as ForumThread;
        if (error) console.error('Supabase createThread error:', error);
      } catch (err) {
        console.error('Supabase createThread exception:', err);
      }
    }

    const newThread: ForumThread = {
      id: `thread-${Date.now()}`,
      category_id: threadData.category_id,
      category: memoryStore.categories.find(c => c.id === threadData.category_id),
      author_id: threadData.author_id || 'usr-bot',
      author: memoryStore.profiles.find(p => p.id === (threadData.author_id || 'usr-bot')),
      title: threadData.title,
      slug: threadData.slug,
      content: threadData.content,
      tags: threadData.tags || [],
      linked_post_id: threadData.linked_post_id,
      is_seeded_by_ai: Boolean(threadData.is_seeded_by_ai),
      upvotes: 1,
      downvotes: 0,
      views: 1,
      reply_count: 0,
      is_pinned: false,
      is_locked: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return memoryStore.addThread(newThread);
  },

  // ==================== FORUM REPLIES ====================
  async getReplies(threadId: string): Promise<ForumReply[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from('forum_replies')
          .select('*, author:profiles(*)')
          .eq('thread_id', threadId)
          .order('created_at', { ascending: true });

        if (!error && data) return data as ForumReply[];
      } catch (err) {
        console.warn('Supabase getReplies error:', err);
      }
    }
    return memoryStore.getReplies(threadId);
  },

  async createReply(replyData: {
    thread_id: string;
    author_id?: string;
    parent_reply_id?: string;
    content: string;
    is_ai_bot?: boolean;
  }): Promise<ForumReply> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from('forum_replies')
          .insert({
            ...replyData,
            upvotes: 1,
            downvotes: 0,
            is_ai_bot: Boolean(replyData.is_ai_bot),
          })
          .select('*, author:profiles(*)')
          .single();

        if (!error && data) return data as ForumReply;
        if (error) console.error('Supabase createReply error:', error);
      } catch (err) {
        console.error('Supabase createReply exception:', err);
      }
    }

    const newReply: ForumReply = {
      id: `rep-${Date.now()}`,
      thread_id: replyData.thread_id,
      author_id: replyData.author_id || (replyData.is_ai_bot ? 'usr-bot' : 'usr-alex'),
      author: memoryStore.profiles.find(p => p.id === (replyData.author_id || (replyData.is_ai_bot ? 'usr-bot' : 'usr-alex'))),
      parent_reply_id: replyData.parent_reply_id,
      content: replyData.content,
      is_ai_bot: Boolean(replyData.is_ai_bot),
      upvotes: 1,
      downvotes: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return memoryStore.addReply(newReply);
  },

  // ==================== TOPIC QUEUE ====================
  async getTopicQueue(): Promise<TopicQueueItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from('topic_queue')
          .select('*')
          .order('priority', { ascending: false })
          .order('created_at', { ascending: true });

        if (!error && data) return data as TopicQueueItem[];
      } catch (err) {
        console.warn('Supabase getTopicQueue error:', err);
      }
    }
    return memoryStore.getTopicQueue();
  },

  async addTopicQueueBulk(topics: string[], category = 'AI Productivity', priority = 3): Promise<number> {
    const cleanTopics = topics.map(t => t.trim()).filter(Boolean);
    if (cleanTopics.length === 0) return 0;

    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const rows = cleanTopics.map(t => ({
          keyword_or_topic: t,
          niche_category: category,
          priority,
          status: 'pending',
        }));

        const { data, error } = await supabase.from('topic_queue').insert(rows).select();
        if (!error && data) return data.length;
      } catch (err) {
        console.warn('Supabase addTopicQueueBulk error:', err);
      }
    }

    cleanTopics.forEach(t => memoryStore.addTopicQueueItem(t, category, priority));
    return cleanTopics.length;
  },

  async getNextPendingTopic(): Promise<TopicQueueItem | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from('topic_queue')
          .select('*')
          .eq('status', 'pending')
          .order('priority', { ascending: false })
          .order('created_at', { ascending: true })
          .limit(1)
          .single();

        if (!error && data) return data as TopicQueueItem;
      } catch (err) {
        console.warn('Supabase getNextPendingTopic error:', err);
      }
    }
    return memoryStore.getNextPendingTopic() || null;
  },

  async markTopicCompleted(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        await supabase
          .from('topic_queue')
          .update({ status: 'completed', processed_at: new Date().toISOString() })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase markTopicCompleted error:', err);
      }
    }
    memoryStore.markTopicCompleted(id);
  },

  // ==================== AFFILIATE LINKS ====================
  async getAffiliateLinks(onlyActive = true): Promise<AffiliateLink[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        let query = supabase.from('affiliate_links').select('*');
        if (onlyActive) query = query.eq('is_active', true);

        const { data, error } = await query.order('created_at', { ascending: false });
        if (!error && data) return data as AffiliateLink[];
      } catch (err) {
        console.warn('Supabase getAffiliateLinks error:', err);
      }
    }
    return onlyActive ? memoryStore.getAffiliateLinks() : memoryStore.getAllAffiliateLinks();
  },

  async createAffiliateLink(linkData: Omit<AffiliateLink, 'id' | 'clicks' | 'created_at' | 'updated_at'>): Promise<AffiliateLink> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from('affiliate_links')
          .insert({
            ...linkData,
            clicks: 0,
            is_active: linkData.is_active ?? true,
          })
          .select()
          .single();

        if (!error && data) return data as AffiliateLink;
      } catch (err) {
        console.warn('Supabase createAffiliateLink error:', err);
      }
    }
    return memoryStore.addAffiliateLink(linkData);
  },

  async incrementAffiliateClick(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        await supabase.rpc('increment_affiliate_clicks', { target_link_id: id });
        return;
      } catch (err) {
        console.warn('Supabase incrementAffiliateClick error:', err);
      }
    }
    memoryStore.incrementAffiliateClick(id);
  },

  // ==================== AD SLOTS ====================
  async getAdSlot(positionKey: string): Promise<AdSlot | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from('ad_slots')
          .select('*')
          .eq('position_key', positionKey)
          .eq('is_active', true)
          .single();

        if (!error && data) return data as AdSlot;
      } catch (err) {
        console.warn('Supabase getAdSlot error:', err);
      }
    }
    return memoryStore.getAdSlot(positionKey) || null;
  },

  async getAllAdSlots(): Promise<AdSlot[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase.from('ad_slots').select('*');
        if (!error && data) return data as AdSlot[];
      } catch (err) {
        console.warn('Supabase getAllAdSlots error:', err);
      }
    }
    return memoryStore.getAllAdSlots();
  },

  async updateAdSlot(positionKey: string, updates: Partial<AdSlot>): Promise<AdSlot | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from('ad_slots')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('position_key', positionKey)
          .select()
          .single();

        if (!error && data) return data as AdSlot;
      } catch (err) {
        console.warn('Supabase updateAdSlot error:', err);
      }
    }
    return memoryStore.updateAdSlot(positionKey, updates);
  },

  // ==================== CRON LOGS ====================
  async logCronExecution(
    job_type: CronLog['job_type'],
    status: CronLog['status'],
    details: Record<string, any>,
    execution_time_ms: number
  ): Promise<CronLog> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from('cron_logs')
          .insert({
            job_type,
            status,
            details,
            execution_time_ms,
          })
          .select()
          .single();

        if (!error && data) return data as CronLog;
      } catch (err) {
        console.warn('Supabase logCronExecution error:', err);
      }
    }
    return memoryStore.addCronLog({ job_type, status, details, execution_time_ms });
  },

  async getCronLogs(): Promise<CronLog[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createAdminClient();
        const { data, error } = await supabase
          .from('cron_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(25);

        if (!error && data) return data as CronLog[];
      } catch (err) {
        console.warn('Supabase getCronLogs error:', err);
      }
    }
    return memoryStore.getCronLogs();
  },
};
