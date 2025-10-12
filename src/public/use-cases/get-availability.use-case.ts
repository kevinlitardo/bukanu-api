import { PrismaService } from 'prisma/prisma.service';
import { GetAvailabilityDto } from '../dto/get-availability.dto';
import {
  formatTime,
  generateTimeRange,
  generateTimeSlots,
  getCurrentDay,
  getFreeSlots,
  getRequiredSlotCount,
} from 'src/common/utils/availability';
import { BadRequestException } from '@nestjs/common';
import { differenceInMinutes, endOfDay, startOfDay } from 'date-fns';
import { schedule } from '@prisma/client';

export async function getAvailabilityUseCase(
  prisma: PrismaService,
  data: GetAvailabilityDto,
): Promise<any> {
  const { business_id, worker_id, services, date } = data;

  // Verificar que el negocio exista
  const business = await prisma.business.findUnique({
    where: { id: business_id },
    select: {
      open_time_weekday: true,
      close_time_weekday: true,
      open_on_saturday: true,
      open_on_sunday: true,
      open_time_weekend: true,
      close_time_weekend: true,
      services: {
        select: {
          id: true,
          duration: true,
        },
      },
    },
  });

  if (!business) {
    throw new BadRequestException({ message: 'El negocio no existe' });
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

  // Mapa de horarios disponibles según horario
  let dayTimeSlots = generateTimeSlots(start, end);

  if (worker_id) {
    // Crear mapa de horarios de trabajador según el día de la fecha seleccionada para la consulta {1: {...}, 2: {...}}
    const workerSchedulesMap: Record<
      string,
      Partial<schedule>
    > = schedules.reduce(
      (acc: Record<string, Partial<schedule>>, val: Partial<schedule>) => {
        acc[val.day!] = val;
        return acc;
      },
      {},
    );

    // Horario del día de la fecha seleccionada
    const workerDaySchedule: Partial<schedule> =
      workerSchedulesMap[appointmentDay];

    // Si el horario del día no está activo, regresa 0 horarios disponibles
    if (workerDaySchedule.status === 'UNACTIVE') return [];

    // Si el día de la fecha, está activo para el trabajador, se genera el mapa de horarios según ese horario
    dayTimeSlots = generateTimeSlots(
      formatTime(workerDaySchedule.start_time!),
      formatTime(workerDaySchedule.end_time!),
    );

    // Si el horario del trabajador de el día de la fecha enviada cuenta con breaks, se genera el rango de tiempo que lo usa
    // y se reemplaza en el mapa de horarios para no habilitar esas horas
    if (
      workerDaySchedule.break_start_time &&
      workerDaySchedule.break_end_time
    ) {
      const duration = differenceInMinutes(
        workerDaySchedule.break_start_time,
        workerDaySchedule.break_end_time,
      );

      const breakSlots = generateTimeRange(
        (start = formatTime(workerDaySchedule.break_start_time!)),
        duration,
      );

      breakSlots.forEach((key) => {
        dayTimeSlots[key] = 'break';
      });
    }
  }

  const appointmentsSlots = appointments.map((app) => {
    const duration = differenceInMinutes(app.end_time, app.start_time);
    const slotsRequired = getRequiredSlotCount(duration);
    const slots = generateTimeRange(formatTime(app.start_time), slotsRequired);

    return {
      id: app.id,
      slots,
    };
  });

  appointmentsSlots.forEach((app) =>
    app.slots.forEach((hour) => (dayTimeSlots[hour] = app.id)),
  );

  const slotsRequired = business.services
    .filter((s) => services.includes(s.id))
    .reduce((acc, val) => {
      const { duration } = val;
      const count = getRequiredSlotCount(duration);
      return acc + count;
    }, 0);

  const availableSlots = getFreeSlots(dayTimeSlots, slotsRequired);

  return availableSlots;
}
