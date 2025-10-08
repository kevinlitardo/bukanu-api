import { User } from '@clerk/express';
import { SyncUserDto } from '../dto/sync-user.dto';

export abstract class UserActions {
  abstract sync(data: SyncUserDto, user: User): Promise<void>;
}
