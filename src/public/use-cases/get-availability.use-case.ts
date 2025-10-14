import { PrismaService } from 'prisma/prisma.service';
import { GetAvailabilityDto } from '../dto/get-availability.dto';
import {
  generateTimeRange,
  generateTimeSlots,
  getCurrentDay,
  getFreeSlots,
  getRequiredSlotCount,
} from 'src/common/utils/availability';
import { BadRequestException } from '@nestjs/common';
import {
  differenceInMinutes,
  endOfDay,
  isAfter,
  isSameDay,
  startOfDay,
} from 'date-fns';
import { getCurrentTimeRounded } from 'src/common/utils/get-current-time-rounded';
import parseStringToDateTime from 'src/common/lib/parse-string-to-datetime';
import setExecutionTimeToDate from 'src/common/utils/set-execution-time-to-date';

export async function getAvailabilityUseCase(
  prisma: PrismaService,
  data: GetAvailabilityDto,
): Promise<any> {
  const { business_id, worker_id, services, date } = data;

  // Verificar que el negocio exista
  const business = await prisma.business.findUnique({
    where: { id: business_id },
    select: {
      status: true,
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

  if (business.status === 'UNACTIVE') return [];

  // Fecha para la cita manipulada con la hora de ejecución
  const appointmentDate = setExecutionTimeToDate(date);

  // Obtener día de la fecha seleccionada para la consulta 1 = lunes, 7 = domingo
  const appointmentDay = getCurrentDay(date);

  // Hora de inicio y fin del mapa de horarios disponibles
  let start: Date = business.open_time_weekday;
  let end: Date = business.close_time_weekday;

  // Para guardar los horarios del trabajador seleccionado si existe
  let breakSlots: string[] = [];

  // Verifica si la fecha para el appointment es fin de semana y si el negocio abre
  if (
    appointmentDay >= 6 &&
    (business.open_on_saturday || business.open_on_sunday)
  ) {
    start = business.open_time_weekend!;
    end = business.close_time_weekend!;
  }

  // Verificar que el trabajador exista y establece el horario según el día
  // de la fecha para el appointment
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

    const schedule = worker.schedules.find((s) => s.day === appointmentDay)!;

    if (schedule.status === 'UNACTIVE') return [];

    if (schedule.break_start_time && schedule.break_end_time) {
      const duration = differenceInMinutes(
        schedule.break_start_time,
        schedule.break_end_time,
      );

      breakSlots = generateTimeRange(schedule!.break_start_time!, duration);
    }

    start = schedule.start_time;
    end = schedule.end_time;
  }

  // Si la consulta es en el mismo día verifica si...
  if (isSameDay(date, new Date())) {
    // La hora es después del cierre, no regresa horarios
    if (isAfter(appointmentDate.getTime(), end.getTime())) return [];
    // La hora es después de la apertura, regresa la hora próxima como múltiplo de 10
    if (isAfter(appointmentDate.getTime(), start.getTime())) {
      start = parseStringToDateTime(getCurrentTimeRounded());
    }
  }

  // Mapa de horarios disponibles según horario
  let dayTimeSlots = generateTimeSlots(start, end);

  breakSlots.forEach((key) => {
    dayTimeSlots[key] = 'break';
  });

  // Obtener las citas del día, pendientes sin expirar o confirmadas y de el trabajador si existe
  const appointments = await prisma.appointment.findMany({
    where: {
      business_id,
      worker_id: worker_id ?? undefined,
      date: {
        gte: startOfDay(appointmentDate),
        lte: endOfDay(appointmentDate),
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

  const appointmentsSlots = appointments.map((app) => {
    const duration = differenceInMinutes(app.end_time, app.start_time);
    const slotsRequired = getRequiredSlotCount(duration);
    const slots = generateTimeRange(app.start_time, slotsRequired);

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
