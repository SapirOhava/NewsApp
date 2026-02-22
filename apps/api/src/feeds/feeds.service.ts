import { Injectable, NotFoundException } from "@nestjs/common";
import type { CreateFeedInput, UpdateFeedInput } from "@newsapp/shared";
import { PrismaService } from "../prisma/prisma.service";
import type { Prisma } from "@prisma/client";

@Injectable()
export class FeedsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(params?: { sourceId?: string; categoryId?: string; isActive?: boolean }) {
    const where: Prisma.FeedWhereInput = {};
  
    if (params?.sourceId) where.sourceId = params.sourceId;
    if (params?.categoryId) where.categoryId = params.categoryId;
    if (typeof params?.isActive === "boolean") where.isActive = params.isActive;
  
    return this.prisma.feed.findMany({ where, orderBy: { createdAt: "desc" } });
  }

  async getById(id: string) {
    const row = await this.prisma.feed.findUnique({ where: { id } });
    if (!row) throw new NotFoundException("Feed not found");
    return row;
  }

  async getBySlug(slug: string) {
    const row = await this.prisma.feed.findUnique({ where: { slug } });
    if (!row) throw new NotFoundException("Feed not found");
    return row;
  }

  async create(input: CreateFeedInput) {
    return this.prisma.feed.create({
      data: {
        sourceId: input.sourceId,
        categoryId: input.categoryId,
        rssFeedUrl: input.rssFeedUrl,
        name: input.name,
        slug: input.slug,
        isActive: input.isActive ?? undefined, // DB default true
      },
    });
  }

  async update(id: string, input: UpdateFeedInput) {
    return this.prisma.feed.update({
      where: { id },
      data: {
        name: input.name,
        slug: input.slug,
        isActive: input.isActive,
      },
    });
  }
}
