import { BadRequestException } from '@nestjs/common';
import { isAfter, isBefore, isEqual, parse } from 'date-fns';
import { ScheduleDto } from 'src/worker/dto/schedule.dto';
import parseStringToDateTime from '../lib/parse-string-to-datetime';

interface BusinessSchedules {
  open_time_weekday: string;
  close_time_weekday: string;
  open_on_saturday: boolean;
  open_on_sunday: boolean;
  open_time_weekend: string | undefined;
  close_time_weekend: string | undefined;
}

export function validateBusinessSchedules({
  open_time_weekday,
  close_time_weekday,
  open_on_saturday,
  open_on_sunday,
  open_time_weekend,
  close_time_weekend,
}: BusinessSchedules) {
  const openAtWeekday = parseStringToDateTime(open_time_weekday);
  const closeAtWeekday = parseStringToDateTime(close_time_weekday);
  const openSaturday = open_on_saturday;
  const openSunday = open_on_sunday;
  const openAtWeekend = open_time_weekend
    ? parseStringToDateTime(open_time_weekend)
    : undefined;
  const closeAtWeekend = close_time_weekend
    ? parseStringToDateTime(close_time_weekend)
    : undefined;

  if (isEqual(openAtWeekday, closeAtWeekday)) {
    throw new BadRequestException({
      message: 'Campos de hora de apertura y cierre incorrectos',
      errors: {
        open_time_weekday: 'Las horas no pueden ser las mismas',
        close_time_weekday: 'Las horas no pueden ser las mismas',
      },
    });
  }

  if (!isBefore(openAtWeekday, closeAtWeekday)) {
    throw new BadRequestException({
      message: 'Campo de hora de apertura incorrecto',
      errors: {
        open_time_weekday: 'La hora de apertura debe ser menor a la de cierre',
      },
    });
  }

  if (openSaturday || openSunday) {
    if (!openAtWeekend) {
      throw new BadRequestException({
        message: 'Campo de hora de apertura en fin de semana incorrecto',
        errors: {
          open_time_weekend: 'Requerido',
        },
      });
    }

    if (!closeAtWeekend) {
      throw new BadRequestException({
        message: 'Campo de hora de cierre en fin de semana incorrecto',
        errors: {
          close_time_weekend: 'Requerido',
        },
      });
    }

    if (isEqual(openAtWeekend, closeAtWeekend)) {
      throw new BadRequestException({
        message:
          'Campos de hora de apertura y cierre en fin de semana incorrectos',
        errors: {
          open_time_weekend: 'Las horas no pueden ser las mismas',
          close_time_weekend: 'Las horas no pueden ser las mismas',
        },
      });
    }

    if (!isBefore(openAtWeekend, closeAtWeekend)) {
      throw new BadRequestException({
        message: 'Campo de hora de apertura en fin de semana incorrecto',
        errors: {
          open_time_weekend:
            'La hora de apertura debe ser menor a la de cierre',
        },
      });
    }
  }
}

interface BusinessRawSchedules {
  open_time_weekday: Date; // 1970-01-01Txx:xxZ
  close_time_weekday: Date; // 1970-01-01Txx:xxZ
  open_on_saturday: boolean;
  open_on_sunday: boolean;
  open_time_weekend: Date | null;
  close_time_weekend: Date | null;
}

/**
 * Valida horarios de un worker contra las horas del negocio y que cada horario tenga sentido en su programación
 */
export function validateWorkerSchedules(
  schedules: {
    day: number; // 1 = lunes ... 7 = domingo
    start_time: string; // HH:mm
    end_time: string; // HH:mm
    break_start_time?: string | null;
    break_end_time?: string | null;
    status: 'ACTIVE' | 'UNACTIVE';
  }[],
  {
    open_time_weekday,
    close_time_weekday,
    open_on_saturday,
    open_on_sunday,
    open_time_weekend,
    close_time_weekend,
  }: BusinessRawSchedules,
) {
  const errors: Record<string, string> = {};

  schedules.forEach((schedule, index) => {
    const {
      day,
      start_time,
      end_time,
      break_start_time,
      break_end_time,
      status,
    } = schedule;

    if (status === 'UNACTIVE') return; // Ignorar horarios inactivos

    // Convertir HH:mm -> Date (normalizado al 1970-01-01 UTC)
    const startAt = parseStringToDateTime(start_time);
    const endAt = parseStringToDateTime(end_time);
    const breakStartAt = break_start_time
      ? parseStringToDateTime(break_start_time)
      : null;
    const breakEndAt = break_end_time
      ? parseStringToDateTime(break_end_time)
      : null;

    // Determinar el horario del negocio según el día
    let openTime = open_time_weekday;
    let closeTime = close_time_weekday;

    if (day === 6) {
      if (!open_on_saturday) {
        errors[`schedules.${index}.status`] = 'El negocio no abre los sábados.';
        return;
      }
      openTime = open_time_weekend!;
      closeTime = close_time_weekend!;
    }

    if (day === 7) {
      if (!open_on_sunday) {
        errors[`schedules.${index}.status`] =
          'El negocio no abre los domingos.';
        return;
      }
      openTime = open_time_weekend!;
      closeTime = close_time_weekend!;
    }

    // === VALIDACIONES LÓGICAS ===

    // 1. Inicio antes que fin
    if (isAfter(startAt, endAt) || isEqual(startAt, endAt)) {
      errors[`schedules.${index}.start_time`] =
        'La hora de entrada debe ser menor que la hora de salida.';
      errors[`schedules.${index}.end_time`] =
        'La hora de salida debe ser mayor que la hora de entrada.';
    }

    // 2. Inicio dentro del horario del negocio
    if (isBefore(startAt, openTime)) {
      errors[`schedules.${index}.start_time`] =
        'La hora de entrada no puede ser antes de la apertura del negocio.';
    }

    // 3. Fin dentro del horario del negocio
    if (isAfter(endAt, closeTime)) {
      errors[`schedules.${index}.end_time`] =
        'La hora de salida no puede ser después del cierre del negocio.';
    }

    // 4. Descansos (si existen)
    if (breakStartAt && breakEndAt) {
      // Inicio de descanso < fin de descanso
      if (
        isAfter(breakStartAt, breakEndAt) ||
        isEqual(breakStartAt, breakEndAt)
      ) {
        errors[`schedules.${index}.break_start_time`] =
          'La hora de inicio del descanso debe ser menor que la de fin.';
        errors[`schedules.${index}.break_end_time`] =
          'La hora de fin del descanso debe ser mayor que la de inicio.';
      }

      // Descanso dentro del turno laboral
      if (isBefore(breakStartAt, startAt) || isAfter(breakEndAt, endAt)) {
        errors[`schedules.${index}.break_start_time`] =
          'El descanso debe estar dentro del horario laboral.';
        errors[`schedules.${index}.break_end_time`] =
          'El descanso debe estar dentro del horario laboral.';
      }

      // 5. Evitar horas idénticas
      const times = [startAt, endAt, breakStartAt, breakEndAt];
      const unique = new Set(times.map((t) => t.getTime()));
      if (unique.size !== times.length) {
        errors[`schedules.${index}.start_time`] =
          'No se permiten horas iguales en el mismo día.';
      }
    }
  });

  if (Object.keys(errors).length > 0) {
    throw new BadRequestException({
      message: 'Error de validación en los horarios',
      errors,
    });
  }
}
