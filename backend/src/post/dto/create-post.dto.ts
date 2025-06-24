import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsInt,
  Min,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

// 이미지 DTO (게시물 생성 시 함께 받을 이미지 정보)
export class CreateImageDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsInt()
  @Min(0)
  @IsOptional() // 순서가 없을 수도 있으므로 optional
  orderIndex?: number;

  @IsString()
  @IsOptional()
  description?: string;
}

// 태그 DTO (게시물 생성 시 함께 받을 태그 이름)
export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: '제목은 필수 항목입니다.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '내용은 필수 항목입니다.' })
  originalContent: string;

  @IsString()
  @IsOptional() // 순화된 내용은 필수가 아님
  purifiedContent?: string;

  @IsArray()
  @IsOptional()
  @Type(() => CreateImageDto) // DTO 안에 DTO 사용 시 필요
  images?: CreateImageDto[]; // 이미지 배열 (선택 사항)

  @IsArray()
  @IsOptional()
  @Type(() => CreateTagDto) // DTO 안에 DTO 사용 시 필요
  tags?: CreateTagDto[]; // 태그 배열 (선택 사항)
}
