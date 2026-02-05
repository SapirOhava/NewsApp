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

  // Prisma 7 (adapter mode) requires passing options to PrismaClient
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
  // Upsert = "insert if doesn't exist, otherwise update"
  // We use slug because it's unique (@unique in schema)
  await prisma.article.upsert({
    where: { slug: 'hello-news' },
    update: {
      // If it already exists, you can update content/title if you want:
      title: 'Hello News',
      content: 'This is the first seeded article (updated if it already existed).',
      publishedAt: new Date(),
    },
    create: {
      title: 'Hello News',
      slug: 'hello-news',
      content: 'This is the first seeded article.',
      publishedAt: new Date(),
    },
  });

  const count = await prisma.article.count();
  console.log(`Seed complete. Article count: ${count}`);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
