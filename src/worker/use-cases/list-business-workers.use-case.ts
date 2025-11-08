import { User } from '@clerk/express';
import { PrismaService } from 'prisma/prisma.service';

export async function listBusinessWorkersUseCase(
  prisma: PrismaService,
  slug: string,
  user: User,
): Promise<any> {
  try {
    const workers = await prisma.worker.findMany({
      where: {
        business: {
          slug: slug,
          owner: { auth_id: user.id },
        },
      },
      select: {
        id: true,
        status: true,
        user: {
          select: {
            name: true,
            last_name: true,
            cellphone: true,
            email: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    });

    return workers;
  } catch (error) {
    throw error;
  }
}
