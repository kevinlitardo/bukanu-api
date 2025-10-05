import { PrismaService } from 'prisma/prisma.service';
import slugify from 'src/common/lib/slugify';
import { User } from '@clerk/express';
import { uploadLogo } from 'src/common/lib/upload-logo';
import { UpdateBusinessDto } from '../dto/update-business.dto';
import { deleteLogo } from 'src/common/lib/delete-logo';
import parseStringToDateTime from 'src/common/lib/parse-string-to-datetime';
import { validateBusinessSchedules } from 'src/common/utils/validate-schedules';

export async function updateBusinessUseCase(
  prisma: PrismaService,
  slug: string,
  data: UpdateBusinessDto,
  logo: Express.Multer.File,
  user: User,
): Promise<{ slug: string }> {
  try {
    validateBusinessSchedules({
      open_time_weekday: data.open_time_weekday!,
      close_time_weekday: data.close_time_weekday!,
      open_on_saturday: data.open_on_saturday!,
      open_on_sunday: data.open_on_sunday!,
      open_time_weekend: data.open_time_weekend,
      close_time_weekend: data.close_time_weekend,
    });

    const business = await prisma.business.update({
      where: {
        slug,
        owner: {
          auth_id: user.id,
        },
      },
      data: {
        ...data,
        slug: data.name ? slugify(data.name) : undefined,
        open_time_weekday: data.open_time_weekday
          ? parseStringToDateTime(data.open_time_weekday)
          : undefined,
        close_time_weekday: data.close_time_weekday
          ? parseStringToDateTime(data.close_time_weekday)
          : undefined,
        open_time_weekend: data.open_time_weekend
          ? parseStringToDateTime(data.open_time_weekend)
          : undefined,
        close_time_weekend: data.close_time_weekend
          ? parseStringToDateTime(data.close_time_weekend)
          : undefined,
      },
    });

    if (logo) {
      if (business.logo_url) {
        await deleteLogo(business.logo_url);
      }

      const logo_url = await uploadLogo(logo);

      await prisma.business.update({
        where: { id: business.id },
        data: {
          logo_url,
        },
      });
    }

    return { slug: business.slug };
  } catch (error) {
    throw error;
  }
}
