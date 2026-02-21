import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UsePipes,
  } from "@nestjs/common";
  import {
    CreateSourceSchema,
    SourceSchema,
    UpdateSourceSchema,
    type CreateSourceInput,
    type Source,
    type UpdateSourceInput,
  } from "@newsapp/shared";
  import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
  import { mapSource } from "./source.mapper";
  import { SourcesService } from "./sources.service";
  
  @Controller("sources")
  export class SourcesController {
    constructor(private readonly sourcesService: SourcesService) {}
  
    /**
     * GET /sources
     */
    @Get()
    async list(): Promise<Source[]> {
      const rows = await this.sourcesService.list();
      // map each row + validate output contract
      return rows.map(mapSource);
    }
  
    /**
     * GET /sources/:id
     */
    @Get(":id")
    async getById(@Param("id") id: string): Promise<Source> {
      const row = await this.sourcesService.getById(id);
      return mapSource(row);
    }
  
    /**
     * POST /sources
     * Validates request body with shared CreateSourceSchema
     */
    @Post()
    @UsePipes(new ZodValidationPipe(CreateSourceSchema))
    async create(@Body() body: CreateSourceInput): Promise<Source> {
      const created = await this.sourcesService.create(body);
      return mapSource(created);
    }
  
    /**
     * PATCH /sources/:id
     */
    @Patch(":id")
    @UsePipes(new ZodValidationPipe(UpdateSourceSchema))
    async update(
      @Param("id") id: string,
      @Body() body: UpdateSourceInput,
    ): Promise<Source> {
      const updated = await this.sourcesService.update(id, body);
      return mapSource(updated);
    }
  }
  