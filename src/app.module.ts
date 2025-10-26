import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from './user/user.module';
import { BusinessModule } from './business/business.module';
import { WorkerModule } from './worker/worker.module';
import { ConfigModule } from '@nestjs/config';
import { WebhooksModule } from './webhooks/webhooks.module';
import { ServiceModule } from './service/service.module';
import { PublicModule } from './public/public.module';
import { ReserveModule } from './reserve/reserve.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { PlanModule } from './plans/plan.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    WebhooksModule,
    UserModule,
    BusinessModule,
    WorkerModule,
    ServiceModule,
    PublicModule,
    ReserveModule,
    SubscriptionModule,
    PlanModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
