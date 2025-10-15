/**
 * parseStringToDateTime
 * Devuelve la hora normalizada a formato UTC como Date (solo para leer la hora)
 */
export default function parseStringToDateTime(time: string): Date {
  // Validar que tenga formato HH:mm
  if (!/^\d{2}:\d{2}$/.test(time)) {
    throw new Error(`Formato inválido de hora: ${time}`);
  }

  // Normalizamos a fecha base 1970-01-01 (día fijo)
  // Evita dependencias del timezone del servidor
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date(Date.UTC(1970, 0, 1, hours, minutes, 0));

  return date;
}
