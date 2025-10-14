import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class UpdateConfigurationDto {
  @IsInt()
  @IsIn([10, 15, 30], {
    message: 'Solo pueden ser 10, 15 o 30 días',
  })
  booking_window_days: number;

  @IsInt()
  @IsIn([1, 2, 3], {
    message: 'Solo pueden ser 1, 2 o 3 servicios',
  })
  appointment_services_limit: number;

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
}
