import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import type { Category, ArticleWithRelations } from '@newsapp/shared';
import { mapCategory } from './category.mapper';
import { mapArticleWithRelations } from '../articles/article.mapper';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all categories
   */
  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' }, // Alphabetical order
    });

    return categories.map(mapCategory).filter((c): c is Category => c !== null);
  }

  /**
   * Get one category by slug
   * @param slug - Category slug
   * @throws NotFoundException if category not found
   */
  async findOne(slug: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    return mapCategory(category)!;
  }

  /**
   * Get articles by category slug (5 most recent)
   * @param categorySlug - Category slug
   * @throws NotFoundException if category not found
   */
  async findArticlesByCategory(categorySlug: string): Promise<ArticleWithRelations[]> {
    const category = await this.findOne(categorySlug); // This will throw if not found

    const articles = await this.prisma.article.findMany({
      where: {
        categoryId: category.id,
      },
      orderBy: {
        rssPublishedAt: 'desc', // Most recent first
      },
      take: 5, // Limit to 5 articles
      include: {
        source: true,
        category: true,
      },
    });

    return articles.map(mapArticleWithRelations);
  }

  /**
   * Create a new category
   * @param dto - Category data
   * @throws ConflictException if category with slug already exists
   */
  async create(dto: CreateCategoryDto): Promise<Category> {
    try {
      const category = await this.prisma.category.create({
        data: {
          name: dto.name,
          slug: dto.slug,
        },
      });

      return mapCategory(category)!;
    } catch (error) {
      if (error.code === 'P2002') {
        // Unique constraint violation
        throw new ConflictException(`Category with slug "${dto.slug}" already exists`);
      }
      throw error;
    }
  }
}