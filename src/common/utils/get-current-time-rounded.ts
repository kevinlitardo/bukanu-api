import { format, setMinutes } from 'date-fns';

/**
 * getCurrentTimeRounded
 * Devuelve la hora actual en formato HH:mm redondeado al inmediato superior como múltiplo de 5
 */
export function getCurrentTimeRounded() {
  const now = new Date();
  const minutes = Math.ceil(now.getMinutes() / 10) * 10;
  const roundedDate = setMinutes(now, minutes);
  return format(roundedDate, 'HH:mm');
}
