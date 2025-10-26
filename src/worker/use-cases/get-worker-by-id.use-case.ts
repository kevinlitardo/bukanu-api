import { User } from '@clerk/express';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { formatTime } from 'src/common/utils/availability';

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
      schedules: {
        select: {
          status: true,
          day: true,
          start_time: true,
          break_start_time: true,
          break_end_time: true,
          end_time: true,
        },
      },
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

  const { schedules, worker_service, ...rest } = worker;

  const dataFixed = {
    ...rest,
    schedules: schedules.map((s) => ({
      ...s,
      start_time: formatTime(s.start_time),
      end_time: formatTime(s.end_time),
      break_start_time: s.break_start_time
        ? formatTime(s.break_start_time)
        : null,
      break_end_time: s.break_end_time ? formatTime(s.break_end_time) : null,
    })),
    services: worker_service.map((service) => service.service_id),
  };

  return dataFixed;
}
