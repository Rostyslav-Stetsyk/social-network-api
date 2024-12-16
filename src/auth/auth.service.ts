import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionsService } from 'src/sessions/sessions.service';
import { UsersService } from 'src/users/users.service';
import { DataSource } from 'typeorm';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateSessionDto } from 'src/sessions/dto/create-session.dto';
import { NewSessionResponseDto } from 'src/sessions/dto/session-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private usersServise: UsersService,
    private sessionsService: SessionsService,
    private readonly dataSource: DataSource,
  ) {}

  async register({
    userData,
    sessionData,
  }: {
    userData: CreateUserDto;
    sessionData: Omit<CreateSessionDto, 'user'>;
  }): Promise<{
    user: UserResponseDto;
    tokens: NewSessionResponseDto;
  }> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.usersServise.addUser(
        userData,
        queryRunner.manager,
      );
      const tokens = await this.sessionsService.createSession(
        {
          ...sessionData,
          user: user.id,
        },
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
      return {
        user,
        tokens,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async login({
    loginData,
    sessionData,
  }: {
    loginData: LoginDto;
    sessionData: Omit<CreateSessionDto, 'user'>;
  }): Promise<NewSessionResponseDto> {
    const user = await this.usersServise.findByUsernameOrEmail(loginData.login);

    if (!(await bcrypt.compare(loginData.password, user.password)))
      throw new UnauthorizedException();

    const tokens = await this.sessionsService.createSession({
      ...sessionData,
      user: user.id,
    });

    return tokens;
  }
}
