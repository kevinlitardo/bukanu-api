import { ACTIVE_STATUS } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(ACTIVE_STATUS)
  status: ACTIVE_STATUS;
}
