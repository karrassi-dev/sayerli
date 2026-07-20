import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController, InvitationController } from './users.controller';
import { EmailModule } from '../email/email.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [EmailModule, LogsModule],
  controllers: [UsersController, InvitationController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
