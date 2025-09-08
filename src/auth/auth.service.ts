import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { LoginDto } from './dto/login.dto';
import { CreateSessionDto } from './sessions/dto/create-session.dto';
import { NewSessionResponseDto } from './sessions/dto/session-response.dto';
import { SessionsService } from './sessions/sessions.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UserResponseDto } from './users/dto/user-response.dto';
import { UsersService } from './users/users.service';

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

  async refreshSession(
    refreshToken: string,
    sessionData: Omit<CreateSessionDto, 'user'>,
  ): Promise<NewSessionResponseDto> {
    const tokens = await this.sessionsService.updateSession(
      refreshToken,
      sessionData,
    );

    return tokens;
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    return this.usersServise.findOneById(id);
  }
}
