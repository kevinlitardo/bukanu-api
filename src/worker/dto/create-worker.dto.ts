import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsString,
  Length,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ScheduleDto } from './schedule.dto';

export class CreateWorkerDto {
  @IsString()
  @Length(1, 60)
  slug: string;

  @IsString()
  @Length(1, 50)
  name: string;

  @IsString()
  @Length(1, 50)
  last_name: string;

  @IsString()
  @Length(1, 14)
  cellphone: string;

  @IsString()
  @Length(1, 50)
  @IsEmail()
  email: string;

  @IsString()
  @Length(1, 50)
  password: string;

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
