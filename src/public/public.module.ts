import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PublicActions } from './architecture/public.actions';
import { PrismaPublicServices } from './architecture/prisma-public.services';

@Module({
  controllers: [PublicController],
  providers: [
    {
      provide: PublicActions,
      useClass: PrismaPublicServices,
    },
  ],
})
export class PublicModule {}
