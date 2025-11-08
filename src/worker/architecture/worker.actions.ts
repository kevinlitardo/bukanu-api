import { User } from '@clerk/express';
import { CreateWorkerDto } from '../dto/create-worker.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';
import { UpdateWorkerDto } from '../dto/update-worker.dto';

export abstract class WorkerActions {
  abstract listBusinessWorkers(slug: string, user: User): Promise<any>;
  abstract getById(slug: string, id: string, user: User): Promise<any>;
  abstract create(data: CreateWorkerDto, user: User): Promise<void>;
  abstract updateStatus(
    id: string,
    data: UpdateStatusDto,
    user: User,
  ): Promise<void>;
  abstract updateWorker(
    id: string,
    data: UpdateWorkerDto,
    user: User,
  ): Promise<void>;
  abstract delete(id: string, user: User): Promise<void>;
}
