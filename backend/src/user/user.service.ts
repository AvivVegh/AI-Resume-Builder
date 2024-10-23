import { decode } from 'jsonwebtoken';

import { CreateUsersDto } from './dto/create-user.dto';

import { Logger } from '../lib/logger';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private logger: Logger
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    const users = await this.userRepository.getAll();
    return users;
  }

  async getUser(token: string): Promise<UserEntity> {
    const payload = decode(token);

    if (!payload) {
      this.logger.error('invalid token');
      throw new Error('invalid token');
    }

    const tokenData = JSON.parse(payload as string);

    const email = tokenData['email'];
    const user = await this.userRepository.getByEmail({ email });
    return user;
  }

  async createUser(dto: CreateUsersDto): Promise<UserEntity> {
    let user = await this.userRepository.getByEmail({ email: dto.email });
    if (user) {
      this.logger.info('user already exists', { id: user.id });
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
    this.logger.info('user created', { id: user });
    return user;
  }
}
