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
    createdCategories[category.slug] = created.id; // Store ID by slug for lookup
  }
  console.log(`✅ Created ${categories.length} categories`);

  // ============================================
  // SEED SOURCES (with verified RSS feeds)
  // ============================================
  const sourcesData = [
    {
      name: 'BBC News',
      slug: 'bbc-news',
      websiteUrl: 'https://www.bbc.com',
      rssFeedUrl: 'https://feeds.bbci.co.uk/news/rss.xml',
      logoUrl: 'https://www.bbc.com/favicon.ico',
      isActive: true,
      categorySlugs: ['world', 'technology', 'business', 'science', 'health', 'sports', 'entertainment'],
    },
    {
      name: 'Reuters',
      slug: 'reuters',
      websiteUrl: 'https://www.reuters.com',
      rssFeedUrl: 'https://www.reuters.com/world/rss',
      logoUrl: 'https://www.reuters.com/favicon.ico',
      isActive: true,
      categorySlugs: ['world', 'business', 'technology'],
    },
    {
      name: 'The Guardian',
      slug: 'the-guardian',
      websiteUrl: 'https://www.theguardian.com',
      rssFeedUrl: 'https://www.theguardian.com/world/rss',
      logoUrl: 'https://www.theguardian.com/favicon.ico',
      isActive: true,
      categorySlugs: ['world', 'technology', 'business', 'science', 'sports'],
    },
    {
      name: 'TechCrunch',
      slug: 'techcrunch',
      websiteUrl: 'https://techcrunch.com',
      rssFeedUrl: 'https://techcrunch.com/feed/',
      logoUrl: 'https://techcrunch.com/favicon.ico',
      isActive: true,
      categorySlugs: ['technology', 'startups', 'ai'],
    },
    {
      name: 'The Verge',
      slug: 'the-verge',
      websiteUrl: 'https://www.theverge.com',
      rssFeedUrl: 'https://www.theverge.com/rss/index.xml',
      logoUrl: 'https://www.theverge.com/favicon.ico',
      isActive: true,
      categorySlugs: ['technology', 'science'],
    },
    {
      name: 'Ars Technica',
      slug: 'ars-technica',
      websiteUrl: 'https://arstechnica.com',
      rssFeedUrl: 'https://feeds.arstechnica.com/arstechnica/index',
      logoUrl: 'https://arstechnica.com/favicon.ico',
      isActive: true,
      categorySlugs: ['technology', 'science'],
    },
  ];

  console.log('📰 Creating sources with category relationships...');
  for (const sourceData of sourcesData) {
    const { categorySlugs, ...sourceFields } = sourceData;
    
    // Create or update source
    const source = await prisma.source.upsert({
      where: { slug: sourceFields.slug },
      update: {},
      create: sourceFields,
    });

    // Get category IDs from slugs
    const categoryIds = categorySlugs
      .map(slug => createdCategories[slug])
      .filter(Boolean); // Remove undefined values

    // Create source-category relationships
    for (const categoryId of categoryIds) {
      await prisma.sourceCategory.upsert({
        where: {
          sourceId_categoryId: {
            sourceId: source.id,
            categoryId: categoryId,
          },
        },
        update: {}, // No update needed if exists
        create: {
          sourceId: source.id,
          categoryId: categoryId,
        },
      });
    }

    console.log(`   ✓ ${source.name} - Linked to ${categoryIds.length} categories`);
  }
  console.log(`✅ Created ${sourcesData.length} sources with category relationships`);

  // ============================================
  // SUMMARY
  // ============================================
  const categoryCount = await prisma.category.count();
  const sourceCount = await prisma.source.count();
  const sourceCategoryCount = await prisma.sourceCategory.count();
  const articleCount = await prisma.article.count();

  console.log('\n📊 Database Summary:');
  console.log(`   Categories: ${categoryCount}`);
  console.log(`   Sources: ${sourceCount}`);
  console.log(`   Source-Category Links: ${sourceCategoryCount}`);
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