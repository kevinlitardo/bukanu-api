import { User } from '@clerk/express';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { ClerkAuthGuard } from 'src/common/filters/guards/clerk-auth.guard';
import { ReserveActions } from './architecture/reserve.actions';
import { ReserveDto } from './dto/reserve.dto';

@Controller('reservations')
@UseGuards(ClerkAuthGuard)
export class ReserveController {
  constructor(private readonly actions: ReserveActions) {}

  @Post()
  @SuccessMessage('Cita agendada')
  async getAvailability(@Body() dto: ReserveDto, @Req() req) {
    const user: User = req.user;
    return await this.actions.reserve(dto, user);
  }
}
