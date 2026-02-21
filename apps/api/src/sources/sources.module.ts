import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { SourcesController } from "./sources.controller";
import { SourcesService } from "./sources.service";

@Module({
  imports: [PrismaModule],
  controllers: [SourcesController],
  providers: [SourcesService],
})
export class SourcesModule {}
