import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from 'src/common/filters/guards/clerk-auth.guard';
import { User } from '@clerk/express';
import { SubscriptionActions } from './architecture/subscription.actions';

@Controller('subscriptions')
@UseGuards(ClerkAuthGuard)
export class SubscriptionController {
  constructor(private readonly actions: SubscriptionActions) {}

  @Get('/verify')
  async getUserSubscription(@Req() req) {
    const user: User = req.user;
    await this.actions.getUserSubscription(user.id);
  }
}
