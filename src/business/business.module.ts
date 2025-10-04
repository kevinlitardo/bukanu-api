import { Module } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { BusinessActions } from './architecture/business.actions';
import { PrismaBusinessServices } from './architecture/prisma-business.services';

@Module({
  controllers: [BusinessController],
  providers: [
    {
      provide: BusinessActions,
      useClass: PrismaBusinessServices,
    },
  ],
})
export class BusinessModule {}
