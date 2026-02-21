import { Injectable, NotFoundException } from "@nestjs/common";
import type { CreateSourceInput, UpdateSourceInput } from "@newsapp/shared";
import { PrismaService } from "../prisma/prisma.service";
import { mapSource } from "./source.mapper";

@Injectable()
export class SourcesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.source.findMany({
      orderBy: [{ name: "asc" }],
    });
  }

  async getById(id: string) {
    const row = await this.prisma.source.findUnique({ where: { id } });
    if (!row) throw new NotFoundException("Source not found");
    return row;
  }

  async getBySlug(slug: string) {
    const row = await this.prisma.source.findUnique({ where: { slug } });
    if (!row) throw new NotFoundException("Source not found");
    return row;
  }

  async create(input: CreateSourceInput) {
    return this.prisma.source.create({
      data: {
        name: input.name,
        slug: input.slug,
        websiteUrl: input.websiteUrl,
        // if omitted => undefined => Prisma won't set it => DB stores NULL
        logoUrl: input.logoUrl ?? undefined,
        isActive: input.isActive ?? undefined, // DB default true
      },
    });
  }

  async update(id: string, input: UpdateSourceInput) {
    // We typically keep update simple; Prisma will throw if id doesn't exist,
    // but we can also catch and map to NotFound.
    return this.prisma.source.update({
      where: { id },
      data: {
        name: input.name,
        slug: input.slug,
        websiteUrl: input.websiteUrl,
        logoUrl: input.logoUrl,
        isActive: input.isActive,
      },
    });
  }
}
