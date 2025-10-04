// business/dto/create-business.dto.ts
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 50)
  auth_id: string;

  @IsString()
  @IsEmail()
  @Length(1, 50)
  email: string;

  @IsString()
  @Length(1, 50)
  name: string;

  @IsString()
  @IsOptional()
  @Length(0, 50)
  last_name: string;

  @IsString()
  @IsOptional()
  @Length(0, 15)
  cellphone: string;
}
