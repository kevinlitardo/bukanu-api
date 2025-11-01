import { BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export default async function getUserSubscriptionUseCase(
  prisma: PrismaClient,
  userId: string,
) {
  const subscription = await prisma.subscription.findFirst({
    where: { user: { auth_id: userId }, status: 'ACTIVE' },
    include: { plan: true },
  });

  if (!subscription) {
    throw new BadRequestException({
      message: 'Este usuario no tiene una suscripción activa',
    });
  }

  return subscription;
}
