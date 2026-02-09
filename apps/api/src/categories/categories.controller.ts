import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // GET /categories
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  // GET /categories/:slug
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.categoriesService.findOne(slug);
  }

  // GET /categories/:slug/articles
  @Get(':slug/articles')
  findArticlesByCategory(@Param('slug') slug: string) {
    return this.categoriesService.findArticlesByCategory(slug);
  }

  // POST /categories
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }
}