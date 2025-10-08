// availability.ts
import {
  parse,
  addMinutes,
  differenceInMinutes,
  format,
  isBefore,
} from 'date-fns';

/**
 * parseTimeToDate
 * Convierte "HH:mm" a Date usando la fecha base (por defecto today).
 * NOTA: normalizamos a la fecha que pases (por defecto hoy). Importante
 * para evitar problemas de zona horaria puedes pasar una fecha base controlada.
 */
export function parseTimeToDate(
  time: string,
  baseDate: Date = new Date(),
): Date {
  const parsed = parse(time, 'HH:mm', baseDate);
  return parsed;
}

/**
 * formatTime
 * Formatea un Date a "HH:mm"
 */
export function formatTime(date: Date): string {
  return format(date, 'HH:mm');
}

/**
 * generateTimeSlots
 * Genera un objeto donde las keys son las horas (HH:mm) en intervalos (por defecto 10 min)
 * entre start (inclusive) y end (exclusive).
 *
 * Ejemplo:
 * generateTimeSlots("08:00", "09:00") =>
 * { "08:00": null, "08:10": null, "08:20": null, "08:30": null, "08:40": null, "08:50": null }
 *
 * Nota: elimina la "última hora por defecto" en el sentido que el slot que inicia exactamente en end NO se crea.
 */
export function generateTimeSlots(
  start: string,
  end: string,
  intervalMinutes = 10,
  baseDate: Date = new Date(),
): { [key: string]: string | null } {
  const startDate = parseTimeToDate(start, baseDate);
  const endDate = parseTimeToDate(end, baseDate);

  // seguridad: si start >= end devolvemos objeto vacío
  if (!isBefore(startDate, endDate)) return {};

  const result: { [key: string]: string | null } = {};
  let cursor = startDate;

  while (isBefore(cursor, endDate)) {
    const key = formatTime(cursor);
    result[key] = null;
    cursor = addMinutes(cursor, intervalMinutes);
  }

  return result;
}

/**
 * getRequiredSlotCount
 * Dado un duration en minutos, devuelve la cantidad de slots requeridos según intervalMinutes.
 * Ej: duration = 25, interval=10 => 3 slots (10,10,5 => ceil => 3)
 */
export function getRequiredSlotCount(
  durationInMinutes: number,
  intervalMinutes = 10,
): number {
  if (durationInMinutes <= 0) return 0;
  return Math.ceil(durationInMinutes / intervalMinutes);
}

/**
 * generateTimeRange
 * Genera un array de strings "HH:mm" comenzando en startSlot y con count slots consecutivos
 * cada intervalMinutes minutos.
 *
 * startSlot debe existir en la malla de tiempo (o ser un HH:mm válido).
 */
export function generateTimeRange(
  startSlot: string,
  count: number,
  intervalMinutes = 10,
  baseDate: Date = new Date(),
): string[] {
  if (count <= 0) return [];
  const start = parseTimeToDate(startSlot, baseDate);
  const slots: string[] = [];
  let cursor = start;
  for (let i = 0; i <= count; i++) {
    slots.push(formatTime(cursor));
    cursor = addMinutes(cursor, intervalMinutes);
  }
  return slots;
}

/**
 * getFreeSlots
 * daySlots: objeto generado por generateTimeSlots o con el mismo shape { "HH:mm": null | "ocupado" }
 * slotsRequired: cantidad de slots consecutivos que necesita el servicio
 *
 * Retorna: lista de strings ["08:00", "08:10", ...] que representan los posibles horarios
 * de inicio donde hay consecutivamente `slotsRequired` slots libres (null).
 *
 * NOTA: devuelve el start de cada posible ventana. No devuelve la ventana completa.
 */
export function getFreeSlots(
  slots: { [key: string]: string | null },
  slotsRequired: number,
): string[] {
  const freeSlots: string[][] = [];
  let currentGroup: string[] = [];

  Object.keys(slots)
    .sort()
    .forEach((time) => {
      if (slots[time] === null) {
        currentGroup.push(time);
      } else {
        if (currentGroup.length >= slotsRequired) {
          freeSlots.push(
            currentGroup.slice(0, currentGroup.length - slotsRequired),
          );
        }
        currentGroup = [];
      }
    });

  if (currentGroup.length >= slotsRequired) {
    freeSlots.push(currentGroup.slice(0, currentGroup.length - slotsRequired));
  }

  return freeSlots.flat();
}

/**
 * getCurrentDay
 * Devuelve el número de día de la semana en ese momento, lunes = 1, ..., domingo = 7
 */
export function getCurrentDay(date?: Date) {
  const dia = date ? date.getDay() : new Date().getDay();
  // Si es domingo (0), devuelve 7, de lo contrario, devuelve el día + 1
  return dia === 0 ? 7 : dia;
}
