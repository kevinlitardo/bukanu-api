import { PrismaService } from 'prisma/prisma.service';
import { User } from '@clerk/express';
import { UpdateStatusDto } from '../dto/update-status.dto';

export default async function updateServiceStatusUseCase(
  prisma: PrismaService,
  id: string,
  data: UpdateStatusDto,
  user: User,
) {
  try {
    await prisma.service.update({
      where: { id, business: { owner: { auth_id: user.id } } },
      data,
    });
  } catch (error) {
    throw error;
  }
}
