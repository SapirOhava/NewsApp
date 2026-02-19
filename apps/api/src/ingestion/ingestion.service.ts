import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Parser from 'rss-parser';

const parser = new Parser();

interface RSSItem {
  link?: string;
  title?: string;
  content?: string;
  contentSnippet?: string;
  description?: string;
  pubDate?: string;
  categories?: string[];
}

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetch and ingest articles from a single feed
   * @param feedId - Feed ID to fetch from
   */
  async ingestFromFeed(feedId: string): Promise<number> {
    // Get feed with its RSS feed URL, source, and category
    const feed = await this.prisma.feed.findUnique({
      where: { id: feedId },
      include: {
        source: true,
        category: true,
      },
    });

    if (!feed) {
      throw new Error(`Feed with ID ${feedId} not found`);
    }

    if (!feed.isActive) {
      this.logger.warn(`Feed ${feed.name} is inactive, skipping...`);
      return 0;
    }

    if (!feed.source.isActive) {
      this.logger.warn(`Source ${feed.source.name} is inactive, skipping feed ${feed.name}...`);
      return 0;
    }

    try {
      this.logger.log(`Fetching RSS feed from ${feed.source.name} - ${feed.name}...`);
      
      // Fetch and parse RSS feed
      const parsedFeed = await parser.parseURL(feed.rssFeedUrl);
      
      let createdCount = 0;
      let skippedCount = 0;

      // Process each RSS item
      for (const item of parsedFeed.items || []) {
        try {
          const created = await this.createArticleFromRSSItem(item, feed.id);
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
        `✅ ${feed.source.name} - ${feed.name}: Created ${createdCount} articles, skipped ${skippedCount} duplicates`
      );

      return createdCount;
    } catch (error) {
      this.logger.error(`Error fetching RSS from ${feed.source.name} - ${feed.name}:`, error);
      throw error;
    }
  }

  /**
   * Ingest articles from all active feeds
   */
  async ingestFromAllFeeds(): Promise<{ feed: string; source: string; count: number }[]> {
    const feeds = await this.prisma.feed.findMany({
      where: { 
        isActive: true,
        source: {
          isActive: true,
        },
      },
      include: {
        source: true,
      },
    });

    const results: { feed: string; source: string; count: number }[] = [];

    for (const feed of feeds) {
      try {
        const count = await this.ingestFromFeed(feed.id);
        results.push({ 
          feed: feed.name, 
          source: feed.source.name,
          count 
        });
      } catch (error) {
        this.logger.error(`Failed to ingest from ${feed.source.name} - ${feed.name}:`, error);
        results.push({ 
          feed: feed.name, 
          source: feed.source.name,
          count: 0 
        });
      }
    }

    return results;
  }

  /**
   * Ingest articles from all feeds for a specific source
   * @param sourceId - Source ID
   */
  async ingestFromSource(sourceId: string): Promise<number> {
    const feeds = await this.prisma.feed.findMany({
      where: {
        sourceId,
        isActive: true,
        source: {
          isActive: true,
        },
      },
    });

    let totalCount = 0;
    for (const feed of feeds) {
      try {
        const count = await this.ingestFromFeed(feed.id);
        totalCount += count;
      } catch (error) {
        this.logger.error(`Failed to ingest from feed ${feed.name}:`, error);
      }
    }

    return totalCount;
  }

  /**
   * Create article from RSS item
   * @param item - RSS feed item
   * @param feedId - Feed ID (feed already has source and category)
   * @returns true if created, false if duplicate
   */
  private async createArticleFromRSSItem(
    item: RSSItem,
    feedId: string
  ): Promise<boolean> {
    // Validate required fields
    if (!item.link || !item.title) {
      this.logger.warn(`Skipping item: missing required fields (link or title)`, item);
      return false;
    }

    const originalUrl = item.link;
    const title = item.title;

    // Content can come from multiple fields (RSS feeds vary)
    const content = item.content || item.contentSnippet || item.description || '';
    
    // If no content at all, skip this item
    if (!content || content.trim().length === 0) {
      this.logger.warn(`Skipping item: no content available`, { title, link: originalUrl });
      return false;
    }

    // Excerpt: prefer contentSnippet (usually shorter), fallback to description
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

    // Create article - category is already determined by the feed
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
        feedId, // Feed already has sourceId and categoryId
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
}