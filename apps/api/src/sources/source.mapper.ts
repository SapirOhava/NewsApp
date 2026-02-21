import { SourceSchema, type Source } from "@newsapp/shared";
import type { Source as PrismaSource } from "@prisma/client";

/**
 * Convert Prisma Source row (Dates) -> API Source (ISO strings)
 * Also validates output matches the shared contract.
 */
export function mapSource(row: PrismaSource): Source {
  const mapped = {
    id: row.id,
    name: row.name,
    slug: row.slug,
    websiteUrl: row.websiteUrl,
    logoUrl: row.logoUrl,          // Prisma: string | null
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };

  // Optional but recommended: guarantees server output matches contract
  return SourceSchema.parse(mapped);
}
