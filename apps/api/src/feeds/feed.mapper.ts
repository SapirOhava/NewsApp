import { FeedSchema, type Feed } from "@newsapp/shared";
import type { Feed as PrismaFeed } from "@prisma/client";

export function mapFeed(row: PrismaFeed): Feed {
  return FeedSchema.parse({
    id: row.id,
    sourceId: row.sourceId,
    categoryId: row.categoryId,
    rssFeedUrl: row.rssFeedUrl,
    name: row.name,
    slug: row.slug,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}
