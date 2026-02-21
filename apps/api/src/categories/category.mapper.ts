import { CategorySchema, type Category } from "@newsapp/shared";
import type { Category as PrismaCategory } from "@prisma/client";

export function mapCategory(row: PrismaCategory): Category {
  return CategorySchema.parse({
    id: row.id,
    name: row.name,
    slug: row.slug,
    order: row.order,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}
