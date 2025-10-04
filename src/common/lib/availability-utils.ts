/**
 * generateTimeSlots
 * Genera un objeto donde las keys son las horas, en intervalos de 10 minutos
 * entre los parámetros ingresados de inicio y fin.
 * Elimina la última hora por defecto
 */
export function generateTimeSlots(
  start: string,
  end: string,
): { [key: string]: any } {
  const startTime = start.split(':').map(Number);
  const endTime = end.split(':').map(Number);

  const startMinutes = startTime[0] * 60 + startTime[1];
  const endMinutes = endTime[0] * 60 + endTime[1];

  const timeSlots: { [key: string]: any } = {};

  for (let minutes = startMinutes; minutes < endMinutes; minutes += 10) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const timeString = `${String(hours).padStart(2, '0')}:${String(
      mins,
    ).padStart(2, '0')}`;
    timeSlots[timeString] = null; // Puedes reemplazar null con cualquier valor que desees
  }

  return timeSlots;
}

/**
 * generateTimeRange
 * Genera una lista de string tipo tiempo (HH:mm) para poder reemplazar esas keys
 * con los valores de lo que sea que ocupe ese rango de tiempo en el horario general
 */
export function generateTimeRange(start: string, end: string) {
  const startTime = start.split(':').map(Number);
  const endTime = end.split(':').map(Number);

  const startMinutes = startTime[0] * 60 + startTime[1];
  const endMinutes = endTime[0] * 60 + endTime[1];

  let range: string[] = [];

  for (let minutes = startMinutes; minutes <= endMinutes; minutes += 10) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const timeString = `${String(hours).padStart(2, '0')}:${String(
      mins,
    ).padStart(2, '0')}`;
    range.push(timeString);
  }

  return range;
}

/**
 * getRequiredSlotCount
 * Devuelve el total de slots necesarios para el horario como entero múltiplo de 10
 * aproximado al inmediato superior, ej: 15 -> 20
 */
export function getRequiredSlotCount(duration: number): number {
  // Redondear al múltiplo de 10 más cercano (hacia arriba si es necesario)
  const roundedNumber = Math.ceil(duration / 10) * 10;

  // Calcular el número de grupos de 10 unidades
  const groups = roundedNumber / 10;

  return groups;
}

/**
 * getFreeSlots
 * Del objeto "horario", separa en grupos los slots disponibles y verifica que
 * como mínimo cada grupo tenga los slots requeridos enviados como param,
 * de los que lo cumplen, quita la cantidad de slots requeridos para evitar
 * conflictos de sobreposición en otros horarios
 */
function getFreeSlots(
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
