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
  categoryId?: string | null;
  category?: Category | null;
};

// Type for Category
export type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

// Type for Article with Category (for category pages)
export type ArticleWithCategory = Article & {
  category: Category;
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

// Fetch all categories
export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
}

// Fetch articles by category slug
export async function getArticlesByCategory(categorySlug: string): Promise<Article[]> {
  const response = await fetch(`${API_URL}/categories/${categorySlug}/articles`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch articles by category');
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