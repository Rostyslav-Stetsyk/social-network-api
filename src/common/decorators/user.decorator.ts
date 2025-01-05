import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { type UserResponseDto } from 'src/auth/users/dto/user-response.dto';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserResponseDto;

    return data ? user?.[data] : user;
  },
);
