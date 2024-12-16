import { IsIP, IsString, IsUUID } from 'class-validator';

export class CreateSessionDto {
  @IsUUID()
  user: string;

  @IsIP()
  @IsString()
  ip?: string;

  @IsString()
  userAgent?: string;
}
