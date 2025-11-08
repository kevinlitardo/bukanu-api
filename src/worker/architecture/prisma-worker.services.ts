import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { WorkerActions } from './worker.actions';
import { CreateWorkerDto } from '../dto/create-worker.dto';
import { createWorkerUseCase } from '../use-cases/create-worker.use-case';
import { User } from '@clerk/express';
import { deleteWorkerUseCase } from '../use-cases/delete-worker.use-case';
import { UpdateStatusDto } from '../dto/update-status.dto';
import { updateStatusUseCase } from '../use-cases/update-status.use-case';
import { UpdateWorkerDto } from '../dto/update-worker.dto';
import { updateWorkerUseCase } from '../use-cases/update-worker.use-case';
import { getWorkerByIdUseCase } from '../use-cases/get-worker-by-id.use-case';
import { listBusinessWorkersUseCase } from '../use-cases/list-business-workers.use-case';

@Injectable()
export class PrismaWorkerServices implements WorkerActions {
  constructor(private prisma: PrismaService) {}

  async listBusinessWorkers(slug: string, user: User): Promise<any> {
    return await listBusinessWorkersUseCase(this.prisma, slug, user);
  }

  async getById(slug: string, id: string, user: User): Promise<any> {
    return await getWorkerByIdUseCase(this.prisma, slug, id, user);
  }

  async create(data: CreateWorkerDto, user: User): Promise<void> {
    await createWorkerUseCase(this.prisma, data, user);
  }

  async updateStatus(
    id: string,
    data: UpdateStatusDto,
    user: User,
  ): Promise<void> {
    await updateStatusUseCase(this.prisma, id, data, user);
  }

  async updateWorker(
    id: string,
    data: UpdateWorkerDto,
    user: User,
  ): Promise<void> {
    await updateWorkerUseCase(this.prisma, id, data, user);
  }

  async delete(id: string, user: User): Promise<void> {
    await deleteWorkerUseCase(this.prisma, id, user);
  }
}
