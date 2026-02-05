import { IsString, IsNotEmpty, IsOptional, IsDateString, MinLength, MaxLength, Matches } from 'class-validator';

// DTO = Data Transfer Object
// This defines what data we expect when creating an article
// Think of it as a "contract" for the incoming request

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

  @IsOptional() // This field is optional
  @IsDateString({}, { message: 'PublishedAt must be a valid date string (ISO format)' })
  publishedAt?: Date;
}