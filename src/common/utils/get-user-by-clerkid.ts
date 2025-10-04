// utils/prisma-utils.ts
import { PrismaClient, user } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';

export default async function getUserByClerkId(
  prisma: PrismaClient,
  auth_id: string,
): Promise<user> {
  const user = await prisma.user.findUnique({
    where: { auth_id },
  });

  if (!user) {
    throw new ForbiddenException(
      'El usuario no existe o no está sincronizado. Inicia sesión de nuevo o contacta con soporte',
    );
  }

  return user;
}
