import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksActions } from './architecture/webhooks.actions';
import { PrismaWebhooksServices } from './architecture/prisma-webhooks.services';

@Module({
  controllers: [WebhooksController],
  providers: [
    {
      provide: WebhooksActions,
      useClass: PrismaWebhooksServices,
    },
  ],
})
export class WebhooksModule {}
