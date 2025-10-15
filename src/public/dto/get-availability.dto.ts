import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetAvailabilityDto {
  @IsString()
  business_id: string;

  @IsString()
  @IsOptional()
  worker_id?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'Debes seleccionar al menos un servicio' })
  services: string[];

  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;
}
