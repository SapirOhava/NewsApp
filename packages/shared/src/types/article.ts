import { z } from "zod";

/**
 * Reusable building blocks 
 */
const IsoDateTimeSchema = z.string().datetime();
const IdSchema = z.string().min(1);
const UrlSchema = z.string().url();
const SlugSchema = z
  .string()
  .min(2, "Slug must be at least 2 characters")
  .max(200, "Slug must not exceed 200 characters")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and use hyphens");

/**
 * ============================================
 * Article List Item (API Response)
 * ============================================
 *
 * This is what you should return from endpoints like:
 * - GET /articles
 * - GET /feeds/:feedId/articles
 * - GET /newsflash
 *
 * Why no `content`?
 * Because lists can return 20-100 items and content is large.
 */
export const ArticleListItemSchema = z.object({
  id: IdSchema,
  title: z.string().min(1),
  slug: SlugSchema,
  excerpt: z.string().nullable(), // excerpt String? in Prisma → string | null
  originalUrl: UrlSchema,
  rssPublishedAt: IsoDateTimeSchema,
  fetchedAt: IsoDateTimeSchema,
  isNewsflash: z.boolean(),
  // When your app "publishes" it (optional in DB)
  publishedAt: IsoDateTimeSchema.nullable(),
  feedId: IdSchema,
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
});

export type ArticleListItem = z.infer<typeof ArticleListItemSchema>;

/**
 * ============================================
 * Article Full (API Response)
 * ============================================
 *
 * Used for:
 * - GET /articles/:slug
 *
 * Same as list item, but includes `content`.
 */
export const ArticleSchema = ArticleListItemSchema.extend({
  content: z.string(), // required in Prisma
});

export type Article = z.infer<typeof ArticleSchema>;

/**
 * ============================================
 * Update Article (PATCH) - optional/admin usage
 * ============================================
 *
 * In many apps, Articles are ingested automatically (not created by users),
 * so "create" schema may not be needed publicly.
 *
 * But you often want to allow updating app-specific fields:
 * - isNewsflash
 * - publishedAt
 * - maybe excerpt/content (if you post-process)
 */
export const UpdateArticleSchema = z
  .object({
    title: z.string().min(1).optional(),
    slug: SlugSchema.optional(),
    content: z.string().optional(),
    excerpt: z.string().nullable().optional(),
    isNewsflash: z.boolean().optional(),
    publishedAt: IsoDateTimeSchema.nullable().optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateArticleInput = z.infer<typeof UpdateArticleSchema>;
