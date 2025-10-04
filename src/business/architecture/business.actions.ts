import { User } from '@clerk/express';
import { CreateBusinessDto } from '../dto/create-business.dto';
import { UpdateBusinessDto } from '../dto/update-business.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';
import { UpdateConfigurationDto } from '../dto/update-configuration.dto';

export abstract class BusinessActions {
  abstract listUserBusinesses(user: User): Promise<any>;
  abstract create(
    data: CreateBusinessDto,
    logo: Express.Multer.File,
    user: User,
  ): Promise<void>;
  abstract update(
    slug: string,
    data: UpdateBusinessDto,
    logo: Express.Multer.File,
    user: User,
  ): Promise<{ slug: string }>;
  abstract updateStatus(
    slug: string,
    data: UpdateStatusDto,
    user: User,
  ): Promise<void>;
  abstract delete(slug: string, user: User): Promise<void>;
  abstract restore(slug: string, user: User): Promise<void>;
  abstract updateConfiguration(
    slug: string,
    data: UpdateConfigurationDto,
    user: User,
  ): Promise<void>;
}
