import { Controller, Post, Param } from '@nestjs/common';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  /**
   * POST /ingestion/feed/:feedId
   * Manually trigger ingestion from a specific feed
   */
  @Post('feed/:feedId')
  async ingestFromFeed(@Param('feedId') feedId: string) {
    const count = await this.ingestionService.ingestFromFeed(feedId);
    return {
      message: `Ingested ${count} articles from feed`,
      count,
    };
  }

  /**
   * POST /ingestion/source/:sourceId
   * Manually trigger ingestion from all feeds of a specific source
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
   * Manually trigger ingestion from all active feeds
   */
  @Post('all')
  async ingestFromAll() {
    const results = await this.ingestionService.ingestFromAllFeeds();
    return {
      message: 'Ingestion complete',
      results,
    };
  }
}