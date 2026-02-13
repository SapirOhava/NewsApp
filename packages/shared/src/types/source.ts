/**
 * Source type - represents an RSS feed source (news website)
 * Dates are strings (ISO format) because they come from JSON API
 */
export type Source = {
    id: string;
    name: string;
    slug: string;
    websiteUrl: string;
    rssFeedUrl: string;
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
    rssFeedUrl: string;
    logoUrl?: string | null;
    isActive?: boolean;
  };