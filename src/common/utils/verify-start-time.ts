import { isBefore, isSameDay } from 'date-fns';
import { getCurrentTimeRounded } from './get-current-time-rounded';
import parseStringToDateTime from '../lib/parse-string-to-datetime';

export default function verifyStartTime(
  appointmentDate: Date,
  startTime: Date,
) {
  // Si la consulta es el mismo día, se debe verificar si la hora de la consulta es
  // antes o después de la hora de apertura / entrada, si es así devuelve la hora
  // de apertura / entrada o la hora actual al inmediato superior múltiplo de 10
  // para no mostrar horas previas y evitar errores de agendamiento.
  if (isSameDay(appointmentDate, new Date())) {
    if (isBefore(appointmentDate, startTime)) {
      return startTime;
    } else {
      return parseStringToDateTime(getCurrentTimeRounded());
    }
  }

  return startTime;
}
