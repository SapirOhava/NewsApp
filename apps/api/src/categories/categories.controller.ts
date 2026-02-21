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
  CategorySchema,
  CreateCategorySchema,
  UpdateCategorySchema,
  type Category,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from "@newsapp/shared";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { mapCategory } from "./category.mapper";
import { CategoriesService } from "./categories.service";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * GET /categories
   */
  @Get()
  async list(): Promise<Category[]> {
    const rows = await this.categoriesService.list();
    return rows.map(mapCategory);
  }

  /**
   * GET /categories/:id
   */
  @Get(":id")
  async getById(@Param("id") id: string): Promise<Category> {
    const row = await this.categoriesService.getById(id);
    return mapCategory(row);
  }

  /**
   * (Optional) GET /categories/by-slug/:slug
   * This avoids conflict between :id and :slug formats.
   */
  @Get("by-slug/:slug")
  async getBySlug(@Param("slug") slug: string): Promise<Category> {
    const row = await this.categoriesService.getBySlug(slug);
    return mapCategory(row);
  }

  /**
   * POST /categories
   */
  @Post()
  @UsePipes(new ZodValidationPipe(CreateCategorySchema))
  async create(@Body() body: CreateCategoryInput): Promise<Category> {
    const row = await this.categoriesService.create(body);
    return mapCategory(row);
  }

  /**
   * PATCH /categories/:id
   */
  @Patch(":id")
  @UsePipes(new ZodValidationPipe(UpdateCategorySchema))
  async update(
    @Param("id") id: string,
    @Body() body: UpdateCategoryInput,
  ): Promise<Category> {
    const row = await this.categoriesService.update(id, body);
    return mapCategory(row);
  }
}
