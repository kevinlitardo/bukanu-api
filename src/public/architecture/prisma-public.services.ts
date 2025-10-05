import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PublicActions } from './public.actions';
import { listBusinessesUseCase } from '../use-cases/list-businesses.use-case';
import { getBusinessDataUseCase } from '../use-cases/get-business-data.use-case';
import { GetAvailabilityDto } from '../dto/get-availability.dto';
import { getAvailabilityUseCase } from '../use-cases/get-availability.use-case';

@Injectable()
export class PrismaPublicServices implements PublicActions {
  constructor(private prisma: PrismaService) {}

  async listBusinesses(): Promise<any> {
    return listBusinessesUseCase(this.prisma);
  }

  async getBusinessData(slug: string): Promise<any> {
    return getBusinessDataUseCase(this.prisma, slug);
  }

  async getAvailability(data: GetAvailabilityDto): Promise<any> {
    return getAvailabilityUseCase(this.prisma, data);
  }
}
