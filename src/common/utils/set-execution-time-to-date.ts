export default function setExecutionTimeToDate(date: Date) {
  const fechaActual = new Date();
  const fechaConHoraEjecucion = new Date(date);
  fechaConHoraEjecucion.setHours(
    fechaActual.getHours(),
    fechaActual.getMinutes(),
    fechaActual.getSeconds(),
    fechaActual.getMilliseconds(),
  );

  return fechaConHoraEjecucion;
}
