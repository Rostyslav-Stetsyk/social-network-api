import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { isUUID } from 'class-validator';
import { EntityManager, Repository } from 'typeorm';

import { CreateSessionDto } from './dto/create-session.dto';
import { NewSessionResponseDto as SessionResponseDto } from './dto/session-response.dto';
import { SessionEntity } from './entity/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionsRepository: Repository<SessionEntity>,
    private jwtService: JwtService,
  ) {}

  async createSession(
    sessionData: CreateSessionDto,
    manager?: EntityManager,
  ): Promise<SessionResponseDto> {
    const session = new SessionEntity();

    session.accessToken = this.jwtService.sign(
      {
        sub: sessionData.user,
      },
      {
        expiresIn: `${process.env.ACCESS_TOKEN_LIFETIME}` || '30m',
      },
    );

    session.refreshToken = this.jwtService.sign(
      {
        sub: sessionData.user,
      },
      {
        expiresIn: `${process.env.REFRESH_TOKEN_LIFETIME}` || '7d',
      },
    );

    session.user = sessionData.user;
    session.ip = sessionData.ip;
    session.userAgent = sessionData.userAgent;

    const savedSession = manager
      ? await manager.save(session)
      : await this.sessionsRepository.save(session);

    return plainToInstance(SessionResponseDto, savedSession, {
      excludeExtraneousValues: true,
    });
  }

  async updateSession(
    refreshToken: string,
    sessionData: Partial<CreateSessionDto>,
  ): Promise<SessionResponseDto> {
    try {
      const { sub, exp } = this.jwtService.verify(refreshToken);

      if (typeof sub !== 'string' || !isUUID(sub) || exp * 1000 < Date.now())
        throw new UnauthorizedException();

      const session = await this.sessionsRepository.findOneBy({
        refreshToken,
      });

      if (
        !session ||
        session.deletedAt ||
        session.ip !== sessionData.ip ||
        session.userAgent !== sessionData.userAgent
      ) {
        throw new UnauthorizedException();
      }

      session.accessToken = this.jwtService.sign(
        {
          sub,
        },
        {
          expiresIn: `${process.env.ACCESS_TOKEN_LIFETIME}` || '30m',
        },
      );

      session.refreshToken = this.jwtService.sign(
        {
          sub,
        },
        {
          expiresIn: `${process.env.REFRESH_TOKEN_LIFETIME}` || '7d',
        },
      );

      const updatetSession = await this.sessionsRepository.save(session);

      return plainToInstance(SessionResponseDto, updatetSession, {
        excludeExtraneousValues: true,
      });
    } catch {
      throw new UnauthorizedException();
    }
  }
}
