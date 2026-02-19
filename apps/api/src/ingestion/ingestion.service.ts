import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Parser from 'rss-parser';

const parser = new Parser();

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetch and ingest articles from a single source
   * @param sourceId - Source ID to fetch from
   */
  async ingestFromSource(sourceId: string): Promise<number> {
    // Get source with its RSS feed URL
    const source = await this.prisma.source.findUnique({
      where: { id: sourceId },
    });

    if (!source) {
      throw new Error(`Source with ID ${sourceId} not found`);
    }

    if (!source.isActive) {
      this.logger.warn(`Source ${source.name} is inactive, skipping...`);
      return 0;
    }

    try {
      this.logger.log(`Fetching RSS feed from ${source.name}...`);
      
      // Fetch and parse RSS feed
      const feed = await parser.parseURL(source.rssFeedUrl);
      
      let createdCount = 0;
      let skippedCount = 0;

      // Process each RSS item
      for (const item of feed.items || []) {
        try {
          const created = await this.createArticleFromRSSItem(item, source.id);
          if (created) {
            createdCount++;
          } else {
            skippedCount++; // Duplicate
          }
        } catch (error) {
          this.logger.error(`Error processing article "${item.title}":`, error);
          // Continue with next item
        }
      }

      this.logger.log(
        `✅ ${source.name}: Created ${createdCount} articles, skipped ${skippedCount} duplicates`
      );

      return createdCount;
    } catch (error) {
      this.logger.error(`Error fetching RSS from ${source.name}:`, error);
      throw error;
    }
  }

  /**
   * Ingest articles from all active sources
   */
  async ingestFromAllSources(): Promise<{ source: string; count: number }[]> {
    const sources = await this.prisma.source.findMany({
      where: { isActive: true },
    });

    const results: { source: string; count: number }[] = []; 

    for (const source of sources) {
      try {
        const count = await this.ingestFromSource(source.id);
        results.push({ source: source.name, count });
      } catch (error) {
        this.logger.error(`Failed to ingest from ${source.name}:`, error);
        results.push({ source: source.name, count: 0 });
      }
    }

    return results;
  }

  /**
   * Create article from RSS item
   * @param item - RSS feed item
   * @param sourceId - Source ID
   * @returns true if created, false if duplicate
   */
  private async createArticleFromRSSItem(
    item: any,
    sourceId: string
  ): Promise<boolean> {
    // Validate required fields
    if (!item.link || !item.title || !item.contentSnippet) {
      this.logger.warn(`Skipping item: missing required fields`, item);
      return false;
    }

    const originalUrl = item.link;
    const title = item.title;
    const content = item.content || item.contentSnippet || item.description || '';
    const excerpt = item.contentSnippet || item.description || null;

    // Parse RSS published date
    const rssPublishedAt = item.pubDate 
      ? new Date(item.pubDate)
      : new Date();

    // Generate slug from title
    const slug = this.generateSlug(title);

    // Check if article already exists (by originalUrl - prevents duplicates)
    const existing = await this.prisma.article.findUnique({
      where: { originalUrl },
    });

    if (existing) {
      return false; // Duplicate, skip
    }

    // Determine if it's a newsflash (published in last 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const isNewsflash = rssPublishedAt >= tenMinutesAgo;

    // Try to match category (optional - you can implement category matching logic)
    const categoryId = await this.matchCategory(item, sourceId);

    // Create article
    await this.prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt ? excerpt.substring(0, 500) : null, // Limit excerpt length
        originalUrl,
        rssPublishedAt,
        fetchedAt: new Date(),
        isNewsflash,
        sourceId,
        categoryId,
      },
    });

    return true; // Created successfully
  }

  /**
   * Generate URL-friendly slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .substring(0, 100); // Limit length
  }

  /**
   * Try to match RSS item to a category
   * This is optional - you can implement based on RSS categories, keywords, etc.
   */
  private async matchCategory(item: any, sourceId: string): Promise<string | null> {
    // Option 1: Use RSS categories if available
    if (item.categories && item.categories.length > 0) {
      const rssCategory = item.categories[0].toLowerCase();
      
      // Find matching category in database
      const category = await this.prisma.category.findFirst({
        where: {
          slug: { contains: rssCategory },
        },
      });

      if (category) {
        // Check if this source has this category
        const sourceCategory = await this.prisma.sourceCategory.findUnique({
          where: {
            sourceId_categoryId: {
              sourceId,
              categoryId: category.id,
            },
          },
        });

        if (sourceCategory) {
          return category.id;
        }
      }
    }

    // Option 2: Return null and assign category later manually
    return null;
  }
}