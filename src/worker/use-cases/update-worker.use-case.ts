import { PrismaService } from 'prisma/prisma.service';
import { User } from '@clerk/express';
import { UpdateWorkerDto } from '../dto/update-worker.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import parseStringToDateTime from 'src/common/lib/parse-string-to-datetime';
import { validateWorkerSchedules } from 'src/common/utils/validate-schedules';

export async function updateWorkerUseCase(
  prisma: PrismaService,
  id: string,
  data: UpdateWorkerDto,
  user: User,
) {
  try {
    const { slug, schedules, services } = data;

    const business = await prisma.business.findFirst({
      where: {
        slug,
        owner: { auth_id: user.id },
      },
    });

    if (!business) throw new NotFoundException('El negocio no existe');

    validateWorkerSchedules(schedules, {
      open_time_weekday: business.open_time_weekday,
      close_time_weekday: business.close_time_weekday,
      open_on_saturday: business.open_on_saturday,
      open_on_sunday: business.open_on_sunday,
      open_time_weekend: business.open_time_weekend,
      close_time_weekend: business.close_time_weekend,
    });

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
          start_time: parseStringToDateTime(s.start_time),
          end_time: parseStringToDateTime(s.end_time),
          break_start_time: s.break_start_time
            ? parseStringToDateTime(s.break_start_time)
            : null,
          break_end_time: s.break_end_time
            ? parseStringToDateTime(s.break_end_time)
            : null,
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
