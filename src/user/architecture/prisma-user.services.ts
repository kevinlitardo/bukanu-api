// business/prisma-business.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserActions } from './user.actions';
import { CreateUserDto } from '../dto/create-user.dto';
import { syncUser } from '../use-cases/sync-user';
import { User } from '@clerk/express';
import { SyncUserDto } from '../dto/sync-user.dto';

@Injectable()
export class PrismaUserServices implements UserActions {
  constructor(private prisma: PrismaService) {}

  async sync(data: SyncUserDto, user: User): Promise<void> {
    syncUser(this.prisma, data, user);
  }
}
