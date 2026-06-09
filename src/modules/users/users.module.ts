import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController, InvitationController } from './users.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [UsersController, InvitationController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
