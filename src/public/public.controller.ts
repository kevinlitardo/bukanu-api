import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PublicActions } from './architecture/public.actions';
import { GetAvailabilityDto } from './dto/get-availability.dto';

@Controller('public')
export class PublicController {
  constructor(private readonly actions: PublicActions) {}

  @Get('/businesses')
  async listBusinesses() {
    return await this.actions.listBusinesses();
  }

  @Get('/business/:slug')
  async getBusinessData(@Param('slug') slug: string) {
    return await this.actions.getBusinessData(slug);
  }

  @Post('/availability')
  async getAvailability(@Body() dto: GetAvailabilityDto) {
    return await this.actions.getAvailability(dto);
  }
}
