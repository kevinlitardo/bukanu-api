import { PrismaService } from 'prisma/prisma.service';
import { CreateWorkerDto } from '../dto/create-worker.dto';
import { clerkClient, User } from '@clerk/express';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import parseStringToDateTime from 'src/common/lib/parse-string-to-datetime';
import { validateWorkerSchedules } from 'src/common/utils/validate-schedules';

export async function createWorkerUseCase(
  prisma: PrismaService,
  data: CreateWorkerDto,
  user: User,
) {
  const { email, cellphone, schedules } = data;

  validateWorkerSchedules(schedules);

  let clerkUser: User | undefined;

  try {
    const exists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { cellphone }],
      },
    });

    if (exists) {
      const errors: Record<string, string> = {};

      if (exists.email === email) {
        errors.email = 'Ya existe';
      }
      if (exists.cellphone === cellphone) {
        errors.cellphone = 'Ya existe';
      }
      throw new ConflictException({
        message: 'Hay valores repetidos que ya existen',
        errors,
      });
    }

    clerkUser = await clerkClient.users.createUser({
      firstName: data.name,
      lastName: data.last_name,
      emailAddress: [data.email],
      password: data.password,
    });

    if (!clerkUser) {
      throw new ServiceUnavailableException(
        'No se pudo crear el usuario en Clerk',
      );
    }

    const business = await prisma.business.findFirst({
      where: {
        slug: data.slug,
        owner: { auth_id: user.id },
      },
    });

    if (!business) throw new NotFoundException('El negocio no existe');

    await prisma.worker.create({
      data: {
        business: {
          connect: { id: business.id },
        },
        user: {
          create: {
            auth_id: clerkUser.id,
            email: data.email,
            name: data.name,
            last_name: data.last_name,
            cellphone: data.cellphone,
          },
        },
        schedules: {
          create: data.schedules.map((s) => ({
            ...s,
            start_time: parseStringToDateTime(s.start_time),
            end_time: parseStringToDateTime(s.end_time),
            break_start_time: s.break_start_time
              ? parseStringToDateTime(s.break_start_time)
              : null,
            break_end_time: s.break_end_time
              ? parseStringToDateTime(s.break_end_time)
              : null,
          })),
        },
        worker_service: {
          create: data.services.map((service_id) => ({
            service: {
              connect: { id: service_id },
            },
          })),
        },
      },
    });
  } catch (error) {
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

    if (clerkUser) {
      try {
        await clerkClient.users.deleteUser(clerkUser.id);
      } catch (error) {
        throw new InternalServerErrorException(
          'El usuario se creó en Clerk pero no se pudo borrar',
        );
      }
    }

    throw error;
  }
}
