import { User } from '@clerk/express';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { ReserveActions } from './reserve.actions';
import { ReserveDto } from '../dto/reserve.dto';
import reserveUseCase from '../use-cases/reserve.use-case';

@Injectable()
export class PrismaReserveServices implements ReserveActions {
  constructor(private prisma: PrismaService) {}

  async reserve(data: ReserveDto, user: User): Promise<any> {
    return reserveUseCase(this.prisma, data, user);
  }
}
