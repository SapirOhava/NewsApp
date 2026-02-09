import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateNewsflashDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(150, { message: 'Title must not exceed 150 characters' })
  title: string;

  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  @MinLength(5, { message: 'Content must be at least 5 characters long' })
  @MaxLength(500, { message: 'Content must not exceed 500 characters' })
  content: string;
}