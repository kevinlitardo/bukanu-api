import { PrismaService } from 'prisma/prisma.service';
import { User } from '@clerk/express';
import { UpdateStatusDto } from '../dto/update-status.dto';

export async function updateStatusUseCase(
  prisma: PrismaService,
  id: string,
  data: UpdateStatusDto,
  user: User,
) {
  try {
    const { status } = data;

    await prisma.worker.update({
      where: {
        id,
        business: {
          owner: {
            auth_id: user.id,
          },
        },
      },
      data: { status },
    });
  } catch (error) {
    throw error;
  }
}
