import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getArticles } from '@/lib/api';
import { NewsflashBanner } from '@/components/NewsflashBanner';
import { getNewsflashes } from '@/lib/api';

export default async function HomePage() {
  // Fetch articles from your API
  const articles = await getArticles();
  // later ... const newsflashes = await getNewsflashes(); 
  // Sample newsflashes for testing (replace with API call later)
  const newsflashes = [
    {
      id: '1',
      message: 'Breaking: Major news update today!',
      linkUrl: '/articles/breaking-news',
      priority: 10,
      status: 'PUBLISHED',
    },
    {
      id: '2',
      message: 'New features coming soon - stay tuned!',
      linkUrl: null,
      priority: 5,
      status: 'PUBLISHED',
    },
    {
      id: '3',
      message: 'Special announcement: Check out our latest articles',
      linkUrl: '/articles',
      priority: 8,
      status: 'PUBLISHED',
    },
  ];

  return (
    <>
    {/* Newsflash banner - only on home page */}
    <NewsflashBanner newsflashes={newsflashes} />
   
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Latest News</h1>

      {articles.length === 0 ? (
        <p className="text-gray-500">No articles found.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                  <CardDescription>
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString()
                      : 'Draft'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {article.content.substring(0, 150)}...
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
    </>
  );
}