import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './entity/session.entity';
import { SessionsService } from './sessions.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}
