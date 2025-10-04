import { PrismaService } from 'prisma/prisma.service';
import { GetAvailabilityDto } from '../dto/get-availability.dto';

export async function getAvailabilityUseCase(
  prisma: PrismaService,
  data: GetAvailabilityDto,
): Promise<string[]> {
  const { business_id, worker_id } = data;

  return [];
}
