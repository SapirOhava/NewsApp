// API base URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Type for Article (matches your API response)
export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

// Fetch all articles
export async function getArticles(): Promise<Article[]> {
  const response = await fetch(`${API_URL}/articles`, {
    cache: 'no-store', // Always fetch fresh data
  });

  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }

  return response.json();
}

// Fetch single article by slug
export async function getArticle(slug: string): Promise<Article> {
  const response = await fetch(`${API_URL}/articles/${slug}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch article');
  }

  return response.json();
}

export type Newsflash = {
  id: string;
  message: string;
  linkUrl: string | null;
  priority: number;
  status: string;
};

// Fetch newsflashes
export async function getNewsflashes(): Promise<Newsflash[]> {
  const response = await fetch(`${API_URL}/newsflashes`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch newsflashes');
  }

  return response.json();
}