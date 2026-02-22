import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { SourcesModule } from './sources/sources.module';
import { FeedsModule } from './feeds/feeds.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [
    CategoriesModule,
    PrismaModule,
    SourcesModule,
    FeedsModule,
    ArticlesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}