import 'dotenv/config';

import {
  Body,
  Controller,
  Inject,
  Ip,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UserResponseDto } from './users/dto/user-response.dto';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(
    @Inject(AuthService)
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Body() userData: CreateUserDto,
    @Req() req: Request,
    @Ip() clientIp: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponseDto> {
    const { user, tokens } = await this.authService.register({
      userData,
      sessionData: {
        ip: clientIp,
        userAgent: req.headers['user-agent'],
      },
    });

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: Number(process.env.ACCESS_TOKEN_LIFETIME) || 1000 * 60 * 30,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge:
        Number(process.env.REFRESH_TOKEN_LIFETIME) || 1000 * 60 * 60 * 24 * 7,
    });

    return user;
  }

  @Post('login')
  async login(
    @Body() loginData: LoginDto,
    @Req() req: Request,
    @Ip() clientIp: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const tokens = await this.authService.login({
      loginData,
      sessionData: {
        ip: clientIp,
        userAgent: req.headers['user-agent'],
      },
    });

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: Number(process.env.ACCESS_TOKEN_LIFETIME) || 1000 * 60 * 30,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge:
        Number(process.env.REFRESH_TOKEN_LIFETIME) || 1000 * 60 * 60 * 24 * 7,
    });
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Ip() clientIp: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException();

    const tokens = await this.authService.refreshSession(refreshToken, {
      ip: clientIp,
      userAgent: req.headers['user-agent'],
    });

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: Number(process.env.ACCESS_TOKEN_LIFETIME) || 1000 * 60 * 30,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge:
        Number(process.env.REFRESH_TOKEN_LIFETIME) || 1000 * 60 * 60 * 24 * 7,
    });
  }
}
