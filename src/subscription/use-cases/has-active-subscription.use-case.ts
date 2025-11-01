import { ForbiddenException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export default async function hasActiveSubscriptionUseCase(
  prisma: PrismaClient,
  userId: string,
) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Establece la hora en medianoche

  const subscription = await prisma.subscription.findFirst({
    where: {
      user: { auth_id: userId },
      status: 'ACTIVE',
      current_period_end: {
        gte: hoy,
      },
    },
  });

  if (!subscription) {
    throw new ForbiddenException({
      message:
        'Tu suscripción ha expirado o no está activa. Por favor, renueva tu suscripción para acceder a este recurso',
    });
  }

  return subscription;
}
