import { IsUrl } from 'class-validator';

export class GetProfileDto {
  @IsUrl()
  url: string;
}
