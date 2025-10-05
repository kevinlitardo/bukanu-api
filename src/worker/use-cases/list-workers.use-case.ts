import { User } from '@clerk/express';
import { format } from 'date-fns';
import { PrismaService } from 'prisma/prisma.service';

export async function listWorkersUseCase(
  prisma: PrismaService,
  slug: string,
  user: User,
): Promise<any> {
  try {
    const workers = await prisma.worker.findMany({
      where: {
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
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    });

    return workers.map((item) => {
      const { schedules, worker_service, ...rest } = item;

      return {
        ...rest,
        schedules: schedules.map((s) => ({
          ...s,
          start_time: format(s.start_time, 'HH:mm'),
          end_time: format(s.end_time, 'HH:mm'),
          break_start_time: s.break_start_time
            ? format(s.break_start_time, 'HH:mm')
            : null,
          break_end_time: s.break_end_time
            ? format(s.break_end_time, 'HH:mm')
            : null,
        })),
        services: worker_service.map((service) => service.service_id),
      };
    });
  } catch (error) {
    throw error;
  }
}
