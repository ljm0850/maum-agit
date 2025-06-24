// maum-agit/backend/src/common/interfaces/request-with-user.interface.ts
import { Request } from 'express';
// User 엔티티의 정확한 경로를 임포트하는 것이 매우 중요합니다.
// 현재 위치(src/common/interfaces)에서 src/user/user.entity.ts까지의 상대 경로를 확인하세요.
import { User } from '../../user/user.entity'; // <-- 이 경로가 올바른지 다시 한번 확인!

// Request 객체에 사용자 정보가 추가된 형태의 인터페이스
export interface RequestWithUser extends Request {
  user: User; // req.user에 User 엔티티 타입의 객체가 들어있음을 명시
}
