import { format } from 'date-fns';
import { PrismaService } from 'prisma/prisma.service';

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
      open_time_weekday: format(business.open_time_weekday, 'HH:mm'),
      close_time_weekday: format(business.close_time_weekday, 'HH:mm'),
      open_time_weekend: business.open_time_weekend
        ? format(business.open_time_weekend, 'HH:mm')
        : null,
      close_time_weekend: business.close_time_weekend
        ? format(business.close_time_weekend, 'HH:mm')
        : null,
      services: business.services.map((service) => service.name),
    }));

    return mapped;
  } catch (error) {
    throw error;
  }
}
