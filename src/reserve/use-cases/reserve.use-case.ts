import { User } from '@clerk/express';
import { PrismaClient } from '@prisma/client';
import { ReserveDto } from '../dto/reserve.dto';
import verifyAvailableSlots from 'src/common/utils/verify-available-slots';
import { BadRequestException } from '@nestjs/common';
import getUserByClerkId from 'src/common/utils/get-user-by-clerkid';
import parseStringToDateTime from 'src/common/lib/parse-string-to-datetime';
import { addMinutes } from 'date-fns';
import { formatTime } from 'src/common/utils/availability';

export default async function reserveUseCase(
  prisma: PrismaClient,
  data: ReserveDto,
  user: User,
) {
  const dbUser = await getUserByClerkId(prisma, user.id);

  // Validar que no tenga más citas agendadas con el mismo negocio
  // Validar en caso que el negocio requiera anticipo y guardar como pending

  const { business_id, worker_id, service_id, date, start_time } = data;

  const { service, worker, availableSlots } = await verifyAvailableSlots(
    prisma,
    {
      business_id,
      worker_id,
      service_id,
      date,
    },
  );

  if (!availableSlots.includes(start_time)) {
    throw new BadRequestException({
      message: 'El horario seleccionado no está disponibles',
    });
  }

  const startTime = parseStringToDateTime(start_time);
  const startTimePlusDuration = addMinutes(startTime, service?.duration!);
  const end_time = parseStringToDateTime(formatTime(startTimePlusDuration));

  await prisma.appointment.create({
    data: {
      status: 'CONFIRMED',
      date,
      start_time: startTime,
      end_time,
      client_name: `${user.firstName} ${user.lastName ?? ''}`.trim(),
      worker_name: worker
        ? `${worker.user.name} ${worker.user.last_name}`.trim()
        : undefined,

      business_id,
      worker_id,
      user_id: dbUser.id,
      service_id,
    },
  });
}
