import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsUrl,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

// DTO = Data Transfer Object
// This defines what data we expect when creating an article from RSS feed
export class CreateArticleDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title: string;

  @IsString({ message: 'Slug must be a string' })
  @IsNotEmpty({ message: 'Slug is required' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase, alphanumeric, and use hyphens (e.g., "my-article-123")',
  })
  @MinLength(3, { message: 'Slug must be at least 3 characters long' })
  @MaxLength(100, { message: 'Slug must not exceed 100 characters' })
  slug: string;

  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  @MinLength(10, { message: 'Content must be at least 10 characters long' })
  content: string;

  @IsOptional()
  @IsString({ message: 'Excerpt must be a string' })
  @MaxLength(500, { message: 'Excerpt must not exceed 500 characters' })
  excerpt?: string;

  @IsUrl({}, { message: 'OriginalUrl must be a valid URL' })
  @IsNotEmpty({ message: 'OriginalUrl is required' })
  originalUrl: string;

  @IsDateString({}, { message: 'RssPublishedAt must be a valid date string (ISO format)' })
  @IsNotEmpty({ message: 'RssPublishedAt is required' })
  rssPublishedAt: string;

  @IsString({ message: 'SourceId must be a string' })
  @IsNotEmpty({ message: 'SourceId is required' })
  sourceId: string;

  @IsOptional()
  @IsString({ message: 'CategoryId must be a string' })
  categoryId?: string;

  @IsOptional()
  @IsDateString({}, { message: 'PublishedAt must be a valid date string (ISO format)' })
  publishedAt?: string;

  @IsOptional()
  @IsBoolean({ message: 'IsNewsflash must be a boolean' })
  isNewsflash?: boolean;
}