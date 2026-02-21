import { z } from 'zod';

/**
 * Category schema - Single source of truth
 * This schema defines:
 * - Runtime validation (Zod)
 * - TypeScript types (z.infer)
 * - API contract (what API accepts/returns)
 */

/**
 * Reusable field schemas (prevents copy/paste drift)
 */
export const SlugSchema = z
  .string()
  .min(2, "Slug must be at least 2 characters")
  .max(50, "Slug must not exceed 50 characters")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and use hyphens");

// Optional: Prisma uses cuid() in your schema.
// Zod doesn't have built-in "cuid" validator, but you can still do a light check.
// If you want strict, you can use a regex or switch to UUIDs.
// Keeping it simple:
export const IdSchema = z.string().min(1);

// Date in JSON
export const IsoDateTimeSchema = z.string().datetime();

/**
 * API Response schema (what API returns)
 */
export const CategorySchema = z.object({
  id: IdSchema,
  name: z.string().min(1),
  slug: SlugSchema,
  order: z.number().int().min(0),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
});

export type Category = z.infer<typeof CategorySchema>;

/**
 * Create request body schema (what API accepts on POST)
 */
export const CreateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  slug: SlugSchema,
  order: z.number().int().min(0).optional(), // let DB default to 0
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;

/**
 * Update request body schema (PATCH) - at least one field required
 */
export const UpdateCategorySchema = z
  .object({
    name: z.string().min(2).max(50).optional(),
    slug: SlugSchema.optional(),
    order: z.number().int().min(0).optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;