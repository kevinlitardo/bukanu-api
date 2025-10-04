import { User } from '@clerk/express';
import { PrismaService } from 'prisma/prisma.service';

export async function listUserBusinessesUseCase(
  prisma: PrismaService,
  user: User,
): Promise<any> {
  const list = await prisma.business.findMany({
    where: {
      owner: {
        auth_id: user.id,
      },
    },
    select: {
      slug: true,

      logo_url: true,

      name: true,
      phone: true,
      address: true,
      description: true,

      location_url: true,
      facebook_url: true,
      instagram_url: true,
      tiktok_url: true,

      open_time_weekday: true,
      close_time_weekday: true,
      open_on_saturday: true,
      open_on_sunday: true,
      open_time_weekend: true,
      close_time_weekend: true,

      status: true,

      deletedAt: true,

      _count: {
        select: {
          workers: true,
          services: true,
          appointments: true,
        },
      },

      business_config: {
        select: {
          booking_window_days: true,
          appointment_services_limit: true,
          require_deposit: true,
          deposit_required: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  const mapped = list.map(({ _count, ...rest }) => ({
    ...rest,
    workers: _count.workers,
    services: _count.services,
    appointments: _count.appointments,
  }));

  return mapped;
}
