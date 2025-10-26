import { User } from '@clerk/express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClerkAuthGuard } from 'src/common/guards/clerk-auth.guard';
import { ServiceActions } from './architecture/service.actions';
import { CreateServiceDto } from './dto/create-service.dto';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('services')
@UseGuards(ClerkAuthGuard)
export class ServiceController {
  constructor(private readonly actions: ServiceActions) {}

  @Get('/:slug')
  async list(@Param('slug') slug: string, @Req() req) {
    const user: User = req.user;
    return await this.actions.list(slug, user);
  }

  @Get('/:slug/:id')
  async getById(
    @Param('slug') slug: string,
    @Param('id') id: string,
    @Req() req,
  ) {
    const user: User = req.user;
    return await this.actions.getById(slug, id, user);
  }

  @Post()
  @SuccessMessage('Servicio creado')
  async create(@Body() data: CreateServiceDto, @Req() req) {
    const user: User = req.user;
    return await this.actions.create(data, user);
  }

  @Put('/:id')
  @SuccessMessage('Servicio actualizado')
  async update(
    @Param('id') id: string,
    @Body() data: CreateServiceDto,
    @Req() req,
  ) {
    const user: User = req.user;
    return await this.actions.update(id, data, user);
  }

  @Put('/status/:id')
  @SuccessMessage('Estado del servicio actualizado')
  async updateStatus(
    @Param('id') id: string,
    @Body() data: UpdateStatusDto,
    @Req() req,
  ) {
    const user: User = req.user;
    return await this.actions.updateStatus(id, data, user);
  }

  @Delete('/:id')
  @SuccessMessage('Servicio eliminado')
  async delete(@Param('id') id: string, @Req() req) {
    const user: User = req.user;
    return await this.actions.delete(id, user);
  }
}
