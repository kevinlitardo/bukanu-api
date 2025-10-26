import { User } from '@clerk/express';
import { PrismaService } from 'prisma/prisma.service';

export async function listUserBusinessesUseCase(
  prisma: PrismaService,
  user: User,
): Promise<any> {
  const list = await prisma.business.findMany({
    where: {
      owner: {
        auth_id: user.id,
      },
    },
    select: {
      slug: true,

      logo_url: true,

      name: true,

      status: true,

      deletedAt: true,

      _count: {
        select: {
          workers: true,
          services: true,
          appointments: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  const mapped = list.map(({ _count, ...rest }) => ({
    ...rest,
    workers: _count.workers,
    services: _count.services,
    appointments: _count.appointments,
  }));

  return mapped;
}
