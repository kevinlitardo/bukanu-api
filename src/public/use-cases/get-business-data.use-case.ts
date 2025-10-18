import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { formatTime } from 'src/common/utils/availability';

export async function getBusinessDataUseCase(
  prisma: PrismaService,
  slug: string,
): Promise<any> {
  try {
    const check = await prisma.business.findFirst({
      where: {
        slug,
        deletedAt: null,
        services: { some: {} },
      },
    });

    if (!check) {
      throw new NotFoundException('El negocio no existe');
    }

    const business = await prisma.business.findUnique({
      where: { slug },
      select: {
        id: true,
        status: true,
        logo_url: true,
        slug: true,
        name: true,
        phone: true,
        description: true,
        address: true,
        location_url: true,
        facebook_url: true,
        instagram_url: true,
        tiktok_url: true,
        open_time_weekend: true,
        close_time_weekday: true,
        open_on_saturday: true,
        open_on_sunday: true,
        open_time_weekday: true,
        close_time_weekend: true,
        services: {
          select: {
            id: true,
            name: true,
            description: true,
            duration: true,
            price: true,
          },
        },
        workers: {
          where: {
            status: 'ACTIVE',
          },
          select: {
            id: true,
            // Info del usuario
            user: {
              select: {
                name: true,
                last_name: true,
              },
            },
            // Info de los servicios que puede dar
            worker_service: {
              where: {
                service: {
                  status: 'ACTIVE',
                },
              },
              select: {
                service: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    duration: true,
                    price: true,
                  },
                },
              },
            },
            // Horarios que tiene asignados
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
          },
        },
        business_config: {
          select: {
            booking_window_days: true,
            require_deposit: true,
            deposit_required: true,
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('El negocio no existe');
    }

    const workersTransformed = {
      ...business,
      open_time_weekday: formatTime(business.open_time_weekday),
      close_time_weekday: formatTime(business.close_time_weekday),
      open_time_weekend: business.open_time_weekend
        ? formatTime(business.open_time_weekend)
        : null,
      close_time_weekend: business.close_time_weekend
        ? formatTime(business.close_time_weekend)
        : null,
      services: business.services.map((s) => ({ ...s, price: s.price / 100 })),
      workers: business.workers?.map(({ worker_service, ...w }) => ({
        ...w,
        services: worker_service.map((s) => ({
          ...s.service,
          price: s.service.price / 100,
        })),
      })),
    };

    return workersTransformed;
  } catch (error) {
    throw error;
  }
}
