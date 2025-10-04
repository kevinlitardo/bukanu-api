import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { TIEMPO } from 'src/common/lib/regex';

export class GetAvailabilityDto {
  @IsString()
  business_id: string;

  @IsString()
  @IsOptional()
  worker_id?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'Debes seleccionar al menos un servicio' })
  services: string;

  @IsDate()
  date: string;

  @IsString()
  @Matches(TIEMPO, {
    message: 'Debe ser un formato de tiempo válido, Ej: 08:00',
  })
  start_time: string;

  @IsString()
  @MaxLength(200, { message: 'Máximo 200 caracteres' })
  @IsOptional()
  comments?: string;
}
