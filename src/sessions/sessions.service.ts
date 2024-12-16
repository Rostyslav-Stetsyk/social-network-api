import { Injectable } from '@nestjs/common';
import { NewSessionResponseDto } from './dto/session-response.dto';
import { SessionEntity } from './entity/session.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateSessionDto } from './dto/create-session.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

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
  ): Promise<NewSessionResponseDto> {
    const session = new SessionEntity();

    session.accessToken = this.jwtService.sign(
      {
        sub: sessionData.user,
      },
      { expiresIn: '30m' },
    );
    session.refreshToken = this.jwtService.sign(
      {
        sub: sessionData.user,
      },
      { expiresIn: '7d' },
    );

    session.user = sessionData.user;
    session.ip = sessionData.ip;
    session.userAgent = sessionData.userAgent;

    const savedSession = manager
      ? await manager.save(session)
      : await this.sessionsRepository.save(session);

    return plainToInstance(NewSessionResponseDto, savedSession, {
      excludeExtraneousValues: true,
    });
  }
}
