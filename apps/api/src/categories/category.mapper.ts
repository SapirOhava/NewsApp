import type { Category } from '@newsapp/shared';
import type { Prisma } from '@prisma/client';

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