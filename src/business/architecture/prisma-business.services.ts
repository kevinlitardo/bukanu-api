import { Injectable } from '@nestjs/common';
import { BusinessActions } from './business.actions';
import { PrismaService } from 'prisma/prisma.service';
import { CreateBusinessDto } from '../dto/create-business.dto';
import { createBusinessUseCase } from '../use-cases/create-business.use-case';
import { listUserBusinessesUseCase } from '../use-cases/list-user-businesses.use-case';
import { User } from '@clerk/express';
import { updateBusinessUseCase } from '../use-cases/update-business.use-case';
import { UpdateBusinessDto } from '../dto/update-business.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';
import updateBusinessStatusUseCase from '../use-cases/update-business-status.use-case';
import deleteBusinessUseCase from '../use-cases/delete-business.use-case';
import restoreBusinessUseCase from '../use-cases/restore-business.use-case';
import { UpdateConfigurationDto } from '../dto/update-configuration.dto';
import updateBusinessConfigurationUseCase from '../use-cases/update-business-configuration.use-case';
import getBusinessDataUseCase from '../use-cases/get-business-data.use-case';

@Injectable()
export class PrismaBusinessServices implements BusinessActions {
  constructor(private prisma: PrismaService) {}

  async listUserBusinesses(user: User): Promise<any> {
    return listUserBusinessesUseCase(this.prisma, user);
  }

  async getBusinessData(slug: string, user: User): Promise<any> {
    return getBusinessDataUseCase(this.prisma, slug, user);
  }

  async create(
    data: CreateBusinessDto,
    logo: Express.Multer.File,
    user: User,
  ): Promise<void> {
    return await createBusinessUseCase(this.prisma, data, logo, user);
  }

  async update(
    slug: string,
    data: UpdateBusinessDto,
    logo: Express.Multer.File,
    user: User,
  ): Promise<{ slug: string }> {
    return await updateBusinessUseCase(this.prisma, slug, data, logo, user);
  }

  async updateStatus(
    slug: string,
    data: UpdateStatusDto,
    user: User,
  ): Promise<void> {
    return await updateBusinessStatusUseCase(this.prisma, slug, data, user);
  }

  async delete(slug: string, user: User): Promise<void> {
    return await deleteBusinessUseCase(this.prisma, slug, user);
  }

  async restore(slug: string, user: User): Promise<void> {
    return await restoreBusinessUseCase(this.prisma, slug, user);
  }

  async updateConfiguration(
    slug: string,
    data: UpdateConfigurationDto,
    user: User,
  ): Promise<void> {
    return await updateBusinessConfigurationUseCase(
      this.prisma,
      slug,
      data,
      user,
    );
  }
}
