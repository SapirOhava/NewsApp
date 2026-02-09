import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all categories
  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' }, // Alphabetical order
    });
  }

  // Get one category by slug
  async findOne(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    return category;
  }

  // Get articles by category slug (5 most recent)
  async findArticlesByCategory(categorySlug: string) {
    const category = await this.findOne(categorySlug); // This will throw if not found

    return this.prisma.article.findMany({
      where: {
        categoryId: category.id,
      },
      orderBy: [
        { updatedAt: 'desc' }, // First by updated date
        { createdAt: 'desc' }, // Then by created date
      ],
      take: 5, // Limit to 5 articles
      include: {
        category: true, // Include category info
      },
    });
  }

  // Create a new category
  async create(dto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: {
          name: dto.name,
          slug: dto.slug,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        // Unique constraint violation
        throw new ConflictException(`Category with slug "${dto.slug}" already exists`);
      }
      throw error;
    }
  }
}