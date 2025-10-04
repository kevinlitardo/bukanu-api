import { Controller, UseGuards, Req, Get } from '@nestjs/common';
import { UserActions } from './architecture/user.actions';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { ClerkAuthGuard } from 'src/common/guards/clerk-auth.guard';
import { User } from '@clerk/express';

@Controller('users')
@UseGuards(ClerkAuthGuard)
export class UserController {
  constructor(private readonly userActions: UserActions) {}

  @Get('/sync')
  @SuccessMessage('Usuario sincronizado')
  async sync(@Req() req) {
    const user: User = req.user;
    await this.userActions.sync(user);
  }
}
