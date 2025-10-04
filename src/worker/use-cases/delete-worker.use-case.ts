import { PrismaService } from 'prisma/prisma.service';
import { User } from '@clerk/express';

export async function deleteWorkerUseCase(
  prisma: PrismaService,
  id: string,
  user: User,
) {
  try {
    await prisma.worker.delete({
      where: { id, business: { owner: { auth_id: user.id } } },
    });
  } catch (error) {
    throw error;
  }
}
