import type { Category } from './category';
import type { Source } from './source';

/**
 * Article type - represents a news article from RSS feed
 * Dates are strings (ISO format) because they come from JSON API
 * Base type - no relations included
 */
export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  originalUrl: string;
  rssPublishedAt: string;
  fetchedAt: string;
  isNewsflash: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  feedId: string; // Article belongs to a Feed
};

/**
 * Article with feed - used when feed is included but source/category might not be
 * This is less common but useful for flexibility
 */
export type ArticleWithFeed = Article & {
  feed: {
    id: string;
    sourceId: string;
    categoryId: string;
    rssFeedUrl: string;
    name: string;
    slug: string;
    // Feed without nested source/category
  };
};

/**
 * Article with full relations (feed + source + category)
 * This is the main type used in API responses
 */
export type ArticleWithRelations = Article & {
  feed: {
    id: string;
    sourceId: string;
    categoryId: string;
    rssFeedUrl: string;
    name: string;
    slug: string;
    source: Source; // Source is always included
    category: Category | null; // Category might be null
  };
};

/**
 * Input type for creating an article (API request body)
 */
export type CreateArticleInput = {
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  originalUrl: string;
  rssPublishedAt: string;
  feedId: string;
  publishedAt?: string | null;
  isNewsflash?: boolean;
};