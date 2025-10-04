import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ScheduleDto } from './schedule.dto';

export class UpdateWorkerDto {
  @IsArray()
  @ArrayMinSize(7, { message: 'Debes enviar los 7 días de la semana' })
  @ArrayMaxSize(7, { message: 'Solo se permiten los 7 días de la semana' })
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  schedules: ScheduleDto[];

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, {
    message: 'Debes asignar al menos un servicio para este trabajador',
  })
  services: string[];
}
