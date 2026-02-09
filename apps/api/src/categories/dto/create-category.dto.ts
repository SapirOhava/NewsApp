import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  name: string;

  @IsString({ message: 'Slug must be a string' })
  @IsNotEmpty({ message: 'Slug is required' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase, alphanumeric, and use hyphens',
  })
  @MinLength(2, { message: 'Slug must be at least 2 characters long' })
  @MaxLength(50, { message: 'Slug must not exceed 50 characters' })
  slug: string;
}