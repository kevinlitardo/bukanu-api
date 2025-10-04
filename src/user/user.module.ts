import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserActions } from './architecture/user.actions';
import { PrismaUserServices } from './architecture/prisma-user.services';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: UserActions,
      useClass: PrismaUserServices,
    },
  ],
})
export class UserModule {}
