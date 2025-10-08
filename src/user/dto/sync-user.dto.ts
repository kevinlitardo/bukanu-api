import { IsString, MinLength } from 'class-validator';

export class SyncUserDto {
  @IsString()
  @MinLength(1, { message: 'La zona horaria es requerida' })
  timezone: string;
}
