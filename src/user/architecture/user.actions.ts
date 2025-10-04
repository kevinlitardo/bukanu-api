import { User } from '@clerk/express';

export abstract class UserActions {
  abstract sync(user: User): Promise<void>;
}
