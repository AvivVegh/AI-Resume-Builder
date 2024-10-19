import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUsersDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { jwtDecode } from 'jwt-decode';
import { ConfigService } from '../config/configuration';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private logger: Logger,
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    const users = this.userRepository.getAll();
    this.logger.log(users, 'users');
    return users;
  }

  async getUser(token: string): Promise<UserEntity> {
    const decoded = jwtDecode(token);

    if (!decoded) {
      this.logger.error('invalid token');
      throw new Error('invalid token');
    }

    const email = decoded['email'];
    const user = await this.userRepository.getByEmail({ email });
    return user;
  }

  async createUser(dto: CreateUsersDto): Promise<UserEntity> {
    let user = await this.userRepository.getByEmail({ email: dto.email });
    if (user) {
      this.logger.log('user already exists', { id: user.id });
      return user;
    }

    const userEntity = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      providerId: dto.providerId,
      providerType: dto.providerType,
    } as UserEntity;

    user = await this.userRepository.create(userEntity);
    this.logger.log('user created', { id: user });
    return user;
  }
}
