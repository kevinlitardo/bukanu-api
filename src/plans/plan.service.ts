import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

/**
 * Recibe el AUTH_ID del usuario, no el ID del modelo
 */
@Injectable()
export class PlanService {
  constructor(private prisma: PrismaService) {}

  async getPlans() {
    const plans = await this.prisma.plan.findMany({
      select: {
        id: true,
        recommended: true,
        name: true,
        description: true,
        price_usd: true,
        max_businesses: true,
        max_services: true,
        max_workers: true,
        features: true,
      },
      orderBy: { order: 'asc' },
    });

    const priceFixed = plans.map((p) => ({
      ...p,
      price_usd: p.price_usd / 100,
    }));

    return priceFixed;
  }
}
