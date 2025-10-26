import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ClerkAuthGuard } from 'src/common/guards/clerk-auth.guard';
import { SubscriptionService } from './subscription.service';
import { User } from '@clerk/express';

@Controller('subscriptions')
@UseGuards(ClerkAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('/verify')
  async getUserSubscription(@Req() req) {
    const user: User = req.user;
    return this.subscriptionService.getUserSubscription(user.id);
  }

  @Post('/free-trial')
  async createFreeTrial(@Req() req) {
    const user: User = req.user;
    return this.subscriptionService.createFreeTrial(user.id);
  }
}
