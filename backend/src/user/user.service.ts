import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './user.repository';
import { User } from 'src/entities/user.entity';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
    private logger: Logger,
  ) {}

  getUsers(): Promise<User[]> {
    const users = this.userRepository.getAll();
    this.logger.log(users, 'users');
    return users;
  }

  getUser(dto: GetUserDto): Promise<User> {
    const user = this.userRepository.getById({ id: dto.id });
    this.logger.log(user);
    return user;
  }

  // createUser({
  //   firstName,
  //   lastName,
  // }: {
  //   firstName: string;
  //   lastName: string;
  // }): Promise<User> {
  //   return this.userRepository.create({
  //     firstName,
  //     lastName,
  //   });
  // }
}
