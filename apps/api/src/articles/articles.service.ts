import { Injectable, NotFoundException } from "@nestjs/common";
import type { UpdateArticleInput } from "@newsapp/shared";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * List articles with optional filters.
   * This returns Prisma rows; controller maps to API shape.
   */
  async list(params?: {
    feedId?: string;
    isNewsflash?: boolean;
    take?: number;
    skip?: number;
  }) {
    const where: Prisma.ArticleWhereInput = {};

    if (params?.feedId) where.feedId = params.feedId;
    if (typeof params?.isNewsflash === "boolean") where.isNewsflash = params.isNewsflash;

    return this.prisma.article.findMany({
      where,
      orderBy: [{ rssPublishedAt: "desc" }],
      take: params?.take,
      skip: params?.skip,
    });
  }

  async getById(id: string) {
    const row = await this.prisma.article.findUnique({ where: { id } });
    if (!row) throw new NotFoundException("Article not found");
    return row;
  }

  async getBySlug(slug: string) {
    const row = await this.prisma.article.findUnique({ where: { slug } });
    if (!row) throw new NotFoundException("Article not found");
    return row;
  }

  /**
   * PATCH /articles/:id
   * Optional admin use: set isNewsflash / publishedAt / edit title/content/etc.
   */
  async update(id: string, input: UpdateArticleInput) {
    return this.prisma.article.update({
      where: { id },
      data: {
        title: input.title,
        slug: input.slug,
        content: input.content,
        excerpt: input.excerpt,
        originalUrl: input.originalUrl,
        rssPublishedAt: input.rssPublishedAt ? new Date(input.rssPublishedAt) : undefined,
        isNewsflash: input.isNewsflash,
        publishedAt: input.publishedAt === undefined
          ? undefined
          : input.publishedAt === null
            ? null
            : new Date(input.publishedAt),
      },
    });
  }
}
