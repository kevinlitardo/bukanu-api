import { Injectable } from '@nestjs/common';
import { ServiceActions } from './service.actions';
import { User } from '@clerk/express';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import listServicesUseCase from '../use-cases/list-services.use-case';
import createServiceUseCase from '../use-cases/create-service.use-case';
import updateServiceUseCase from '../use-cases/update-service.use-case';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateStatusDto } from '../dto/update-status.dto';
import updateServiceStatusUseCase from '../use-cases/update-service-status.use-case';
import { deleteServiceUseCase } from '../use-cases/delete-service.use-case';
import getServiceByIdUseCase from '../use-cases/get-service-by-id.use-case';

@Injectable()
export class PrismaServiceServices implements ServiceActions {
  constructor(private prisma: PrismaService) {}

  async list(slug: string, user: User): Promise<any> {
    return await listServicesUseCase(this.prisma, slug, user);
  }

  async getById(slug: string, id: string, user: User): Promise<any> {
    return await getServiceByIdUseCase(this.prisma, slug, id, user);
  }

  async create(data: CreateServiceDto, user: User): Promise<any> {
    return await createServiceUseCase(this.prisma, data, user);
  }

  async update(id: string, data: UpdateServiceDto, user: User): Promise<any> {
    return await updateServiceUseCase(this.prisma, id, data, user);
  }

  async updateStatus(
    id: string,
    data: UpdateStatusDto,
    user: User,
  ): Promise<any> {
    return await updateServiceStatusUseCase(this.prisma, id, data, user);
  }

  async delete(id: string, user: User): Promise<any> {
    return await deleteServiceUseCase(this.prisma, id, user);
  }
}
