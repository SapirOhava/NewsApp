import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import type { Category, ArticleWithRelations } from '@newsapp/shared';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * GET /categories
   * Get all categories
   */
  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  /**
   * GET /categories/:slug
   * Get one category by slug
   * @param slug - Category slug
   */
  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<Category> {
    return this.categoriesService.findOne(slug);
  }

  /**
   * GET /categories/:slug/articles
   * Get articles by category slug (5 most recent)
   * @param slug - Category slug
   */
  @Get(':slug/articles')
  async findArticlesByCategory(@Param('slug') slug: string): Promise<ArticleWithRelations[]> {
    return this.categoriesService.findArticlesByCategory(slug);
  }

  /**
   * POST /categories
   * Create a new category
   * @param dto - Category data
   */
  @Post()
  async create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(dto);
  }
}