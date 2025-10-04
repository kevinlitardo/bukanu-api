import { ACTIVE_STATUS } from '@prisma/client';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';
import { TIEMPO } from 'src/common/lib/regex';

export class ScheduleDto {
  @IsEnum(ACTIVE_STATUS)
  @IsNotEmpty()
  status: ACTIVE_STATUS;

  @IsInt()
  @IsIn([1, 2, 3, 4, 5, 6, 7], {
    message: 'El día debe ser un número entre 1 y 7 (1 = lunes, 7 = domingo)',
  })
  day: number;

  @IsString()
  @Matches(TIEMPO, {
    message: 'La hora de inicio debe estar en formato HH:mm',
  })
  start_time: string;

  @IsString()
  @Matches(TIEMPO, {
    message: 'La hora de fin debe estar en formato HH:mm',
  })
  break_start_time: string;

  @IsString()
  @Matches(TIEMPO, {
    message: 'La hora de fin debe estar en formato HH:mm',
  })
  break_end_time: string;

  @IsString()
  @Matches(TIEMPO, {
    message: 'La hora de fin debe estar en formato HH:mm',
  })
  end_time: string;
}
