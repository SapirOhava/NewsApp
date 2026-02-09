import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module'; // Import the new module
import { CategoriesModule } from './categories/categories.module';
import { NewsflashesModule } from './newsflashes/newsflashes.module';

@Module({
  imports: [
    NewsflashesModule,
    CategoriesModule,
    PrismaModule,
    ArticlesModule,  
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}