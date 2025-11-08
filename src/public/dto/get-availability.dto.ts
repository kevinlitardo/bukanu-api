import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class GetAvailabilityDto {
  @IsString()
  business_id: string;

  @IsString()
  @IsOptional()
  worker_id?: string;

  @IsString()
  service_id: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;
}
