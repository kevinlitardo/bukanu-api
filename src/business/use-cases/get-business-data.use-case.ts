import { User } from '@clerk/express';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { formatTime } from 'src/common/utils/availability';

export default async function getBusinessData(
  prisma: PrismaService,
  slug: string,
  user: User,
): Promise<any> {
  const business = await prisma.business.findFirst({
    where: {
      owner: {
        auth_id: user.id,
      },
      slug,
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

      business_config: {
        select: {
          booking_window_days: true,
          require_deposit: true,
          deposit_required: true,
        },
      },

      _count: {
        select: {
          workers: true,
          services: true,
          appointments: true,
        },
      },
    },
  });

  if (!business)
    throw new BadRequestException({ message: 'El negocio no existe' });

  const { _count, ...rest } = business;

  const dataFixed = {
    ...rest,
    open_time_weekday: formatTime(business.open_time_weekday),
    close_time_weekday: formatTime(business.close_time_weekday),
    open_time_weekend: business.open_time_weekend
      ? formatTime(business.open_time_weekend)
      : null,
    close_time_weekend: business.close_time_weekend
      ? formatTime(business.close_time_weekend)
      : null,
    workers: _count.workers,
    services: _count.services,
    appointments: _count.appointments,
  };

  return dataFixed;
}
