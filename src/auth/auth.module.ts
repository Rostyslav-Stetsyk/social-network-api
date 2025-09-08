import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionsModule } from './sessions/sessions.module';
import { UsersModule } from './users/users.module';

@Global()
@Module({
  imports: [
    UsersModule,
    SessionsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
