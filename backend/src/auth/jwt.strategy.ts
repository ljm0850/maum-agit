// maum-agit/backend/src/auth/jwt.strategy.ts

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // 환경 변수 접근을 위함
import { InjectRepository } from '@nestjs/typeorm'; // TypeORM Repository 주입을 위함
import { Repository } from 'typeorm'; // TypeORM Repository 타입
import { User } from '../user/user.entity'; // User 엔티티 임포트

// JWT 페이로드의 타입 정의 (AuthService에서 JWT 생성 시 사용한 페이로드와 동일해야 함)
export interface JwtPayload {
  userId: string;
  username: string;
  email?: string; // JWT에 이메일도 포함시켰다면
}

@Injectable() // 이 클래스를 NestJS의 의존성 주입 시스템에 등록
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // `PassportStrategy(Strategy, 'jwt')` 설명:
  // - `Strategy`: `passport-jwt`에서 가져온 JWT 인증 로직의 핵심 클래스
  // - `'jwt'`: 이 전략의 이름을 'jwt'로 지정. `@UseGuards(AuthGuard('jwt'))`

  constructor(
    private configService: ConfigService, // 환경 변수 (JWT_SECRET) 접근을 위해 주입
    @InjectRepository(User) // User 엔티티에 대한 TypeORM Repository를 주입받아 DB와 상호작용
    private usersRepository: Repository<User>,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');

    // JWT_SECRET 환경 변수가 설정되지 않았을 경우, 앱 시작 단계에서 명확한 오류를 발생시킵니다.
    if (!jwtSecret) {
      throw new UnauthorizedException(
        'JWT_SECRET environment variable is not set correctly.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 요청 헤더의 `Bearer <token>` 형식에서 JWT 추출
      ignoreExpiration: false, // 토큰 만료 여부를 엄격하게 검사 (만료 시 401 Unauthorized 발생)
      secretOrKey: jwtSecret, // JWT를 서명하고 검증할 때 사용할 비밀 키 (환경 변수에서 가져옴)
    });
  }

  // `validate` 메서드: JWT가 유효하게 검증되면 호출됩니다.
  // 페이로드로부터 사용자 정보를 추출하고, 필요하면 DB에서 추가 정보를 가져옵니다.
  async validate(payload: JwtPayload): Promise<User> {
    // 1. JWT 페이로드에서 사용자 ID 추출
    const user = await this.usersRepository.findOne({
      where: { id: payload.userId },
    });

    // 2. 해당 ID의 사용자가 DB에 없으면 인증 실패 (401 Unauthorized)
    if (!user) {
      throw new UnauthorizedException(
        'User corresponding to the JWT not found.',
      );
    }

    // 3. 인증 성공 시, 이 `user` 객체는 `req.user`에 주입되어 컨트롤러에서 사용할 수 있게 됩니다.
    //    주의: 비밀번호와 같은 민감한 정보는 `User` 엔티티에서 `@Exclude()` 등으로 제외하는 것이 좋습니다.
    return user;
  }
}
