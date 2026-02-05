import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { PrismaModule } from '../prisma/prisma.module';

// @Module() = defines a NestJS module
@Module({
  imports: [PrismaModule],           // Import PrismaModule to use PrismaService
  controllers: [ArticlesController],  // Register the controller
  providers: [ArticlesService],       // Register the service
  exports: [ArticlesService],         // Export if other modules need it
})
export class ArticlesModule {}