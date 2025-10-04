import { PrismaService } from 'prisma/prisma.service';
import { User } from '@clerk/express';

export async function deleteServiceUseCase(
  prisma: PrismaService,
  id: string,
  user: User,
) {
  try {
    await prisma.service.delete({
      where: { id, business: { owner: { auth_id: user.id } } },
    });
  } catch (error) {
    throw error;
  }
}
