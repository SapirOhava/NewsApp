import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsflashDto } from './dto/create-newsflash.dto';

@Injectable()
export class NewsflashesService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all newsflashes (most recent first)
  async findAll() {
    return this.prisma.newsflash.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get one newsflash by ID
  async findOne(id: string) {
    const newsflash = await this.prisma.newsflash.findUnique({
      where: { id },
    });

    if (!newsflash) {
      throw new NotFoundException(`Newsflash with ID "${id}" not found`);
    }

    return newsflash;
  }

  // Create a new newsflash
  async create(dto: CreateNewsflashDto) {
    return this.prisma.newsflash.create({
      data: {
        title: dto.title,
        content: dto.content,
      },
    });
  }
}