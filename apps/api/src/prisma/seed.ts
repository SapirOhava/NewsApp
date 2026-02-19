import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is missing in .env');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ============================================
  // SEED CATEGORIES (with order numbers)
  // ============================================
  const categories = [
    { name: 'World', slug: 'world', order: 1 },
    { name: 'Technology', slug: 'technology', order: 2 },
    { name: 'Business', slug: 'business', order: 3 },
    { name: 'Science', slug: 'science', order: 4 },
    { name: 'Health', slug: 'health', order: 5 },
    { name: 'Sports', slug: 'sports', order: 6 },
    { name: 'Entertainment', slug: 'entertainment', order: 7 },
    { name: 'Startups', slug: 'startups', order: 8 },
    { name: 'AI', slug: 'ai', order: 9 },
  ];

  console.log('📁 Creating categories...');
  const createdCategories: Record<string, string> = {};
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { order: category.order },
      create: category,
    });
    createdCategories[category.slug] = created.id;
  }
  console.log(`✅ Created ${categories.length} categories`);

  // ============================================
  // SEED SOURCES WITH FEEDS (category-specific RSS URLs)
  // ============================================
  const sourcesData = [
    {
      name: 'BBC News',
      slug: 'bbc-news',
      websiteUrl: 'https://www.bbc.com',
      logoUrl: 'https://www.bbc.com/favicon.ico',
      isActive: true,
      feeds: [
        { categorySlug: 'world', rssFeedUrl: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC World News', slug: 'bbc-world' },
        { categorySlug: 'technology', rssFeedUrl: 'https://feeds.bbci.co.uk/news/technology/rss.xml', name: 'BBC Technology', slug: 'bbc-technology' },
        { categorySlug: 'business', rssFeedUrl: 'https://feeds.bbci.co.uk/news/business/rss.xml', name: 'BBC Business', slug: 'bbc-business' },
        { categorySlug: 'science', rssFeedUrl: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', name: 'BBC Science', slug: 'bbc-science' },
        { categorySlug: 'health', rssFeedUrl: 'https://feeds.bbci.co.uk/news/health/rss.xml', name: 'BBC Health', slug: 'bbc-health' },
        { categorySlug: 'sports', rssFeedUrl: 'https://feeds.bbci.co.uk/sport/rss.xml', name: 'BBC Sports', slug: 'bbc-sports' },
        { categorySlug: 'entertainment', rssFeedUrl: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', name: 'BBC Entertainment', slug: 'bbc-entertainment' },
      ],
    },
    {
      name: 'Reuters',
      slug: 'reuters',
      websiteUrl: 'https://www.reuters.com',
      logoUrl: 'https://www.reuters.com/favicon.ico',
      isActive: true,
      feeds: [
        { categorySlug: 'world', rssFeedUrl: 'https://www.reuters.com/world/rss', name: 'Reuters World', slug: 'reuters-world' },
        { categorySlug: 'business', rssFeedUrl: 'https://www.reuters.com/business/rss', name: 'Reuters Business', slug: 'reuters-business' },
        { categorySlug: 'technology', rssFeedUrl: 'https://www.reuters.com/technology/rss', name: 'Reuters Technology', slug: 'reuters-technology' },
      ],
    },
    {
      name: 'The Guardian',
      slug: 'the-guardian',
      websiteUrl: 'https://www.theguardian.com',
      logoUrl: 'https://www.theguardian.com/favicon.ico',
      isActive: true,
      feeds: [
        { categorySlug: 'world', rssFeedUrl: 'https://www.theguardian.com/world/rss', name: 'Guardian World', slug: 'guardian-world' },
        { categorySlug: 'technology', rssFeedUrl: 'https://www.theguardian.com/technology/rss', name: 'Guardian Technology', slug: 'guardian-technology' },
        { categorySlug: 'business', rssFeedUrl: 'https://www.theguardian.com/business/rss', name: 'Guardian Business', slug: 'guardian-business' },
        { categorySlug: 'science', rssFeedUrl: 'https://www.theguardian.com/science/rss', name: 'Guardian Science', slug: 'guardian-science' },
        { categorySlug: 'sports', rssFeedUrl: 'https://www.theguardian.com/sport/rss', name: 'Guardian Sports', slug: 'guardian-sports' },
      ],
    },
    {
      name: 'TechCrunch',
      slug: 'techcrunch',
      websiteUrl: 'https://techcrunch.com',
      logoUrl: 'https://techcrunch.com/favicon.ico',
      isActive: true,
      feeds: [
        { categorySlug: 'technology', rssFeedUrl: 'https://techcrunch.com/feed/', name: 'TechCrunch', slug: 'techcrunch-main' },
        { categorySlug: 'startups', rssFeedUrl: 'https://techcrunch.com/tag/startups/feed/', name: 'TechCrunch Startups', slug: 'techcrunch-startups' },
        { categorySlug: 'ai', rssFeedUrl: 'https://techcrunch.com/tag/artificial-intelligence/feed/', name: 'TechCrunch AI', slug: 'techcrunch-ai' },
      ],
    },
    {
      name: 'The Verge',
      slug: 'the-verge',
      websiteUrl: 'https://www.theverge.com',
      logoUrl: 'https://www.theverge.com/favicon.ico',
      isActive: true,
      feeds: [
        { categorySlug: 'technology', rssFeedUrl: 'https://www.theverge.com/rss/index.xml', name: 'The Verge', slug: 'the-verge-main' },
        { categorySlug: 'science', rssFeedUrl: 'https://www.theverge.com/science/rss/index.xml', name: 'The Verge Science', slug: 'the-verge-science' },
      ],
    },
    {
      name: 'Ars Technica',
      slug: 'ars-technica',
      websiteUrl: 'https://arstechnica.com',
      logoUrl: 'https://arstechnica.com/favicon.ico',
      isActive: true,
      feeds: [
        { categorySlug: 'technology', rssFeedUrl: 'https://feeds.arstechnica.com/arstechnica/index', name: 'Ars Technica', slug: 'ars-technica-main' },
        { categorySlug: 'science', rssFeedUrl: 'https://feeds.arstechnica.com/arstechnica/science', name: 'Ars Technica Science', slug: 'ars-technica-science' },
      ],
    },
  ];

  console.log('📰 Creating sources with feeds...');
  for (const sourceData of sourcesData) {
    const { feeds, ...sourceFields } = sourceData;
    
    // Create or update source (no RSS URL here - it's in Feed model now)
    const source = await prisma.source.upsert({
      where: { slug: sourceFields.slug },
      update: {},
      create: sourceFields,
    });

    // Create feeds for this source
    let feedCount = 0;
    for (const feedData of feeds) {
      const categoryId = createdCategories[feedData.categorySlug];
      
      if (!categoryId) {
        console.warn(`   ⚠️  Skipping feed "${feedData.name}": category "${feedData.categorySlug}" not found`);
        continue;
      }

      try {
        await prisma.feed.upsert({
          where: { slug: feedData.slug },
          update: {
            rssFeedUrl: feedData.rssFeedUrl,
            name: feedData.name,
            isActive: true,
          },
          create: {
            sourceId: source.id,
            categoryId: categoryId,
            rssFeedUrl: feedData.rssFeedUrl,
            name: feedData.name,
            slug: feedData.slug,
            isActive: true,
          },
        });
        feedCount++;
      } catch (error) {
        console.error(`   ❌ Failed to create feed "${feedData.name}":`, error);
      }
    }

    console.log(`   ✓ ${source.name} - Created ${feedCount} feeds`);
  }
  console.log(`✅ Created ${sourcesData.length} sources with feeds`);

  // ============================================
  // SUMMARY
  // ============================================
  const categoryCount = await prisma.category.count();
  const sourceCount = await prisma.source.count();
  const feedCount = await prisma.feed.count();
  const articleCount = await prisma.article.count();

  console.log('\n📊 Database Summary:');
  console.log(`   Categories: ${categoryCount}`);
  console.log(`   Sources: ${sourceCount}`);
  console.log(`   Feeds: ${feedCount}`);
  console.log(`   Articles: ${articleCount}`);
  console.log('\n✅ Seed complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });