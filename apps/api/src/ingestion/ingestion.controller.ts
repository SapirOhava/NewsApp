import { Controller, Post, Param } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  /**
   * POST /ingestion/source/:sourceId
   * Manually trigger ingestion from a specific source
   */
  @Post('source/:sourceId')
  async ingestFromSource(@Param('sourceId') sourceId: string) {
    const count = await this.ingestionService.ingestFromSource(sourceId);
    return {
      message: `Ingested ${count} articles from source`,
      count,
    };
  }

  /**
   * POST /ingestion/all
   * Manually trigger ingestion from all active sources
   */
  @Post('all')
  async ingestFromAll() {
    const results = await this.ingestionService.ingestFromAllSources();
    return {
      message: 'Ingestion complete',
      results,
    };
  }
}