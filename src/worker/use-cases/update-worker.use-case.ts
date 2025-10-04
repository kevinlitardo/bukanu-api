import { PrismaService } from 'prisma/prisma.service';
import { User } from '@clerk/express';
import { UpdateWorkerDto } from '../dto/update-worker.dto';
import { ForbiddenException } from '@nestjs/common';

export async function updateWorkerUseCase(
  prisma: PrismaService,
  id: string,
  data: UpdateWorkerDto,
  user: User,
) {
  try {
    const { schedules, services } = data;

    const exists = await prisma.worker.findFirst({
      where: { id, business: { owner: { auth_id: user.id } } },
    });

    if (!exists) {
      throw new ForbiddenException(
        'No puedes editar el horario de este trabajador',
      );
    }

    await prisma.$transaction([
      prisma.schedule.deleteMany({ where: { worker_id: id } }),
      prisma.schedule.createMany({
        data: schedules.map((s) => ({
          worker_id: id,
          status: s.status,
          day: s.day,
          start_time: s.start_time,
          break_start_time: s.break_start_time,
          break_end_time: s.break_end_time,
          end_time: s.end_time,
        })),
      }),
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
