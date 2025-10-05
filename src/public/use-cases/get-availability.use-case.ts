import { PrismaService } from 'prisma/prisma.service';
import { GetAvailabilityDto } from '../dto/get-availability.dto';
import { endOfDay, startOfDay } from 'date-fns';
import {
  generateTimeSlots,
  getCurrentDay,
} from 'src/common/utils/availability';

export async function getAvailabilityUseCase(
  prisma: PrismaService,
  data: GetAvailabilityDto,
): Promise<any> {
  const { business_id, worker_id, date } = data;

  const business = await prisma.business.findUnique({
    where: { id: business_id },
    select: {
      open_time_weekday: true,
      close_time_weekday: true,
      open_on_saturday: true,
      open_on_sunday: true,
      open_time_weekend: true,
      close_time_weekend: true,
    },
  });

  const appointments = await prisma.appointment.findMany({
    where: {
      business_id,
      worker_id: worker_id ?? undefined,
      status: { in: ['CONFIRMED', 'PENDING'] },
      OR: [
        { status: 'CONFIRMED' },
        { status: 'PENDING', expires_at: { gt: new Date() } },
      ],
    },
    orderBy: { start_time: 'asc' },
    select: {
      id: true,
      start_time: true,
      end_time: true,
      status: true,
      services: true,
      worker_id: true,
    },
  });

  const currentDay = getCurrentDay();

  // let start: string;
  // let end: string;

  // if (currentDay === 6 && business?.open_on_saturday) {
  //   start = business.open_time_weekend ?? '00:00';
  //   end = business.close_time_weekend ?? '00:00';
  // }

  // const dayTimeSlots = generateTimeSlots();

  return appointments;
}
