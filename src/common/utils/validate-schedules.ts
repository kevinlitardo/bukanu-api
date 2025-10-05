import { BadRequestException } from '@nestjs/common';
import { isBefore, isEqual, parse } from 'date-fns';
import { ScheduleDto } from 'src/worker/dto/schedule.dto';

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
  const openAtWeekday = parse(open_time_weekday, 'HH:mm', new Date());
  const closeAtWeekday = parse(close_time_weekday, 'HH:mm', new Date());
  const openSaturday = open_on_saturday;
  const openSunday = open_on_sunday;
  const openAtWeekend = open_time_weekend
    ? parse(open_time_weekend, 'HH:mm', new Date())
    : undefined;
  const closeAtWeekend = close_time_weekend
    ? parse(close_time_weekend, 'HH:mm', new Date())
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

export function validateWorkerSchedules(schedules: ScheduleDto[]) {
  const errors: any = {};

  schedules.forEach(
    ({ start_time, end_time, break_start_time, break_end_time }, index) => {
      const startAt = parse(start_time, 'HH:mm', new Date());
      const endAt = parse(end_time, 'HH:mm', new Date());

      // Verifica que startAt sea menor que endAt
      if (startAt.getTime() >= endAt.getTime()) {
        errors[`schedules.${index}.start_time`] =
          'La hora de entrada debe ser menor que la de salida';
        errors[`schedules.${index}.end_time`] =
          'La hora de salida debe ser mayor que la de entrada';
      }

      // Verifica que breakStartAt y breakEndAt sean válidos si están presentes
      if (break_start_time && break_end_time) {
        const breakStartAt = parse(break_start_time, 'HH:mm', new Date());
        const breakEndAt = parse(break_end_time, 'HH:mm', new Date());

        // Verifica que breakStartAt sea menor que breakEndAt
        if (breakStartAt.getTime() >= breakEndAt.getTime()) {
          errors[`schedules.${index}.break_start_time`] =
            'La hora de inicio de descanso debe ser menor que la hora de fin de descanso';
          errors[`schedules.${index}.break_end_time`] =
            'La hora de fin de descanso debe ser mayor que la hora de inicio de descanso';
        }

        // Verifica que breakEndAt sea menor que endAt
        if (breakEndAt.getTime() >= endAt.getTime()) {
          errors[`schedules.${index}.break_end_time`] =
            'La hora de fin de descanso debe ser menor que la hora de salida';
        }

        // Verifica que breakStartAt esté dentro del horario laboral
        if (
          breakStartAt.getTime() < startAt.getTime() ||
          breakStartAt.getTime() >= endAt.getTime()
        ) {
          errors[`schedules.${index}.break_start_time`] =
            'La hora de inicio de descanso debe estar dentro del horario laboral';
        }

        // Verifica que breakEndAt esté dentro del horario laboral
        if (
          breakEndAt.getTime() <= startAt.getTime() ||
          breakEndAt.getTime() > endAt.getTime()
        ) {
          errors[`schedules.${index}.break_end_time`] =
            'La hora de fin de descanso debe estar dentro del horario laboral';
        }

        // Verifica que no haya horas iguales
        const horas = [startAt, endAt];
        if (break_start_time)
          horas.push(parse(break_start_time, 'HH:mm', new Date()));
        if (break_end_time)
          horas.push(parse(break_end_time, 'HH:mm', new Date()));
        const horasUnicas = new Set(horas.map((hora) => hora.getTime()));
        if (horasUnicas.size !== horas.length) {
          errors[`schedules.${index}.start_time`] =
            'No se permiten horas iguales';
        }
      }
    },
  );

  if (Object.keys(errors).length > 0) {
    throw new BadRequestException({ errors });
  }
}
