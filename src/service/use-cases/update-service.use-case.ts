import { PrismaService } from 'prisma/prisma.service';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { User } from '@clerk/express';
import { ForbiddenException } from '@nestjs/common';
import priceInCents from 'src/common/lib/price-in-cents';

export default async function updateServiceUseCase(
  prisma: PrismaService,
  id: string,
  data: UpdateServiceDto,
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

    await prisma.service.update({
      where: { id },
      data: {
        ...rest,
        price: price ? priceInCents(price) : undefined,
      },
    });
  } catch (error) {
    throw error;
  }
}
