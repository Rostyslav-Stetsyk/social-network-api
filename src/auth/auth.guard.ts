import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isUUID } from 'class-validator';
import { Request } from 'express';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authServise: AuthService,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const accessToken = req.cookies['accessToken'];

    if (typeof accessToken !== 'string') return false;

    try {
      const { sub } = this.jwtService.verify(accessToken);

      if (typeof sub !== 'string' || !isUUID(sub)) return false;

      const { id, email, username, createdAt } =
        await this.authServise.getUserById(sub);

      req['user'] = { id, email, username, createdAt };

      return true;
    } catch {
      return false;
    }
  }
}
