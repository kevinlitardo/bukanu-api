import { PrismaService } from 'prisma/prisma.service';
import { User } from '@clerk/express';
import { UpdateStatusDto } from '../dto/update-status.dto';

export default async function updateBusinessStatusUseCase(
  prisma: PrismaService,
  slug: string,
  data: UpdateStatusDto,
  user: User,
) {
  try {
    await prisma.business.update({
      where: { slug, owner: { auth_id: user.id } },
      data,
    });
  } catch (error) {
    throw error;
  }
}
