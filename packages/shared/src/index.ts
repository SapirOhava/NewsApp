/**
 * Main entry point for @newsapp/shared package
 * Re-export all schemas and types from here
 */

export {
  CategorySchema,
  CreateCategorySchema,
  UpdateCategorySchema,
  type Category,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from './types/category';

export {
  SourceSchema,
  CreateSourceSchema,
  UpdateSourceSchema,
  type Source,
  type CreateSourceInput,
  type UpdateSourceInput,
} from './types/source';

export {
  FeedSchema,
  CreateFeedSchema,
  UpdateFeedSchema,
  type Feed,
  type CreateFeedInput,
  type UpdateFeedInput,
} from './types/feed';

export {
  ArticleListItemSchema,
  ArticleSchema,
  UpdateArticleSchema,
  type ArticleListItem,
  type Article,
  type UpdateArticleInput,
} from './types/article';