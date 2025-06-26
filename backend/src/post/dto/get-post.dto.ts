import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPostsDto {
  @IsOptional() // 필수 값이 아님
  @Type(() => Number) // 숫자로 변환
  @IsInt({ message: 'Page must be an integer.' }) // 정수 검사
  @Min(1, { message: 'Page must be at least 1.' }) // 최소값 1 이상
  page?: number = 1; // 페이지 번호 (기본값 1)

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer.' })
  @Min(1, { message: 'Limit must be at least 1.' }) // 최소값 1 이상
  @Max(100, { message: 'Limit cannot exceed 100.' }) // 최대값 100 (과도한 데이터 로딩 방지)
  limit?: number = 10; // 한 페이지당 게시물 수 (기본값 10)

  // @IsOptional()
  // @IsString({ message: 'Search term must be a string.' }) // 문자열인지 검사
  // search?: string; // 게시물 제목이나 내용에서 검색할 키워드

  @IsOptional()
  @IsString({ message: 'Tag must be a string.' }) // 문자열인지 검사
  tag?: string; // 특정 태그 이름으로 필터링
}
