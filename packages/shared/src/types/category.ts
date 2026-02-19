/**
 * Category type - represents a news category
 * Dates are strings (ISO format) because they come from JSON API
 */
export type Category = {
  id: string;
  name: string;
  slug: string;
  order: number; // Added: order field for display ordering
  createdAt: string;
  updatedAt: string;
};

/**
 * Input type for creating a category (API request body)
 */
export type CreateCategoryInput = {
  name: string;
  slug: string;
  order?: number; // Optional, defaults to 0
};