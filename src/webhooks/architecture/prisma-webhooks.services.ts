import { Injectable } from '@nestjs/common';
import { WebhooksActions } from './webhooks.actions';
import { PrismaService } from 'prisma/prisma.service';
import { handleClerkWebhookRequestUseCase } from '../use-cases/handle-clerk-webhook-request.use-case';
import { Request } from 'express';

@Injectable()
export class PrismaWebhooksServices implements WebhooksActions {
  constructor(private prisma: PrismaService) {}

  async handleClerkWebhookRequest(req: Request): Promise<void> {
    await handleClerkWebhookRequestUseCase(this.prisma, req);
  }
}
