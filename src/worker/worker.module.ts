// business/business.module.ts
import { Module } from '@nestjs/common';
import { WorkerController } from './worker.controller';
import { WorkerActions } from './architecture/worker.actions';
import { PrismaWorkerServices } from './architecture/prisma-worker.services';

@Module({
  controllers: [WorkerController],
  providers: [
    {
      provide: WorkerActions,
      useClass: PrismaWorkerServices,
    },
  ],
})
export class WorkerModule {}
