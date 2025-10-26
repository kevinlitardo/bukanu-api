import { User } from '@clerk/express';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';

export abstract class ServiceActions {
  abstract list(slug: string, user: User): Promise<any>;
  abstract getById(slug: string, id: string, user: User): Promise<any>;
  abstract create(data: CreateServiceDto, user: User): Promise<any>;
  abstract update(id: string, data: UpdateServiceDto, user: User): Promise<any>;
  abstract updateStatus(
    id: string,
    data: UpdateStatusDto,
    user: User,
  ): Promise<any>;
  abstract delete(id: string, user: User): Promise<any>;
}
