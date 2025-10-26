import { PrismaService } from 'prisma/prisma.service';

import { User } from '@clerk/express';
import { BadRequestException } from '@nestjs/common';

export default async function getServiceByIdUseCase(
  prisma: PrismaService,
  slug: string,
  id: string,
  user: User,
) {
  try {
    const service = await prisma.service.findFirst({
      where: {
        id,
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
    });

    if (!service) {
      throw new BadRequestException({ message: 'El servicio no existe' });
    }

    const dataFixed = {
      ...service,
      price: service.price / 100,
    };

    return dataFixed;
  } catch (error) {
    throw error;
  }
}
