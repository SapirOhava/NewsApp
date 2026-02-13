import type { Article, ArticleWithRelations, Category, Source } from '@newsapp/shared';
import type { Prisma } from '@prisma/client';

// Helper to convert Date to ISO string
const toISOString = (date: Date | null | undefined): string | null => {
  return date ? date.toISOString() : null;
};

// Map Prisma Source → Shared Source type
export function mapSource(
  source: Prisma.SourceGetPayload<{}> | null
): Source | null {
  if (!source) return null;

  return {
    id: source.id,
    name: source.name,
    slug: source.slug,
    websiteUrl: source.websiteUrl,
    rssFeedUrl: source.rssFeedUrl,
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
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

// Map Prisma Article (with source and category) → Shared ArticleWithRelations type
export function mapArticleWithRelations(
  article: Prisma.ArticleGetPayload<{ include: { source: true; category: true } }>
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
    sourceId: article.sourceId,
    source: mapSource(article.source)!,
    categoryId: article.categoryId,
    category: mapCategory(article.category),
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
    sourceId: article.sourceId,
    source: null,
    categoryId: article.categoryId,
    category: null,
  };
}