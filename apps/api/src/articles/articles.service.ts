import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';

// @Injectable() = NestJS decorator that makes this class injectable
// This means NestJS can automatically create instances and inject dependencies
@Injectable()
export class ArticlesService {
  // Constructor injection: NestJS automatically provides PrismaService
  constructor(private readonly prisma: PrismaService) {}

  // Get all articles
  async findAll() {
    // prisma.article = access to the Article table
    // findMany() = get all records
    return this.prisma.article.findMany({
      orderBy: { createdAt: 'desc' }, // Newest first
    });
  }

  // Get one article by slug
  async findOne(slug: string) {
    return this.prisma.article.findUnique({
      where: { slug }, // Find article where slug matches
    });
  }

  // Create a new article
  async create(dto: CreateArticleDto) {
    // dto = Data Transfer Object (the validated data from the request)
    return this.prisma.article.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        content: dto.content,
        publishedAt: dto.publishedAt, // Can be undefined (optional)
      },
    });
  }
}