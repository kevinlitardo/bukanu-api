import { Module } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { BusinessActions } from './architecture/business.actions';
import { PrismaBusinessServices } from './architecture/prisma-business.services';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  controllers: [BusinessController],
  providers: [
    {
      provide: BusinessActions,
      useClass: PrismaBusinessServices,
    },
  ],
  imports: [SubscriptionModule],
})
export class BusinessModule {}
