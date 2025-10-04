import { PrismaService } from 'prisma/prisma.service';
import slugify from 'src/common/lib/slugify';
import { User } from '@clerk/express';
import { uploadLogo } from 'src/common/lib/upload-logo';
import { UpdateBusinessDto } from '../dto/update-business.dto';
import { deleteLogo } from 'src/common/lib/delete-logo';

export async function updateBusinessUseCase(
  prisma: PrismaService,
  slug: string,
  data: UpdateBusinessDto,
  logo: Express.Multer.File,
  user: User,
): Promise<{ slug: string }> {
  try {
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
