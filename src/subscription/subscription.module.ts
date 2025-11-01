import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionActions } from './architecture/subscription.actions';
import { PrismaSubscriptionServices } from './architecture/prisma-subscription.services';

@Module({
  controllers: [SubscriptionController],
  providers: [
    {
      provide: SubscriptionActions,
      useClass: PrismaSubscriptionServices,
    },
  ],
})
export class SubscriptionModule {}
