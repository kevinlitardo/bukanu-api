import { PrismaService } from 'prisma/prisma.service';
import { User } from '@clerk/express';

export default async function restoreBusinessUseCase(
  prisma: PrismaService,
  slug: string,
  user: User,
) {
  try {
    await prisma.business.update({
      where: { slug, owner: { auth_id: user.id } },
      data: {
        status: 'ACTIVE',
        deletedAt: null,
      },
    });
  } catch (error) {
    throw error;
  }
}
