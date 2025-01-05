import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Global, Module } from '@nestjs/common';
import { SessionsModule } from './sessions/sessions.module';
import { JwtModule } from '@nestjs/jwt';
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
