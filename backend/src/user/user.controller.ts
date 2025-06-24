// maum-agit/backend/src/user/user.controller.ts
import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface'; // <-- 새로 만든 인터페이스 임포트

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMyInfo(@Req() req: RequestWithUser): Promise<User> {
    const userId = req.user.id;
    return this.userService.findUserById(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  async updateMyInfo(
    @Req() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const userId = req.user.id;
    return this.userService.updateUser(userId, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('me')
  async deleteMyAccount(@Req() req: RequestWithUser): Promise<void> {
    const userId = req.user.id;
    await this.userService.deleteUser(userId);
  }
}
