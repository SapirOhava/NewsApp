import { Module } from '@nestjs/common';
import { NewsflashesController } from './newsflashes.controller';
import { NewsflashesService } from './newsflashes.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NewsflashesController],
  providers: [NewsflashesService],
  exports: [NewsflashesService],
})
export class NewsflashesModule {}