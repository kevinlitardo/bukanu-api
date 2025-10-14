import { User } from '@clerk/express';
import { PrismaClient, schedule } from '@prisma/client';
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

  // Para guardar los horarios del trabajador seleccionado si existe
  let schedules: Partial<schedule>[] = [];

  // Verificar que el trabajador exista y guardar sus horarios
  if (worker_id) {
    const worker = await prisma.worker.findUnique({
      where: { id: worker_id, business_id },
      select: {
        schedules: {
          select: {
            status: true,
            day: true,
            start_time: true,
            end_time: true,
            break_start_time: true,
            break_end_time: true,
          },
        },
      },
    });

    if (!worker) {
      throw new BadRequestException({ message: 'El trabajador no existe' });
    }

    schedules = worker.schedules;
  }
}
