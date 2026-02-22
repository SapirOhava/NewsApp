import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Query,
    UsePipes,
  } from "@nestjs/common";
  import {
    UpdateArticleSchema,
    type Article,
    type ArticleListItem,
    type UpdateArticleInput,
  } from "@newsapp/shared";
  import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
  import { mapArticle, mapArticleListItem } from "./article.mapper";
  import { ArticlesService } from "./articles.service";
  
  @Controller("articles")
  export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {}
  
    /**
     * GET /articles
     * Optional filters:
     *  - feedId
     *  - isNewsflash=true/false
     *  - take, skip (pagination)
     *
     * Returns list items (NO content).
     */
    @Get()
    async list(
      @Query("feedId") feedId?: string,
      @Query("isNewsflash") isNewsflash?: string,
      @Query("take") take?: string,
      @Query("skip") skip?: string,
    ): Promise<ArticleListItem[]> {
      const rows = await this.articlesService.list({
        feedId,
        isNewsflash: isNewsflash === undefined ? undefined : isNewsflash === "true",
        take: take ? Number(take) : undefined,
        skip: skip ? Number(skip) : undefined,
      });
  
      return rows.map(mapArticleListItem);
    }
  
    /**
     * GET /articles/:id
     * Returns FULL article (includes content).
     */
    @Get(":id")
    async getById(@Param("id") id: string): Promise<Article> {
      const row = await this.articlesService.getById(id);
      return mapArticle(row);
    }
  
    /**
     * Optional: GET /articles/by-slug/:slug
     * Returns FULL article.
     */
    @Get("by-slug/:slug")
    async getBySlug(@Param("slug") slug: string): Promise<Article> {
      const row = await this.articlesService.getBySlug(slug);
      return mapArticle(row);
    }
  
    /**
     * PATCH /articles/:id
     * Admin/internal usage.
     */
    @Patch(":id")
    @UsePipes(new ZodValidationPipe(UpdateArticleSchema))
    async update(
      @Param("id") id: string,
      @Body() body: UpdateArticleInput,
    ): Promise<Article> {
      const row = await this.articlesService.update(id, body);
      return mapArticle(row);
    }
  }
  