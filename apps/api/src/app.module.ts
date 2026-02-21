import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { SourcesModule } from './sources/sources.module';

@Module({
  imports: [
    CategoriesModule,
    PrismaModule,
    SourcesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}