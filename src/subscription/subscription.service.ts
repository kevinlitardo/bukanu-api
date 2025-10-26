import { BadRequestException, Injectable } from '@nestjs/common';
import { addDays, isAfter } from 'date-fns';
import { PrismaService } from 'prisma/prisma.service';

/**
 * Recibe el AUTH_ID del usuario, no el ID del modelo
 */
@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async getUserSubscription(userId: string) {
    return this.prisma.subscription.findFirst({
      where: { user: { auth_id: userId }, status: 'ACTIVE' },
      include: { plan: true },
    });
  }

  async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) return false;

    return isAfter(new Date(subscription.current_period_end), new Date());
  }

  async createFreeTrial(user_id: string) {
    const plan = await this.prisma.plan.findFirst({
      where: { name: 'Free Trial' },
    });

    if (!plan) {
      throw new BadRequestException({ message: 'Free Trial plan not found' });
    }

    return this.prisma.subscription.create({
      data: {
        user_id, // LO RELACIONA CON EL AUTH_ID - EL ID DEL USUARIO DE CLERK, NO DEL MODELO DE LA DB
        plan_id: plan.id,
        started_at: new Date(),
        current_period_end: addDays(new Date(), plan.duration_days),
      },
    });
  }
}
