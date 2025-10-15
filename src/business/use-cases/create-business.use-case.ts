import { PrismaService } from 'prisma/prisma.service';
import { CreateBusinessDto } from '../dto/create-business.dto';
import getUserByClerkId from 'src/common/utils/get-user-by-clerkid';
import slugify from 'src/common/lib/slugify';
import { User } from '@clerk/express';
import { uploadLogo } from 'src/common/lib/upload-logo';
import parseStringToDateTime from 'src/common/lib/parse-string-to-datetime';
import { validateBusinessSchedules } from 'src/common/utils/validate-schedules';

export async function createBusinessUseCase(
  prisma: PrismaService,
  data: CreateBusinessDto,
  logo: Express.Multer.File,
  user: User,
): Promise<void> {
  try {
    const dbUser = await getUserByClerkId(prisma, user.id);

    validateBusinessSchedules({
      open_time_weekday: data.open_time_weekday,
      close_time_weekday: data.close_time_weekday,
      open_on_saturday: data.open_on_saturday,
      open_on_sunday: data.open_on_sunday,
      open_time_weekend: data.open_time_weekend,
      close_time_weekend: data.close_time_weekend,
    });

    const business = await prisma.business.create({
      data: {
        ...data,
        slug: slugify(data.name),
        owner_id: dbUser.id,
        open_time_weekday: parseStringToDateTime(data.open_time_weekday),
        close_time_weekday: parseStringToDateTime(data.close_time_weekday),
        open_time_weekend: data.open_time_weekend
          ? parseStringToDateTime(data.open_time_weekend)
          : undefined,
        close_time_weekend: data.close_time_weekend
          ? parseStringToDateTime(data.close_time_weekend)
          : undefined,
        business_config: {
          create: {},
        },
      },
    });

    if (logo) {
      const logo_url = await uploadLogo(logo);

      await prisma.business.update({
        where: { id: business.id },
        data: {
          logo_url,
        },
      });
    }

    return;
  } catch (error) {
    throw error;
  }
}
