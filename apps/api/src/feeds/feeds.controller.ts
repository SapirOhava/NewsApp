import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UsePipes,
  } from "@nestjs/common";
  import {
    CreateFeedSchema,
    UpdateFeedSchema,
    type CreateFeedInput,
    type Feed,
    type UpdateFeedInput,
  } from "@newsapp/shared";
  import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
  import { mapFeed } from "./feed.mapper";
  import { FeedsService } from "./feeds.service";
  
  @Controller("feeds")
  export class FeedsController {
    constructor(private readonly feedsService: FeedsService) {}
  
    /**
     * GET /feeds
     * Optional filters:
     *   /feeds?sourceId=...&categoryId=...&isActive=true
     */
    @Get()
    async list(
      @Query("sourceId") sourceId?: string,
      @Query("categoryId") categoryId?: string,
      @Query("isActive") isActive?: string,
    ): Promise<Feed[]> {
      const rows = await this.feedsService.list({
        sourceId,
        categoryId,
        isActive: isActive === undefined ? undefined : isActive === "true",
      });
  
      return rows.map(mapFeed);
    }
  
    /**
     * GET /feeds/:id
     */
    @Get(":id")
    async getById(@Param("id") id: string): Promise<Feed> {
      const row = await this.feedsService.getById(id);
      return mapFeed(row);
    }
  
    /**
     * Optional: GET /feeds/by-slug/:slug
     */
    @Get("by-slug/:slug")
    async getBySlug(@Param("slug") slug: string): Promise<Feed> {
      const row = await this.feedsService.getBySlug(slug);
      return mapFeed(row);
    }
  
    /**
     * POST /feeds
     */
    @Post()
    @UsePipes(new ZodValidationPipe(CreateFeedSchema))
    async create(@Body() body: CreateFeedInput): Promise<Feed> {
      const row = await this.feedsService.create(body);
      return mapFeed(row);
    }
  
    /**
     * PATCH /feeds/:id
     */
    @Patch(":id")
    @UsePipes(new ZodValidationPipe(UpdateFeedSchema))
    async update(
      @Param("id") id: string,
      @Body() body: UpdateFeedInput,
    ): Promise<Feed> {
      const row = await this.feedsService.update(id, body);
      return mapFeed(row);
    }
  }
  