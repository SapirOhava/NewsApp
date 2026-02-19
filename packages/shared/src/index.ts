/**
 * Main entry point for @newsapp/shared package
 * Re-export all types from here so consumers can import from '@newsapp/shared'
 */

// Source types
export type {
  Source,
  CreateSourceInput,
} from './types/source';

// Feed types
export type {
  Feed,
  FeedWithRelations,
  CreateFeedInput,
} from './types/feed';

// Article types
export type {
  Article,
  ArticleWithFeed,
  ArticleWithRelations,
  CreateArticleInput,
} from './types/article';

// Category types
export type {
  Category,
  CreateCategoryInput,
} from './types/category';

// Note: Newsflashes are just Articles with isNewsflash=true
// Use Article types directly - no separate Newsflash types needed!