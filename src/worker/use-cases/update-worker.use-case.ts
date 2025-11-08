import { PrismaService } from 'prisma/prisma.service';
import { User } from '@clerk/express';
import { UpdateWorkerDto } from '../dto/update-worker.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export async function updateWorkerUseCase(
  prisma: PrismaService,
  id: string,
  data: UpdateWorkerDto,
  user: User,
) {
  try {
    const { slug, work_days, services } = data;

    const business = await prisma.business.findFirst({
      where: {
        slug,
        owner: { auth_id: user.id },
      },
    });

    if (!business) throw new NotFoundException('El negocio no existe');

    const exists = await prisma.worker.findFirst({
      where: { id, business: { owner: { auth_id: user.id } } },
    });

    if (!exists) {
      throw new ForbiddenException('No puedes editar este trabajador');
    }

    await prisma.$transaction([
      prisma.worker.update({ where: { id }, data: { work_days } }),
      prisma.worker_service.deleteMany({ where: { worker_id: id } }),
      prisma.worker_service.createMany({
        data: services.map((service_id) => ({
          worker_id: id,
          service_id,
        })),
        skipDuplicates: true,
      }),
    ]);
  } catch (error) {
    throw error;
  }
}
