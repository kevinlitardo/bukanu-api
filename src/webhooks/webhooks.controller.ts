import { Controller, Post, Req } from '@nestjs/common';
import { WebhooksActions } from './architecture/webhooks.actions';
import { Request } from 'express';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly actions: WebhooksActions) {}

  @Post('/clerk')
  async handleClerkWebhookRequest(@Req() req: Request) {
    await this.actions.handleClerkWebhookRequest(req);
  }
}
