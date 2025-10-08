import { PrismaService } from 'prisma/prisma.service';
import { GetAvailabilityDto } from '../dto/get-availability.dto';
import {
  formatTime,
  generateTimeRange,
  generateTimeSlots,
  getCurrentDay,
  getFreeSlots,
  getRequiredSlotCount,
} from 'src/common/utils/availability';
import { BadRequestException } from '@nestjs/common';
import { differenceInMinutes, endOfDay, startOfDay } from 'date-fns';

export async function getAvailabilityUseCase(
  prisma: PrismaService,
  data: GetAvailabilityDto,
): Promise<any> {
  const { business_id, worker_id, services, date } = data;

  const business = await prisma.business.findUnique({
    where: { id: business_id },
    select: {
      open_time_weekday: true,
      close_time_weekday: true,
      open_on_saturday: true,
      open_on_sunday: true,
      open_time_weekend: true,
      close_time_weekend: true,
      services: {
        select: {
          id: true,
          duration: true,
        },
      },
    },
  });

  if (!business) {
    throw new BadRequestException('El negocio no existe');
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      business_id,
      worker_id: worker_id ?? undefined,
      date: {
        gte: startOfDay(date),
        lt: endOfDay(date),
      },
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
    },
  });

  const currentDay = getCurrentDay(date);

  let start: string = formatTime(business.open_time_weekday);
  let end: string = formatTime(business.close_time_weekday);

  if (currentDay === 6 || currentDay === 7) {
    if (business.open_on_saturday || business.open_on_sunday) {
      start = formatTime(business.open_time_weekend!);
      end = formatTime(business.close_time_weekend!);
    }
  }

  const dayTimeSlots = generateTimeSlots(start, end);

  const appointmentsSlots = appointments.map((app) => {
    const duration = differenceInMinutes(app.end_time, app.start_time);
    const slotsRequired = getRequiredSlotCount(duration);
    const slots = generateTimeRange(formatTime(app.start_time), slotsRequired);

    return {
      id: app.id,
      slots,
    };
  });

  appointmentsSlots.forEach((app) =>
    app.slots.forEach((hour) => (dayTimeSlots[hour] = app.id)),
  );

  const slotsRequired = business.services
    .filter((s) => services.includes(s.id))
    .reduce((acc, val) => {
      const { duration } = val;
      const count = getRequiredSlotCount(duration);
      return acc + count;
    }, 0);

  const availableSlots = getFreeSlots(dayTimeSlots, slotsRequired);

  return availableSlots;
}
