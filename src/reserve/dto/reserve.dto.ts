import { Transform } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { TIEMPO } from 'src/common/lib/regex';

export class ReserveDto {
  @IsString()
  business_id: string;

  @IsString()
  @IsOptional()
  worker_id?: string;

  @IsString()
  service: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;

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
