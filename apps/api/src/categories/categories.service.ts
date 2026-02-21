import { Injectable, NotFoundException } from "@nestjs/common";
import type { CreateCategoryInput, UpdateCategoryInput } from "@newsapp/shared";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.category.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });
  }

  async getById(id: string) {
    const row = await this.prisma.category.findUnique({ where: { id } });
    if (!row) throw new NotFoundException("Category not found");
    return row;
  }

  async getBySlug(slug: string) {
    const row = await this.prisma.category.findUnique({ where: { slug } });
    if (!row) throw new NotFoundException("Category not found");
    return row;
  }

  async create(input: CreateCategoryInput) {
    return this.prisma.category.create({
      data: {
        name: input.name,
        slug: input.slug,
        order: input.order,
      },
    });
  }

  async update(id: string, input: UpdateCategoryInput) {
    return this.prisma.category.update({
      where: { id },
      data: {
        name: input.name,
        slug: input.slug,
        order: input.order,
      },
    });
  }
}
