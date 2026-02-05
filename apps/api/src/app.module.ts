import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module'; // Import the new module

@Module({
  imports: [
    PrismaModule,
    ArticlesModule,  // Add ArticlesModule here
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}