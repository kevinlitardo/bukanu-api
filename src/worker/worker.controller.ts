import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Req,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { WorkerActions } from './architecture/worker.actions';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { User } from '@clerk/express';
import { ClerkAuthGuard } from 'src/common/filters/guards/clerk-auth.guard';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';

@Controller('workers')
@UseGuards(ClerkAuthGuard)
export class WorkerController {
  constructor(private readonly actions: WorkerActions) {}

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
  @SuccessMessage('Trabajador creado')
  async create(@Body() dto: CreateWorkerDto, @Req() req) {
    const user: User = req.user;
    await this.actions.create(dto, user);
  }

  @Put('/status/:id')
  @SuccessMessage('Estado del trabajador actualizado')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @Req() req,
  ) {
    const user: User = req.user;
    await this.actions.updateStatus(id, dto, user);
  }

  @Put('/:id')
  @SuccessMessage('Trabajador actualizado')
  async updateWorker(
    @Param('id') id: string,
    @Body() dto: UpdateWorkerDto,
    @Req() req,
  ) {
    const user: User = req.user;
    await this.actions.updateWorker(id, dto, user);
  }

  @Delete('/:id')
  @SuccessMessage('Trabajador eliminado')
  async delete(@Param('id') id: string, @Req() req) {
    const user: User = req.user;
    await this.actions.delete(id, user);
  }
}
