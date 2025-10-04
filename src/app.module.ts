import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from './user/user.module';
import { BusinessModule } from './business/business.module';
import { WorkerModule } from './worker/worker.module';
import { ConfigModule } from '@nestjs/config';
import { WebhooksModule } from './webhooks/webhooks.module';
import { ServiceModule } from './service/service.module';
import { PublicModule } from './public/public.module';

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
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
