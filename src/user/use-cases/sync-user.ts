import { PrismaService } from 'prisma/prisma.service';
import { User } from '@clerk/express';

export async function syncUser(
  prisma: PrismaService,
  user: User,
): Promise<void> {
  const dbUser = await prisma.user.findFirst({ where: { auth_id: user.id } });

  if (!dbUser) {
    await prisma.user.create({
      data: {
        auth_id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        name: user.firstName ?? '',
        last_name: user.lastName || '',
        cellphone: user.phoneNumbers[0]?.phoneNumber || '',
      },
    });
  }
}
