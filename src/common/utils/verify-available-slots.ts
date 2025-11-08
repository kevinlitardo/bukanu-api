import { BadRequestException } from '@nestjs/common';
import {
  ACTIVE_STATUS,
  PrismaClient,
  service,
  user,
  worker,
  worker_service,
} from '@prisma/client';
import setExecutionTimeToDate from './set-execution-time-to-date';
import {
  generateTimeRange,
  generateTimeSlots,
  getCurrentDay,
  getFreeSlots,
  getRequiredSlotCount,
} from './availability';
import {
  differenceInMinutes,
  endOfDay,
  isAfter,
  isSameDay,
  startOfDay,
} from 'date-fns';
import parseStringToDateTime from '../lib/parse-string-to-datetime';
import { getCurrentTimeRounded } from './get-current-time-rounded';

/**
 * Pasos para verificar un horario SI NO HAY TRABAJADORES
 * 1. Armar horario del día seleccionado
 * 2. Listar todas las citas para ese día
 * 2. Completar horario según citas
 * 3. Devolver horas libres si cumplen con los slots necesario según el servicio solicitado
 */

/**
 * Pasos para verificar un horario SI HAY TRABAJADORES
 * 1. Armar horario del día seleccionado
 * 2. Listar todas las citas para ese día con ese servicio
 * 2. Completar horas con citas según uso
 * 3. Buscar trabajadores que den el servicio solicitado y atiendan ese día
 * 3. Devolver horas libres si cumplen con los slots necesario según el servicio solicitado
 */

interface Props {
  business_id: string;
  worker_id?: string;
  service_id: string;
  date: Date;
}

type WorkerConUsuario = {
  id: string;
  status: ACTIVE_STATUS;
  work_days: number[];
  user: {
    name: string;
    last_name: string;
  };
  worker_service: { service_id: string }[];
};

export default async function verifyAvailableSlots(
  prisma: PrismaClient,
  { business_id, worker_id, service_id, date }: Props,
): Promise<{
  service: Partial<service>;
  worker: WorkerConUsuario | null;
  availableSlots: string[];
}> {
  // Fecha para la cita manipulada con la hora de ejecución
  const appointmentDate = setExecutionTimeToDate(date);

  // Obtener día de la fecha seleccionada para la consulta 1 = lunes, 7 = domingo
  const appointmentDay = getCurrentDay(date);

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
      workers: {
        where: {
          id: worker_id,
        },
        select: {
          id: true,
          status: true,
          work_days: true,
          user: {
            select: {
              name: true,
              last_name: true,
            },
          },
          worker_service: {
            select: {
              service_id: true,
            },
          },
        },
      },
      services: {
        where: {
          id: service_id,
        },
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

  const worker = business.workers.find((w) => w.id === worker_id) ?? null;
  const service = business.services[0];

  if (business.status === 'UNACTIVE') {
    return {
      service,
      worker: null,
      availableSlots: [],
    };
  }

  if (worker_id && !worker) {
    throw new BadRequestException({
      message: 'El trabajador no existe',
    });
  }

  if (worker) {
    if (worker.status !== 'ACTIVE') {
      return {
        service,
        worker,
        availableSlots: [],
      };
    }

    if (!worker.worker_service.map((s) => s.service_id).includes(service_id)) {
      return {
        service,
        worker,
        availableSlots: [],
      };
    }

    if (!worker.work_days.includes(appointmentDay)) {
      return {
        service,
        worker,
        availableSlots: [],
      };
    }
  }

  if (!service) {
    throw new BadRequestException({
      message: 'El servicio no existe',
    });
  }

  // Hora de inicio y fin del mapa de horarios disponibles
  let start: Date = business.open_time_weekday;
  let end: Date = business.close_time_weekday;

  // Verifica si la fecha para el appointment es fin de semana y si el negocio abre
  if (
    appointmentDay >= 6 &&
    (business.open_on_saturday || business.open_on_sunday)
  ) {
    start = business.open_time_weekend!;
    end = business.close_time_weekend!;
  }

  // Si la consulta es en el mismo día verifica si...
  if (isSameDay(date, new Date())) {
    // La hora es después del cierre, no regresa horarios
    if (isAfter(appointmentDate.getTime(), end.getTime())) {
      return {
        service,
        worker,
        availableSlots: [],
      };
    }

    // La hora es después de la apertura, regresa la hora más próxima como múltiplo de 10
    if (isAfter(appointmentDate.getTime(), start.getTime())) {
      start = parseStringToDateTime(getCurrentTimeRounded());
    }
  }

  // Mapa de horarios disponibles según horario
  let dayTimeSlots = generateTimeSlots(start, end);

  // Obtener las citas del día, pendientes sin expirar o confirmadas y de el trabajador si existe
  const appointments = await prisma.appointment.findMany({
    where: {
      business_id,
      // worker_id: worker_id ?? undefined,
      date: {
        gte: startOfDay(date),
        lte: endOfDay(date),
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

  const slotsRequired = getRequiredSlotCount(service.duration);

  const availableSlots = getFreeSlots(dayTimeSlots, slotsRequired);

  return { service, worker, availableSlots };
}
