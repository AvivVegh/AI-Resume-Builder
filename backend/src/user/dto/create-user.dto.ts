import { IsString } from 'class-validator';

export class CreateUsersDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  email: string;
  @IsString()
  providerId: string;
  @IsString()
  providerType: string;
}
