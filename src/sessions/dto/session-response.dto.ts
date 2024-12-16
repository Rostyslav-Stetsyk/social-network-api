import { Expose } from 'class-transformer';

export class NewSessionResponseDto {
  @Expose()
  accessToken: string;
  @Expose()
  refreshToken: string;
}
