import { PrismaService } from 'prisma/prisma.service';
import { addDays } from 'date-fns';
import parseStringToDateTime from 'src/common/lib/parse-string-to-datetime';
import { APPOINTMENT_STATUS } from '@prisma/client';

export async function createAppointmentsUseCase(
  prisma: PrismaService,
): Promise<any> {
  const data = [
    {
      business_id: 'cmgd3eqh00002lro8duatfnfx',
      user_id: 'cmgd43gfb0001lr2wwslmvpfn',
      status: APPOINTMENT_STATUS.CONFIRMED,
      date: addDays(new Date(), 1),
      start_time: parseStringToDateTime('12:00'),
      end_time: parseStringToDateTime('12:40'),
      client_name: 'Jhon Doe',
    },
    {
      business_id: 'cmgd3eqh00002lro8duatfnfx',
      user_id: 'cmgd43gfb0001lr2wwslmvpfn',
      status: APPOINTMENT_STATUS.CONFIRMED,
      date: addDays(new Date(), 1),
      start_time: parseStringToDateTime('13:20'),
      end_time: parseStringToDateTime('14:00'),
      client_name: 'Jhon Doe',
    },
    {
      business_id: 'cmgd3eqh00002lro8duatfnfx',
      user_id: 'cmgd43gfb0001lr2wwslmvpfn',
      status: APPOINTMENT_STATUS.CONFIRMED,
      date: addDays(new Date(), 1),
      start_time: parseStringToDateTime('14:10'),
      end_time: parseStringToDateTime('14:50'),
      client_name: 'Jhon Doe',
    },
    // {
    //   business_id: 'cmgd3eqh00002lro8duatfnfx',
    //   user_id: 'cmgd43gfb0001lr2wwslmvpfn',
    //   status: APPOINTMENT_STATUS.CONFIRMED,
    //   date: addDays(new Date(), 1),
    //   start_time: parseStringToDateTime('18:50'),
    //   end_time: parseStringToDateTime('19:30'),
    //   client_name: 'Jhon Doe',
    // },
    // worker_id
    {
      business_id: 'cmgd3eqh00002lro8duatfnfx',
      user_id: 'cmgd43gfb0001lr2wwslmvpfn',
      worker_id: 'cmgd43gfa0000lr2wa9g9k5e0',
      status: APPOINTMENT_STATUS.CONFIRMED,
      date: addDays(new Date(), 1),
      start_time: parseStringToDateTime('15:00'),
      end_time: parseStringToDateTime('15:30'),
      client_name: 'Jhon Doe',
    },
    {
      business_id: 'cmgd3eqh00002lro8duatfnfx',
      user_id: 'cmgd43gfb0001lr2wwslmvpfn',
      worker_id: 'cmgd43gfa0000lr2wa9g9k5e0',
      status: APPOINTMENT_STATUS.CONFIRMED,
      date: addDays(new Date(), 1),
      start_time: parseStringToDateTime('15:40'),
      end_time: parseStringToDateTime('16:20'),
      client_name: 'Jhon Doe',
    },
  ];

  await prisma.appointment.createMany({ data });
}
