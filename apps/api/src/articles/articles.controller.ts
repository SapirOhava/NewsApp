import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import type { ArticleWithRelations } from '@newsapp/shared';

@Controller()
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  /**
   * GET /newsflash
   * Get all newsflashes (articles where isNewsflash = true)
   */
  @Get('newsflash')
  async getNewsflashes(): Promise<ArticleWithRelations[]> {
    return this.articlesService.findNewsflashes();
  }

  /**
   * GET /articles?limit=20
   * Get all articles with optional limit query parameter
   * @param limit - Optional limit (number of articles to return)
   */
  @Get('articles')
  async findAll(
    @Query('limit') limit?: string,
  ): Promise<ArticleWithRelations[]> {
    // Parse limit from query string (e.g., "20" → 20)
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    // Validate limit is a positive number if provided
    if (limitNumber !== undefined && (isNaN(limitNumber) || limitNumber < 1)) {
      throw new Error('Limit must be a positive number');
    }

    return this.articlesService.findAll(limitNumber);
  }

  /**
   * GET /articles/:slug
   * Get one article by slug
   * @param slug - Article slug
   */
  @Get('articles/:slug')
  async findOne(@Param('slug') slug: string): Promise<ArticleWithRelations> {
    return this.articlesService.findOne(slug);
  }
}