import { Type } from 'class-transformer';
import {
  IsNumber,
  IsPositive,
  IsString,
  Length,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

export function IsMultipleOfFive(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isMultipleOfFive',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'number' && value % 5 === 0;
        },
        defaultMessage() {
          return 'El número debe ser múltiplo de 5';
        },
      },
    });
  };
}

export class CreateServiceDto {
  @IsString()
  @Length(1, 60)
  slug: string;

  @IsString()
  @Length(1, 60)
  name: string;

  @IsString()
  @Length(1, 200)
  description: string;

  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser un número con máximo 2 decimales' },
  )
  @IsPositive({ message: 'El precio debe ser mayor que 0' })
  price: number;

  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Solo puedes enviar números enteros' },
  )
  @IsPositive({ message: 'La duración debe ser mayor que 0' })
  @IsMultipleOfFive()
  duration: number;
}
