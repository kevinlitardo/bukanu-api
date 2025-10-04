import { PrismaService } from 'prisma/prisma.service';

import { User } from '@clerk/express';

export default async function listServicesUseCase(
  prisma: PrismaService,
  slug: string,
  user: User,
) {
  try {
    const response = await prisma.service.findMany({
      where: {
        business: {
          slug,
          owner: {
            auth_id: user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
        status: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return response.map((item) => ({ ...item, price: item.price / 100 }));
  } catch (error) {
    throw error;
  }
}
