import { User } from '@clerk/express';
import { PrismaClient } from '@prisma/client';
import { ReserveDto } from '../dto/reserve.dto';
import { BadRequestException } from '@nestjs/common';
import { endOfDay, startOfDay } from 'date-fns';
import { formatTime, getCurrentDay } from 'src/common/utils/availability';

export default async function reserveUseCase(
  prisma: PrismaClient,
  data: ReserveDto,
  user: User,
) {
  const { business_id, worker_id, services, date, start_time, comments } = data;

  const business = await prisma.business.findUnique({
    where: { id: business_id },
  });

  const worker = await prisma.worker.findUnique({
    where: { id: worker_id, business_id },
  });

  if (!business || !worker) {
    throw new BadRequestException({
      message: 'El negocio o trabajador no existe',
    });
  }

  // Obtener las citas del día, pendientes sin expirar o confirmadas y de el trabajador si existe
  const appointments = await prisma.appointment.findMany({
    where: {
      business_id,
      worker_id: worker_id ?? undefined,
      date: {
        gte: startOfDay(date),
        lt: endOfDay(date),
      },
      OR: [
        { status: 'CONFIRMED' },
        { status: 'PENDING', expires_at: { gt: new Date() } },
      ],
    },
    orderBy: { start_time: 'asc' },
    select: {
      id: true,
      start_time: true,
      end_time: true,
    },
  });

  // Obtener día de la fecha seleccionada para la consulta 1 = lunes, 7 = domingo
  const appointmentDay = getCurrentDay(date);

  // Hora de inicio y fin del mapa de horarios disponibles
  let start: string = formatTime(business.open_time_weekday);
  let end: string = formatTime(business.close_time_weekday);

  // Verifica si es fin de semana
  if (appointmentDay >= 6) {
    // Si la fecha de consulta es fin de semana, y el negocio no abre ese día, regresa 0 horarios
    if (!business.open_on_saturday && !business.open_on_sunday) return [];

    // Si es fin de semana según la fecha enviada, y el negocio abre, estable el horario de apertura y cierre con el horario
    // de fin de semana
    if (business.open_on_saturday || business.open_on_sunday) {
      start = formatTime(business.open_time_weekend!);
      end = formatTime(business.close_time_weekend!);
    }
  }
}
