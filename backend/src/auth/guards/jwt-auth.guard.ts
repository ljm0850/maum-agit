// maum-agit/backend/src/auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// user.controller.ts에서 @UseGuards(AuthGuard('jwt')) 쓰던 방식을 @UseGuards(JwtAuthGuard)로 바꿀뿐
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
