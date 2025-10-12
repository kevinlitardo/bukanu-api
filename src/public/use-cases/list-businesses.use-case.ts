import { PrismaService } from 'prisma/prisma.service';
import { formatTime } from 'src/common/utils/availability';

export async function listBusinessesUseCase(
  prisma: PrismaService,
): Promise<any> {
  try {
    const businesses = await prisma.business.findMany({
      where: {
        status: 'ACTIVE',
        deletedAt: null,
        services: {
          some: {},
        },
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        slug: true,
        name: true,
        phone: true,
        description: true,
        address: true,
        facebook_url: true,
        instagram_url: true,
        tiktok_url: true,
        logo_url: true,
        location_url: true,
        open_time_weekday: true,
        close_time_weekday: true,
        open_on_saturday: true,
        open_on_sunday: true,
        open_time_weekend: true,
        close_time_weekend: true,
        services: { select: { name: true } },
      },
    });

    const mapped = businesses.map((business) => ({
      ...business,
      open_time_weekday: formatTime(business.open_time_weekday),
      close_time_weekday: formatTime(business.close_time_weekday),
      open_time_weekend: business.open_time_weekend
        ? formatTime(business.open_time_weekend)
        : null,
      close_time_weekend: business.close_time_weekend
        ? formatTime(business.close_time_weekend)
        : null,
      services: business.services.map((service) => service.name),
    }));

    return mapped;
  } catch (error) {
    throw error;
  }
}
