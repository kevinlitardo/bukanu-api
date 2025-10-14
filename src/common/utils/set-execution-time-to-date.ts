export default function setExecutionTimeToDate(date: Date) {
  const exectutionTime = new Date();
  const hours = exectutionTime.getHours();
  const minutes = exectutionTime.getMinutes();
  const datePlusCurrentTime = new Date(Date.UTC(1970, 0, 1, hours, minutes, 0));

  return datePlusCurrentTime;
}
