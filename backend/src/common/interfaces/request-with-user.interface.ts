import { Request } from 'express';

// JWT 페이로드에 포함되는 사용자 정보의 인터페이스
export interface JwtPayload {
  id: string;
  username: string; // 페이로드에 포함된 다른 정보도 있다면 추가
  email: string;
  // ... 필요한 다른 필드
}
// Request 객체에 사용자 정보가 추가된 형태의 인터페이스
export interface RequestWithUser extends Request {
  user: JwtPayload; // req.user에 JwtPayload 타입의 객체가 들어있음을 명시
}
