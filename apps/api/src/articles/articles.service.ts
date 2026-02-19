import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ArticleWithRelations } from '@newsapp/shared';
import { mapArticleWithRelations } from './article.mapper';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all newsflashes (articles where isNewsflash = true)
   * Ordered by most recent first
   */
  async findNewsflashes(): Promise<ArticleWithRelations[]> {
    const articles = await this.prisma.article.findMany({
      where: {
        isNewsflash: true,
      },
      include: {
        feed: {
          include: {
            source: true,
            category: true,
          },
        },
      },
      orderBy: {
        rssPublishedAt: 'desc', // Most recent first
      },
    });

    return articles.map(mapArticleWithRelations);
  }

  /**
   * Get all articles with optional limit
   * @param limit - Maximum number of articles to return (default: no limit)
   */
  async findAll(limit?: number): Promise<ArticleWithRelations[]> {
    const articles = await this.prisma.article.findMany({
      include: {
        feed: {
          include: {
            source: true,
            category: true,
          },
        },
      },
      orderBy: {
        rssPublishedAt: 'desc', // Most recent first
      },
      ...(limit && { take: limit }), // Apply limit if provided
    });

    return articles.map(mapArticleWithRelations);
  }

  /**
   * Get one article by slug
   * @param slug - Article slug
   * @throws NotFoundException if article not found
   */
  async findOne(slug: string): Promise<ArticleWithRelations> {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        feed: {
          include: {
            source: true,
            category: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException(`Article with slug "${slug}" not found`);
    }

    return mapArticleWithRelations(article);
  }
}