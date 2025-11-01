import { Controller, UseGuards, Req, Post, Body } from '@nestjs/common';
import { UserActions } from './architecture/user.actions';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { ClerkAuthGuard } from 'src/common/filters/guards/clerk-auth.guard';
import { User } from '@clerk/express';
import { SyncUserDto } from './dto/sync-user.dto';

@Controller('users')
@UseGuards(ClerkAuthGuard)
export class UserController {
  constructor(private readonly userActions: UserActions) {}

  @Post('/sync')
  @SuccessMessage('Usuario sincronizado')
  async sync(@Body() data: SyncUserDto, @Req() req) {
    const user: User = req.user;
    await this.userActions.sync(data, user);
  }
}
