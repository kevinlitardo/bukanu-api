import { PrismaService } from 'prisma/prisma.service';
import { User } from '@clerk/express';
import { CreateServiceDto } from '../dto/create-service.dto';
import priceInCents from 'src/common/lib/price-in-cents';
import { ForbiddenException } from '@nestjs/common';

export default async function createServiceUseCase(
  prisma: PrismaService,
  data: CreateServiceDto,
  user: User,
) {
  try {
    const { slug, price, ...rest } = data;

    const business = await prisma.business.findFirst({
      where: { slug, owner: { auth_id: user.id } },
    });

    if (!business) {
      throw new ForbiddenException('No tienes permitido ejectuar esta acción');
    }

    await prisma.service.create({
      data: {
        ...rest,
        price: priceInCents(data.price),
        business: {
          connect: { id: business.id },
        },
      },
    });
  } catch (error) {
    throw error;
  }
}
