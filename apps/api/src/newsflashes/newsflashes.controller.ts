import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { NewsflashesService } from './newsflashes.service';
import { CreateNewsflashDto } from './dto/create-newsflash.dto';

@Controller('newsflashes')
export class NewsflashesController {
  constructor(private readonly newsflashesService: NewsflashesService) {}

  // GET /newsflashes
  @Get()
  findAll() {
    return this.newsflashesService.findAll();
  }

  // GET /newsflashes/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsflashesService.findOne(id);
  }

  // POST /newsflashes
  @Post()
  create(@Body() dto: CreateNewsflashDto) {
    return this.newsflashesService.create(dto);
  }
}