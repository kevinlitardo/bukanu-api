import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { TIEMPO } from 'src/common/lib/regex';

export class CreateBusinessDto {
  @IsOptional()
  logo?: Express.Multer.File;

  @IsString()
  @Length(1, 50)
  name: string;

  @IsString()
  @Length(1, 14)
  phone: string;

  @IsString()
  @Length(1, 100)
  address: string;

  @IsString()
  @Length(1, 500)
  description: string;

  @IsString()
  @Matches(/^(https:\/\/(www\.)?maps.app.goo\.gl\/.+)$/, {
    message: 'Debe ser un url de Google Maps válido',
  })
  @Length(0, 100)
  @IsOptional()
  location_url?: string;

  @IsString()
  @Matches(/^(https:\/\/(www\.)?facebook\.com\/.+)$/, {
    message: 'Debe ser un url de Facebook válido',
  })
  @Length(0, 100)
  @IsOptional()
  facebook_url?: string;

  @IsString()
  @Matches(/^(https:\/\/(www\.)?instagram\.com\/.+)$/, {
    message: 'Debe ser un url de Facebook válido',
  })
  @Length(0, 100)
  @IsOptional()
  instagram_url?: string;

  @IsString()
  @Matches(/^(https:\/\/(www\.)?tiktok\.com\/.+)$/, {
    message: 'Debe ser un url de Tiktok válido',
  })
  @Length(0, 100)
  @IsOptional()
  tiktok_url?: string;

  @IsString()
  @Matches(TIEMPO, {
    message: 'Debe ser un formato de tiempo válido, Ej: 08:00',
  })
  @Length(1, 5)
  open_time_weekday: string;

  @IsString()
  @Matches(TIEMPO, {
    message: 'Debe ser un formato de tiempo válido, Ej: 08:00',
  })
  @Length(1, 5)
  close_time_weekday: string;

  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    return false;
  })
  open_on_saturday: boolean;

  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    return false;
  })
  open_on_sunday: boolean;

  @IsString()
  @Matches(TIEMPO, {
    message: 'Debe ser un formato de tiempo válido, Ej: 08:00',
  })
  @Length(0, 5)
  @IsOptional()
  open_time_weekend: string;

  @IsString()
  @Matches(TIEMPO, {
    message: 'Debe ser un formato de tiempo válido, Ej: 08:00',
  })
  @Length(0, 5)
  @IsOptional()
  close_time_weekend: string;
}
