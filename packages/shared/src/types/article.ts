import type { Category } from './category';
import type { Source } from './source';

/**
 * Article type - represents a news article from RSS feed
 * Dates are strings (ISO format) because they come from JSON API
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
  sourceId: string;
  source?: Source | null;
  categoryId?: string | null;
  category?: Category | null;
};

/**
 * Article with source - used when source is included in the response
 * The source field is guaranteed to be present (not null)
 */
export type ArticleWithSource = Article & {
  source: Source;
};

/**
 * Article with category - used when category is included in the response
 * The category field is guaranteed to be present (not null)
 */
export type ArticleWithCategory = Article & {
  category: Category;
};

/**
 * Article with both source and category
 */
export type ArticleWithRelations = Article & {
  source: Source;
  category: Category | null;
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
  sourceId: string;
  categoryId?: string | null;
  publishedAt?: string | null;
  isNewsflash?: boolean;
};