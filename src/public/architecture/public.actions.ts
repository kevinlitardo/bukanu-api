import { GetAvailabilityDto } from '../dto/get-availability.dto';

export abstract class PublicActions {
  abstract listBusinesses(): Promise<any>;
  abstract getBusinessData(slug: string): Promise<any>;
  abstract getAvailability(data: GetAvailabilityDto): Promise<string[]>;
}
