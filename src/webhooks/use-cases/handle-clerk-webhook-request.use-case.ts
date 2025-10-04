import { PrismaService } from 'prisma/prisma.service';
import { clerkClient } from '@clerk/express';
import { verifyWebhook } from '@clerk/express/webhooks';
import {
  ForbiddenException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { Request } from 'express';

export async function handleClerkWebhookRequestUseCase(
  prisma: PrismaService,
  req: Request,
) {
  try {
    const evt = await verifyWebhook(req);

    const eventType = evt.type;

    if (eventType === 'user.updated') {
      const data = evt.data;

      await prisma.user.update({
        where: { auth_id: data.id },
        data: {
          name: data.first_name ?? undefined,
          last_name: data.last_name ?? undefined,
          email: data.email_addresses[0].email_address,
          cellphone: data.phone_numbers[0]?.phone_number ?? undefined,
        },
      });
    }

    if (eventType === 'user.deleted') {
      const data = evt.data;

      await prisma.user.delete({ where: { auth_id: data.id } });
    }
  } catch (error) {
    console.log(error);

    if (error.errors) {
      throw new UnprocessableEntityException({
        message: error.errors
          .map((e: { message: string }) => e.message)
          .join('. '),
        errors: error.errors.find((err) => err.code === 'form_password_pwned')
          ? {
              password:
                'Se ha detectado que la contraseña ha sido comprometida en una filtración de datos en línea. Por motivos de seguridad, le recomendamos que utilice una contraseña diferente.',
            }
          : null,
      });
    }

    throw error;
  }
}
