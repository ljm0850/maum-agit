import { IsOptional, IsString, IsNotEmpty, Length } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string.' })
  @IsNotEmpty({ message: 'Title cannot be empty.' })
  @Length(1, 255, { message: 'Title must be between 1 and 255 characters.' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Original content must be a string.' })
  @IsNotEmpty({ message: 'Original content cannot be empty.' })
  originalContent?: string;

  // images?: UpdateImageDto[];
  // tags?: UpdateTagDto[];
}
