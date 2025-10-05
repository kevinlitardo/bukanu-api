import { parse } from 'date-fns';

export default function parseStringToDateTime(time: string) {
  return parse(time, 'HH:mm', new Date());
}
