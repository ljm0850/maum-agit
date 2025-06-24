import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  // id로 유저 찾기
  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findUserById(id); // 먼저 사용자가 존재하는지 확인
    // DTO의 필드만 업데이트
    // Object.assign(user, updateUserDto); // 이렇게 하면 DTO의 모든 필드를 병합
    // 또는 특정 필드만 업데이트:
    if (updateUserDto.username) {
      user.username = updateUserDto.username;
    }
    // ... 필요한 다른 필드 업데이트 로직 추가 ...
    return this.userRepository.save(user); // 변경된 사용자 정보 저장
  }
  // 유저 삭제
  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
  }

  async findOneByProviderIdAndName(
    providerId: string,
    providerName: string,
  ): Promise<User | null> {
    return this.userRepository.findOne({ where: { providerId, providerName } });
  }

  async createUser(userProps: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userProps);
    return this.userRepository.save(newUser);
  }
}
