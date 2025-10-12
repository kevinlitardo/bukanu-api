import { User } from '@clerk/express';
import { ReserveDto } from '../dto/reserve.dto';

export abstract class ReserveActions {
  abstract reserve(data: ReserveDto, user: User): Promise<any>;
}
