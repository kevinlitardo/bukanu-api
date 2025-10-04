import { PrismaService } from 'prisma/prisma.service';
import { User } from '@clerk/express';
import { UpdateConfigurationDto } from '../dto/update-configuration.dto';

export default async function updateBusinessConfigurationUseCase(
  prisma: PrismaService,
  slug: string,
  data: UpdateConfigurationDto,
  user: User,
) {
  try {
    await prisma.business.update({
      where: { slug, owner: { auth_id: user.id } },
      data: {
        business_config: {
          update: {
            ...data,
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
}
