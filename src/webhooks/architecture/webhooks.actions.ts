import { Request } from 'express';

export abstract class WebhooksActions {
  abstract handleClerkWebhookRequest(req: Request): Promise<void>;
}
