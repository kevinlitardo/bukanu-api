import { PrismaService } from 'prisma/prisma.service';
import { GetAvailabilityDto } from '../dto/get-availability.dto';
import verifyAvailableSlots from 'src/common/utils/verify-available-slots';

export async function getAvailabilityUseCase(
  prisma: PrismaService,
  data: GetAvailabilityDto,
): Promise<string[]> {
  const { availableSlots } = await verifyAvailableSlots(prisma, data);
  return availableSlots;
}
