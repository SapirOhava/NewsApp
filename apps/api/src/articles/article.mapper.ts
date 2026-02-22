import {
    ArticleListItemSchema,
    ArticleSchema,
    type Article,
    type ArticleListItem,
  } from "@newsapp/shared";
  import type { Article as PrismaArticle } from "@prisma/client";
  
  /**
   * Map Prisma Article row -> ArticleListItem (no content)
   */
  export function mapArticleListItem(row: PrismaArticle): ArticleListItem {
    return ArticleListItemSchema.parse({
      id: row.id,
      title: row.title,
      slug: row.slug,
  
      excerpt: row.excerpt, // string | null
  
      originalUrl: row.originalUrl,
  
      rssPublishedAt: row.rssPublishedAt.toISOString(),
      fetchedAt: row.fetchedAt.toISOString(),
  
      isNewsflash: row.isNewsflash,
      publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
  
      feedId: row.feedId,
  
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    });
  }
  
  /**
   * Map Prisma Article row -> Article (includes content)
   */
  export function mapArticle(row: PrismaArticle): Article {
    return ArticleSchema.parse({
      ...mapArticleListItem(row),
      content: row.content,
    });
  }
  