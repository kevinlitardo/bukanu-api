import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

export class UpdateConfigurationDto {
  @Type(() => Number)
  @Transform(({ value }) => (isNaN(+value) ? 30 : +value))
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Solo puedes enviar números enteros' },
  )
  @IsPositive({ message: 'Debe ser un número mayor a 0' })
  booking_window_days: number;

  @IsBoolean()
  require_deposit: boolean;

  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El anticipo debe ser un número con máximo 2 decimales' },
  )
  @IsPositive({ message: 'El anticipo debe ser mayor que 0' })
  @IsOptional()
  deposit_required?: number;

  @IsInt()
  @Min(1, { message: 'No puede ser menor de uno' })
  @IsPositive({ message: 'No puede ser cero' })
  appointment_services_limit: number;
}
