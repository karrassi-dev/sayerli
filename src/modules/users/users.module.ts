import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController, InvitationController } from './users.controller';

@Module({
  controllers: [UsersController, InvitationController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
