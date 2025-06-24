import { Injectable } from '@nestjs/common'; // InternalServerErrorException 제거
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

export interface JwtPayload {
  userId: string;
  username: string | null;
  email?: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateOrCreateUser(profile: {
    providerName: string;
    providerId: string;
    email?: string;
    username?: string;
    profileImageUrl?: string;
  }): Promise<User | null> {
    let user = await this.usersRepository.findOne({
      where: {
        providerName: profile.providerName,
        providerId: profile.providerId,
      },
    });

    if (!user) {
      user = this.usersRepository.create({
        id: undefined,
        providerName: profile.providerName,
        providerId: profile.providerId,
        email: profile.email,
        username:
          profile.username ||
          (profile.email ? profile.email.split('@')[0] : '새 사용자'),
        profileImageUrl: profile.profileImageUrl,
      });
      try {
        await this.usersRepository.save(user);
        console.log('New user created:', user.username);
      } catch (error) {
        console.error('Error saving new user:', error);
        return null;
      }
    } else {
      let changed = false;
      if (profile.email && user.email !== profile.email) {
        user.email = profile.email;
        changed = true;
      }
      if (profile.username && user.username !== profile.username) {
        user.username = profile.username;
        changed = true;
      }
      if (
        profile.profileImageUrl &&
        user.profileImageUrl !== profile.profileImageUrl
      ) {
        user.profileImageUrl = profile.profileImageUrl;
        changed = true;
      }

      if (changed) {
        try {
          await this.usersRepository.save(user);
          console.log('Existing user updated:', user.username);
        } catch (error) {
          console.error('Error updating existing user:', error);
          return null;
        }
      }
    }
    return user;
  }

  generateJwt(user: User): { accessToken: string } {
    const payload: JwtPayload = { userId: user.id, username: user.username };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
