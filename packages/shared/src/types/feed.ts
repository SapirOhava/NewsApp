import type { Source } from './source';
import type { Category } from './category';

/**
 * Feed type - represents an RSS feed endpoint for a specific Source+Category combination
 * Dates are strings (ISO format) because they come from JSON API
 */
export type Feed = {
  id: string;
  sourceId: string;
  categoryId: string;
  rssFeedUrl: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Optional relations - only included when explicitly queried
  source?: Source | null;
  category?: Category | null;
};

/**
 * Feed with relations - feed that includes source and category
 */
export type FeedWithRelations = Feed & {
  source: Source;
  category: Category | null;
};

/**
 * Input type for creating a feed (API request body)
 */
export type CreateFeedInput = {
  sourceId: string;
  categoryId: string;
  rssFeedUrl: string;
  name: string;
  slug: string;
  isActive?: boolean;
};