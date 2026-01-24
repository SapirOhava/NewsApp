import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { ArticlesController } from './articles.controller';
import { PrismaModule } from './prisma/prisma.module';


@Module({
  imports: [PrismaModule],
  controllers: [AppController, HealthController, ArticlesController],
  providers: [AppService],
})
export class AppModule {}
