import { ArrayMinSize, IsArray, IsIn, IsString, Length } from 'class-validator';

export class UpdateWorkerDto {
  @IsString()
  @Length(1, 60)
  slug: string;

  @IsIn([1, 2, 3, 4, 5, 6, 7], {
    each: true,
    message: 'Los días deben ser números entre 1 y 7',
  })
  work_days: number[];

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, {
    message: 'Debes asignar al menos un servicio para este trabajador',
  })
  services: string[];
}
