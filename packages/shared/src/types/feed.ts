import { z } from "zod";

/**
 * Reusable building blocks 
 * Keeping them inside the file for now.
 * Later you can move these into a shared "fields.ts".
 */

const IsoDateTimeSchema = z.string().datetime();

const IdSchema = z.string().min(1);

const SlugSchema = z
  .string()
  .min(2, "Slug must be at least 2 characters")
  .max(100, "Slug must not exceed 100 characters")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and use hyphens");

const UrlSchema = z.string().url();

/**
 * ============================================
 * Feed (API Response)
 * ============================================
 *
 * Feed in DB is an RSS endpoint that belongs to:
 * - one Source (publisher)
 * - one Category (topic)
 *
 * In Prisma:
 *   sourceId   String
 *   categoryId String
 *
 * In the API contract we return those IDs + metadata for the feed itself.
 */
export const FeedSchema = z.object({
  id: IdSchema,

  sourceId: IdSchema,
  categoryId: IdSchema,

  rssFeedUrl: UrlSchema,

  name: z.string().min(1).max(200),

  slug: SlugSchema,

  isActive: z.boolean(),

  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
});

export type Feed = z.infer<typeof FeedSchema>;

/**
 * ============================================
 * Create Feed Input (POST /feeds)
 * ============================================
 *
 * Client must supply sourceId + categoryId because Feed belongs to both.
 * rssFeedUrl must be unique in DB → we validate it’s a URL here.
 *
 * We make isActive optional because DB defaults to true.
 */
export const CreateFeedSchema = z.object({
  sourceId: IdSchema,
  categoryId: IdSchema,

  rssFeedUrl: UrlSchema,

  name: z.string().min(1).max(200),

  slug: SlugSchema,

  isActive: z.boolean().optional(),
});

export type CreateFeedInput = z.infer<typeof CreateFeedSchema>;

/**
 * ============================================
 * Update Feed Input (PATCH /feeds/:id)
 * ============================================
 *
 * Most APIs:
 * - allow changing rssFeedUrl, name, slug, isActive
 * - DO NOT allow changing sourceId/categoryId (that would "move" the feed)
 *
 * So we intentionally do not include sourceId/categoryId here.
 *
 * We also require at least one field.
 */
export const UpdateFeedSchema = z
  .object({
    name: z.string().min(1).max(200).optional(),
    slug: SlugSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateFeedInput = z.infer<typeof UpdateFeedSchema>;
