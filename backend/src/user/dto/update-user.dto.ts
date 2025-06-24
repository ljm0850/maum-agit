import { IsString, IsOptional, Length } from 'class-validator'; // 데이터 유효성 검사

export class UpdateUserDto {
  @IsOptional() // username은 필수가 아님 (부분 업데이트 가능)
  @IsString({ message: 'Username must be a string.' })
  @Length(2, 30, { message: 'Username must be between 2 and 30 characters.' })
  username?: string;

  // 추가적으로 업데이트하고 싶은 필드가 있다면 여기에 정의합니다.
  // @IsOptional()
  // @IsString()
  // @IsUrl()
  // profileImageUrl?: string;
}
