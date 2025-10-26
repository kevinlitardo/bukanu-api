import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { BusinessActions } from './architecture/business.actions';
import { CreateBusinessDto } from './dto/create-business.dto';
import { ClerkAuthGuard } from 'src/common/guards/clerk-auth.guard';
import { User } from '@clerk/express';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { SubscriptionGuard } from 'src/common/guards/subscription.guard';

@Controller('businesses')
@UseGuards(ClerkAuthGuard, SubscriptionGuard)
export class BusinessController {
  constructor(private readonly actions: BusinessActions) {}

  @Get('/user')
  async listUserBusinesses(@Req() req) {
    const user: User = req.user;
    return await this.actions.listUserBusinesses(user);
  }

  @Get('/:slug')
  async getBusinessData(@Param('slug') slug: string, @Req() req) {
    const user: User = req.user;
    return await this.actions.getBusinessData(slug, user);
  }

  @Post()
  @SuccessMessage(
    'Negocio creado, puedes ajustar su configuración dentro del dashboard',
  )
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() dto: CreateBusinessDto,
    @UploadedFile() logo: Express.Multer.File,
    @Req() req,
  ) {
    const user: User = req.user;
    return await this.actions.create(dto, logo, user);
  }

  @Put('/:slug')
  @SuccessMessage('Negocio actualizado')
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('slug') slug: string,
    @Body() dto: UpdateBusinessDto,
    @UploadedFile() logo: Express.Multer.File,
    @Req() req,
  ) {
    const user: User = req.user;
    return await this.actions.update(slug, dto, logo, user);
  }

  @Put('/status/:slug')
  @SuccessMessage('Estado del negocio actualizado')
  async updateStatus(
    @Param('slug') slug: string,
    @Body() dto: UpdateStatusDto,
    @Req() req,
  ) {
    const user: User = req.user;
    return await this.actions.updateStatus(slug, dto, user);
  }

  @Delete('/:slug')
  @SuccessMessage(
    'Negocio eliminado temporalmente y correo de confirmación enviado',
  )
  async delete(@Param('slug') slug: string, @Req() req) {
    const user: User = req.user;
    return await this.actions.delete(slug, user);
  }

  @Put('/restore/:slug')
  @SuccessMessage('Negocio restaurado')
  async restore(@Param('slug') slug: string, @Req() req) {
    const user: User = req.user;
    return await this.actions.restore(slug, user);
  }

  @Put('/configuration/:slug')
  @SuccessMessage('Configuración del negocio actualizada')
  async updateConfiguration(
    @Param('slug') slug: string,
    @Body() dto: UpdateConfigurationDto,
    @Req() req,
  ) {
    const user: User = req.user;
    return await this.actions.updateConfiguration(slug, dto, user);
  }
}
