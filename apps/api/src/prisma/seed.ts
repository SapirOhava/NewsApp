import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.article.upsert({
    where: { slug: "hello-news" },
    update: {},
    create: {
      title: "Hello News",
      slug: "hello-news",
      content: "This is the first seeded article.",
      source: "seed",
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
