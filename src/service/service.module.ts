import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { PrismaServiceServices } from './architecture/prisma-service.services';
import { ServiceActions } from './architecture/service.actions';

@Module({
  controllers: [ServiceController],
  providers: [
    {
      provide: ServiceActions,
      useClass: PrismaServiceServices,
    },
  ],
})
export class ServiceModule {}
