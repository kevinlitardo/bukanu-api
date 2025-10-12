export default function combineDateUTCTime(date: Date, time: Date) {
  const combined = new Date(date);
  combined.setUTCHours(time.getUTCHours(), time.getUTCMinutes(), 0, 0);
  return combined;
}
