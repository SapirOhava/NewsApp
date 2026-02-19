/**
 * Source type - represents a news website publisher (BBC, Reuters, etc.)
 * Dates are strings (ISO format) because they come from JSON API
 * Note: RSS feed URLs are now in the Feed model, not here
 */
export type Source = {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * Input type for creating a source (API request body)
 */
export type CreateSourceInput = {
  name: string;
  slug: string;
  websiteUrl: string;
  logoUrl?: string | null;
  isActive?: boolean;
};