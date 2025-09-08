import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SessionEntity } from 'src/auth/sessions/entity/session.entity';
import { SessionsService } from 'src/auth/sessions/sessions.service';
import type { Repository } from 'typeorm';

describe('SessionsService', () => {
  let service: SessionsService;
  let mockSessionsRepository: Partial<
    Record<keyof Repository<SessionEntity>, jest.Mock>
  >;
  let mockJwtService: { sign: jest.Mock; verify: jest.Mock };

  beforeEach(async () => {
    mockSessionsRepository = {
      save: jest.fn(),
      findOneBy: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('signed-token'),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: getRepositoryToken(SessionEntity),
          useValue: mockSessionsRepository,
        },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
  });

  describe('createSession', () => {
    it('should create and save session', async () => {
      const dto = {
        user: '550e8400-e29b-41d4-a716-446655440000',
        ip: '127.0.0.1',
        userAgent: 'chrome',
      };
      const saved = {
        ...dto,
        accessToken: 'signed-token',
        refreshToken: 'signed-token',
      };
      mockSessionsRepository.save.mockResolvedValue(saved);

      const result = await service.createSession(dto);

      expect(mockJwtService.sign).toHaveBeenCalledTimes(2);
      expect(mockSessionsRepository.save).toHaveBeenCalledWith(
        expect.any(SessionEntity),
      );
      expect(result).toMatchObject({
        accessToken: 'signed-token',
        refreshToken: 'signed-token',
      });
    });
  });

  describe('updateSession', () => {
    it('should update session if refreshToken is valid', async () => {
      const dto = { ip: '127.0.0.1', userAgent: 'chrome' };
      const session = {
        id: 'caa8b54a-eb5e-4134-8ae2-a3946a428ec7',
        refreshToken: 'refresh',
        ip: '127.0.0.1',
        userAgent: 'chrome',
        deletedAt: null,
      };

      mockJwtService.verify.mockReturnValue({
        sub: '550e8400-e29b-41d4-a716-446655440000',
        exp: Date.now() / 1000 + 60,
      });
      mockSessionsRepository.findOneBy.mockResolvedValue(session);
      mockSessionsRepository.save.mockResolvedValue({
        ...session,
        accessToken: 'signed-token',
        refreshToken: 'signed-token',
      });

      const result = await service.updateSession('refresh', dto);

      expect(mockJwtService.verify).toHaveBeenCalledWith('refresh');
      expect(mockSessionsRepository.findOneBy).toHaveBeenCalledWith({
        refreshToken: 'refresh',
      });
      expect(mockSessionsRepository.save).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(result).toMatchObject({
        accessToken: 'signed-token',
        refreshToken: 'signed-token',
      });
    });

    it('should throw if token is expired', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: '550e8400-e29b-41d4-a716-446655440000',
        exp: Date.now() / 1000 - 10,
      });

      await expect(service.updateSession('refresh', {})).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if no session found', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: '550e8400-e29b-41d4-a716-446655440000',
        exp: Date.now() / 1000 + 10,
      });
      mockSessionsRepository.findOneBy.mockResolvedValue(null);

      await expect(service.updateSession('refresh', {})).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if session deleted', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: '550e8400-e29b-41d4-a716-446655440000',
        exp: Date.now() / 1000 + 10,
      });
      mockSessionsRepository.findOneBy.mockResolvedValue({
        deletedAt: new Date(),
      });

      await expect(service.updateSession('refresh', {})).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if ip or userAgent mismatch', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: '550e8400-e29b-41d4-a716-446655440000',
        exp: Date.now() / 1000 + 10,
      });
      mockSessionsRepository.findOneBy.mockResolvedValue({
        ip: '1.1.1.1',
        userAgent: 'firefox',
      });

      await expect(
        service.updateSession('refresh', {
          ip: '127.0.0.1',
          userAgent: 'chrome',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
