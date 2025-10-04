import { PrismaService } from 'prisma/prisma.service';
import { CreateBusinessDto } from '../dto/create-business.dto';
import getUserByClerkId from 'src/common/utils/get-user-by-clerkid';
import slugify from 'src/common/lib/slugify';
import { User } from '@clerk/express';
import { uploadLogo } from 'src/common/lib/upload-logo';

export async function createBusinessUseCase(
  prisma: PrismaService,
  data: CreateBusinessDto,
  logo: Express.Multer.File,
  user: User,
): Promise<void> {
  const dbUser = await getUserByClerkId(prisma, user.id);

  try {
    const business = await prisma.business.create({
      data: {
        ...data,
        slug: slugify(data.name),
        owner_id: dbUser.id,
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
