import { User } from '@clerk/express';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

export async function getWorkerByIdUseCase(
  prisma: PrismaService,
  slug: string,
  id: string,
  user: User,
): Promise<any> {
  const worker = await prisma.worker.findFirst({
    where: {
      id,
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
      work_days: true,
      worker_service: {
        select: {
          service_id: true,
        },
      },
    },
  });

  if (!worker) {
    throw new BadRequestException({ message: 'El trabajador no existe' });
  }

  const { worker_service, ...rest } = worker;

  const dataFixed = {
    ...rest,
    services: worker_service.map((service) => service.service_id),
  };

  return dataFixed;
}
