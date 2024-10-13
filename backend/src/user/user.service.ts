import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './user.repository';
import { GetUserDto } from './dto/get-user.dto';
import { CreateUsersDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
    private logger: Logger,
  ) {}

  async getUsers(): Promise<UserEntity[]> {
    const users = this.userRepository.getAll();
    this.logger.log(users, 'users');
    return users;
  }

  async getUser(dto: GetUserDto): Promise<UserEntity> {
    const user = this.userRepository.getById({ id: dto.id });
    this.logger.log(user);
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
