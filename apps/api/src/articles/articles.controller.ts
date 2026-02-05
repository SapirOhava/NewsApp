import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';

// @Controller('articles') = base route for all endpoints in this controller
// This means all routes will start with /articles
@Controller('articles')
export class ArticlesController {
  // Constructor injection: NestJS provides ArticlesService automatically
  constructor(private readonly articlesService: ArticlesService) {}

  // GET /articles
  // @Get() = handles GET requests
  @Get()
  findAll() {
    return this.articlesService.findAll();
  }

  // GET /articles/:slug
  // @Param('slug') = extracts the slug from the URL
  // Example: GET /articles/my-first-article → slug = "my-first-article"
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.articlesService.findOne(slug);
  }

  // POST /articles
  // @Body() = extracts JSON data from request body
  // @Body() dto = automatically validates against CreateArticleDto
  @Post()
  create(@Body() dto: CreateArticleDto) {
    return this.articlesService.create(dto);
  }
}