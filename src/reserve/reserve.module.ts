import { Module } from '@nestjs/common';
import { ReserveController } from './reserve.controller';
import { ReserveActions } from './architecture/reserve.actions';
import { PrismaReserveServices } from './architecture/prisma-reserve.services';

@Module({
  controllers: [ReserveController],
  providers: [
    {
      provide: ReserveActions,
      useClass: PrismaReserveServices,
    },
  ],
})
export class ReserveModule {}
