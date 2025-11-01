import { Injectable } from '@nestjs/common';
import { SubscriptionActions } from './subscription.actions';
import { PrismaService } from 'prisma/prisma.service';
import getUserSubscriptionUseCase from '../use-cases/get-user-subscription.use-case';
import hasActiveSubscriptionUseCase from '../use-cases/has-active-subscription.use-case';

@Injectable()
export class PrismaSubscriptionServices implements SubscriptionActions {
  constructor(private prisma: PrismaService) {}

  async getUserSubscription(userId: string): Promise<any> {
    return await getUserSubscriptionUseCase(this.prisma, userId);
  }

  async hasActiveSubscription(userId: string): Promise<any> {
    return await hasActiveSubscriptionUseCase(this.prisma, userId);
  }
}
