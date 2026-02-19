import type { Article, ArticleWithRelations, Category, Source } from '@newsapp/shared';
import type { Prisma } from '@prisma/client';

// Helper to convert Date to ISO string
const toISOString = (date: Date | null | undefined): string | null => {
  return date ? date.toISOString() : null;
};

// Map Prisma Source → Shared Source type (no rssFeedUrl anymore)
export function mapSource(
  source: Prisma.SourceGetPayload<{}> | null
): Source | null {
  if (!source) return null;

  return {
    id: source.id,
    name: source.name,
    slug: source.slug,
    websiteUrl: source.websiteUrl,
    logoUrl: source.logoUrl,
    isActive: source.isActive,
    createdAt: source.createdAt.toISOString(),
    updatedAt: source.updatedAt.toISOString(),
  };
}

// Map Prisma Category → Shared Category type
export function mapCategory(
  category: Prisma.CategoryGetPayload<{}> | null
): Category | null {
  if (!category) return null;

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    order: category.order,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

// Map Prisma Article (with feed including source and category) → Shared ArticleWithRelations type
export function mapArticleWithRelations(
  article: Prisma.ArticleGetPayload<{ 
    include: { 
      feed: { 
        include: { 
          source: true; 
          category: true;
        } 
      } 
    } 
  }>
): ArticleWithRelations {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    content: article.content,
    excerpt: article.excerpt,
    originalUrl: article.originalUrl,
    rssPublishedAt: article.rssPublishedAt.toISOString(),
    fetchedAt: article.fetchedAt.toISOString(),
    isNewsflash: article.isNewsflash,
    publishedAt: toISOString(article.publishedAt),
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    feedId: article.feedId,
    feed: {
      id: article.feed.id,
      sourceId: article.feed.sourceId,
      categoryId: article.feed.categoryId,
      rssFeedUrl: article.feed.rssFeedUrl,
      name: article.feed.name,
      slug: article.feed.slug,
      source: mapSource(article.feed.source)!,
      category: mapCategory(article.feed.category),
    },
  };
}

// Map Prisma Article (without relations) → Shared Article type
export function mapArticle(
  article: Prisma.ArticleGetPayload<{}>
): Article {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    content: article.content,
    excerpt: article.excerpt,
    originalUrl: article.originalUrl,
    rssPublishedAt: article.rssPublishedAt.toISOString(),
    fetchedAt: article.fetchedAt.toISOString(),
    isNewsflash: article.isNewsflash,
    publishedAt: toISOString(article.publishedAt),
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    feedId: article.feedId,
    feed: null,
  };
}