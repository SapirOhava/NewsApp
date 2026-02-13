/**
 * Main entry point for @newsapp/shared package
 * Re-export all types from here so consumers can import from '@newsapp/shared'
 */

// Source types
export type {
    Source,
    CreateSourceInput,
  } from './types/source';
  
  // Article types
  export type {
    Article,
    ArticleWithSource,
    ArticleWithCategory,
    ArticleWithRelations,
    CreateArticleInput,
  } from './types/article';
  
  // Category types
  export type {
    Category,
    CreateCategoryInput,
  } from './types/category';
  
